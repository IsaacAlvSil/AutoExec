from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from data.db import get_db
from models import models
from pydantic import BaseModel
from datetime import datetime
from models.schemas import PostulacionCreate
from models.models import Perfil, Usuario, Notificacion

router = APIRouter(
    prefix="/api/postulaciones",
    tags=["Postulaciones"]
)

class RespuestaPostulacion(BaseModel):
    estado: str 

def crear_notificacion(db: Session, titulo: str, mensaje: str, tipo: str, id_usuario: int = None):
    notif = models.Notificacion(
        id_usuario  = id_usuario,
        tipo        = tipo,
        titulo      = titulo,
        mensaje     = mensaje,
        leida       = False,
        fecha_envio = datetime.utcnow()
    )
    db.add(notif)
    db.commit()

# LEER TODAS LAS POSTULACIONES
@router.get("/")
def get_postulaciones(db: Session = Depends(get_db)):
    return db.query(models.Postulacion).all()

# POSTULACIONES DE UN USUARIO
@router.get("/usuario/{id_usuario}")
def get_postulaciones_usuario(id_usuario: int, db: Session = Depends(get_db)):
    return db.query(models.Postulacion)\
        .filter(models.Postulacion.id_usuario == id_usuario)\
        .all()


# CONTAR PROCESOS ACTIVOS (EN REVISIÓN)
@router.get("/usuario/{id_usuario}/activas")
def get_procesos_activos(id_usuario: int, db: Session = Depends(get_db)):
    cantidad = db.query(models.Postulacion)\
        .join(models.EstadoPostulacion)\
        .filter(
            models.Postulacion.id_usuario == id_usuario,
            models.EstadoPostulacion.nombre.ilike("%revis%")
        ).count()
        
    return {"procesos_activos": cantidad}

# CONTAR TODAS LAS POSTULACIONES DEL USUARIO
@router.get("/usuario/{id_usuario}/total")
def get_total_postulaciones(id_usuario: int, db: Session = Depends(get_db)):
    cantidad = db.query(models.Postulacion)\
        .filter(models.Postulacion.id_usuario == id_usuario)\
        .count()
    return {"total": cantidad}

# POSTULACIONES DE UNA VACANTE CON PERFIL DEL CANDIDATO
@router.get("/vacante/{id_vacante}/candidatos")
def get_candidatos_vacante(id_vacante: int, db: Session = Depends(get_db)):
    postulaciones = db.query(models.Postulacion)\
        .filter(models.Postulacion.id_vacante == id_vacante)\
        .all()

    resultado = []
    for p in postulaciones:
        perfil  = db.query(Perfil).filter(Perfil.id_usuario == p.id_usuario).first()
        usuario = db.query(Usuario).filter(Usuario.id_usuario == p.id_usuario).first()
        certificaciones = db.query(models.Certificacion)\
            .filter(models.Certificacion.id_perfil == perfil.id_perfil)\
            .all() if perfil else []

        resultado.append({
            "id_postulacion":    p.id_postulacion,
            "id_usuario":        p.id_usuario,
            "id_vacante":        p.id_vacante,
            "fecha_postulacion": str(p.fecha_postulacion),
            "id_estado":         p.id_estado,
            "email":             usuario.email if usuario else None,
            "perfil": {
                "id_perfil":           perfil.id_perfil           if perfil else None,
                "nombre":              perfil.nombre              if perfil else None,
                "apellido":            perfil.apellido            if perfil else None,
                "telefono":            perfil.telefono            if perfil else None,
                "puesto_actual":       perfil.puesto_actual       if perfil else None,
                "experiencia_anios":   perfil.experiencia_anios   if perfil else None,
                "resumen_profesional": perfil.resumen_profesional if perfil else None,
                "ubicacion":           perfil.ubicacion           if perfil else None,
                "certificaciones": [
                    {
                        "id_certificacion": c.id_certificacion,
                        "nombre":           c.nombre,
                        "institucion":      c.institucion,
                        "anio":             c.anio,
                    } for c in certificaciones
                ]
            } if perfil else None
        })
    return resultado

