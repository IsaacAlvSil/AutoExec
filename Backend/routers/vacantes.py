from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from data.db import get_db
from models import models
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.schemas import VacanteCreate, VacanteUpdate

router = APIRouter(
    prefix="/api/vacantes",
    tags=["Vacantes"]
)

def crear_notificacion(db: Session, titulo: str, mensaje: str, tipo: str, id_usuario: Optional[int] = None):
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

# LEER VACANTES
@router.get("/")
def get_vacantes(db: Session = Depends(get_db)):
    return db.query(models.Vacante).all()

# LEER UNA VACANTE
@router.get("/{id_vacante}")
def get_vacante(id_vacante: int, db: Session = Depends(get_db)):
    vacante = db.query(models.Vacante).filter(models.Vacante.id_vacante == id_vacante).first()
    if not vacante:
        raise HTTPException(status_code=404, detail="Vacante no encontrada")
    return vacante

# CREAR VACANTE
@router.post("/")
def crear_vacante(vacante: VacanteCreate, db: Session = Depends(get_db)):
    nueva_vacante = models.Vacante(
        titulo            = vacante.titulo,
        descripcion       = vacante.descripcion,
        salario_ofrecido  = vacante.salario_ofrecido,
        estado            = vacante.estado,
        ubicacion         = vacante.ubicacion,
        modalidad         = vacante.modalidad,
        nivel_ingles      = vacante.nivel_ingles,
        id_departamento   = vacante.id_departamento,
        id_reclutador     = vacante.id_reclutador,
        fecha_cierre      = datetime.fromisoformat(vacante.fecha_cierre) if vacante.fecha_cierre else None,
        fecha_publicacion = datetime.utcnow()
    )
    db.add(nueva_vacante)
    db.commit()
    db.refresh(nueva_vacante)

    # Notificación para el reclutador que la creó
    if vacante.id_reclutador:
        crear_notificacion(
            db         = db,
            titulo     = "Vacante publicada exitosamente",
            mensaje    = f"Creaste la vacante '{nueva_vacante.titulo}' con salario ${nueva_vacante.salario_ofrecido:,.0f} MXN.",
            tipo       = "vacante",
            id_usuario = vacante.id_reclutador
        )

    # Notificación para todos los candidatos (rol 2)
    candidatos = db.query(models.Usuario).filter(models.Usuario.id_rol == 2).all()
    for candidato in candidatos:
        crear_notificacion(
            db         = db,
            titulo     = "Nueva vacante publicada",
            mensaje    = f"Se publicó la vacante '{nueva_vacante.titulo}' con salario ${nueva_vacante.salario_ofrecido:,.0f} MXN.",
            tipo       = "vacante",
            id_usuario = candidato.id_usuario
        )

    return nueva_vacante

# EDITAR VACANTE
@router.put("/{id_vacante}")
def actualizar_vacante(id_vacante: int, vacante: VacanteUpdate, db: Session = Depends(get_db)):
    db_vacante = db.query(models.Vacante).filter(models.Vacante.id_vacante == id_vacante).first()
    if not db_vacante:
        raise HTTPException(status_code=404, detail="Vacante no encontrada")

    id_reclutador = vacante.id_reclutador
    cambios = []
    for field, value in vacante.model_dump(exclude_unset=True).items():
        if field == "fecha_cierre" and value:
            value = datetime.fromisoformat(value)
        if field == "estado" and getattr(db_vacante, field) != value:
            cambios.append(f"Estado cambiado a '{value}'")
        setattr(db_vacante, field, value)

    db.commit()
    db.refresh(db_vacante)

    mensaje_notif = f"Se actualizó la vacante '{db_vacante.titulo}'."
    if cambios:
        mensaje_notif += " " + " | ".join(cambios)

    # Notificación para el reclutador que la editó
    if id_reclutador:
        crear_notificacion(
            db         = db,
            titulo     = "Vacante actualizada exitosamente",
            mensaje    = f"Actualizaste la vacante '{db_vacante.titulo}'. {' | '.join(cambios) if cambios else ''}",
            tipo       = "vacante",
            id_usuario = id_reclutador
        )

    # Notificación para todos los candidatos (rol 2)
    candidatos = db.query(models.Usuario).filter(models.Usuario.id_rol == 2).all()
    for candidato in candidatos:
        crear_notificacion(
            db         = db,
            titulo     = "Vacante actualizada",
            mensaje    = mensaje_notif,
            tipo       = "vacante",
            id_usuario = candidato.id_usuario
        )

    return db_vacante

# ELIMINAR VACANTE
@router.delete("/{id_vacante}")
def eliminar_vacante(id_vacante: int, db: Session = Depends(get_db)):
    db_vacante = db.query(models.Vacante).filter(models.Vacante.id_vacante == id_vacante).first()
    if not db_vacante:
        raise HTTPException(status_code=404, detail="Vacante no encontrada")

    titulo        = db_vacante.titulo
    id_reclutador = db_vacante.id_reclutador
    db.delete(db_vacante)
    db.commit()

    # Notificación para el reclutador que la eliminó
    if id_reclutador:
        crear_notificacion(
            db         = db,
            titulo     = "Vacante eliminada",
            mensaje    = f"Eliminaste la vacante '{titulo}' del sistema.",
            tipo       = "vacante",
            id_usuario = id_reclutador
        )

    # Notificación general sin usuario (para logs del sistema)
    crear_notificacion(
        db         = db,
        titulo     = "Vacante eliminada del sistema",
        mensaje    = f"La vacante '{titulo}' fue eliminada.",
        tipo       = "vacante",
        id_usuario = None
    )

    return {"mensaje": "Vacante eliminada correctamente"}