# POSTULACIONES DE UNA VACANTE (simple)
@router.get("/vacante/{id_vacante}")
def get_postulaciones_vacante(id_vacante: int, db: Session = Depends(get_db)):
    return db.query(models.Postulacion)\
        .filter(models.Postulacion.id_vacante == id_vacante)\
        .all()

# CREAR POSTULACION
@router.post("/")
def crear_postulacion(postulacion: PostulacionCreate, db: Session = Depends(get_db)):
    existe = db.query(models.Postulacion).filter(
        models.Postulacion.id_usuario == postulacion.id_usuario,
        models.Postulacion.id_vacante == postulacion.id_vacante
    ).first()
    if existe:
        raise HTTPException(status_code=400, detail="El usuario ya está postulado a esta vacante")

    vacante = db.query(models.Vacante).filter(models.Vacante.id_vacante == postulacion.id_vacante).first()
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == postulacion.id_usuario).first()

    if not vacante:
        raise HTTPException(status_code=404, detail="Vacante no encontrada")
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    nueva = models.Postulacion(
        id_usuario        = postulacion.id_usuario,
        id_vacante        = postulacion.id_vacante,
        id_estado         = postulacion.id_estado,
        fecha_postulacion = datetime.utcnow()
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    crear_notificacion(
        db         = db,
        titulo     = "Nueva postulación recibida",
        mensaje    = f"{usuario.email} se postuló a la vacante '{vacante.titulo}'.",
        tipo       = "postulacion",
        id_usuario = None
    )
    crear_notificacion(
        db         = db,
        titulo     = "Postulación enviada",
        mensaje    = f"Tu postulación a '{vacante.titulo}' fue recibida correctamente.",
        tipo       = "postulacion",
        id_usuario = postulacion.id_usuario
    )

    return nueva

# ENVIAR RESPUESTA AL CANDIDATO
@router.post("/{id_postulacion}/respuesta")
def responder_postulacion(id_postulacion: int, respuesta: RespuestaPostulacion, db: Session = Depends(get_db)):
    postulacion = db.query(models.Postulacion)\
        .filter(models.Postulacion.id_postulacion == id_postulacion)\
        .first()
    if not postulacion:
        raise HTTPException(status_code=404, detail="Postulación no encontrada")

    vacante = db.query(models.Vacante)\
        .filter(models.Vacante.id_vacante == postulacion.id_vacante)\
        .first()

    mensajes = {
        "aceptada":    f"¡Felicidades! Tu postulación a '{vacante.titulo}' ha sido aceptada.",
        "rechazada":   f"Tu postulación a '{vacante.titulo}' no fue seleccionada en esta ocasión.",
        "en_revision": f"Tu postulación a '{vacante.titulo}' está siendo revisada por el equipo.",
    }

    notif = models.Notificacion(
        id_usuario  = postulacion.id_usuario,
        tipo        = "postulacion",
        titulo      = "Actualización de tu postulación",
        mensaje     = mensajes.get(respuesta.estado, f"Actualización sobre tu postulación a '{vacante.titulo}'."),
        leida       = False,
        fecha_envio = datetime.utcnow()
    )
    db.add(notif)
    db.commit()

    return {"mensaje": "Respuesta enviada al candidato correctamente"}

# ELIMINAR POSTULACION
@router.delete("/{id_postulacion}")
def eliminar_postulacion(id_postulacion: int, db: Session = Depends(get_db)):
    postulacion = db.query(models.Postulacion)\
        .filter(models.Postulacion.id_postulacion == id_postulacion)\
        .first()
    if not postulacion:
        raise HTTPException(status_code=404, detail="Postulación no encontrada")
    db.delete(postulacion)
    db.commit()
    return {"mensaje": "Postulación eliminada correctamente"}