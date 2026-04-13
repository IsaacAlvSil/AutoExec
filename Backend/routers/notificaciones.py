from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from data.db import get_db
from models import models
from datetime import datetime
from models.schemas import NotificacionCreate

router = APIRouter(
    prefix="/api/notificaciones",
    tags=["Notificaciones"]
)

def obtener_tiempo_relativo(fecha_bd: datetime):
    if not fecha_bd:
        return "Desconocido"
    ahora = datetime.now()
    diferencia = ahora - fecha_bd
    segundos = diferencia.total_seconds()
    if segundos < 60:
        return "Hace un momento"
    minutos = int(segundos / 60)
    if minutos < 60:
        return f"Hace {minutos} min"
    horas = int(minutos / 60)
    if horas < 24:
        return f"Hace {horas} horas"
    dias = int(horas / 24)
    if dias == 1:
        return "Ayer"
    return f"Hace {dias} días"

# NOTIFICACIONES PARA EL PANEL ADMIN (reclutador + generales NULL + postulaciones)
@router.get("/admin/{id_usuario}")
def get_notificaciones_admin(id_usuario: int, db: Session = Depends(get_db)):
    return db.query(models.Notificacion)\
        .filter(
            (models.Notificacion.id_usuario == None) |
            (models.Notificacion.id_usuario == id_usuario)
        )\
        .order_by(models.Notificacion.fecha_envio.desc())\
        .all()

# NOTIFICACIONES DE UN USUARIO (para app móvil)
@router.get("/usuario/{id_usuario}")
def get_notificaciones_usuario(id_usuario: int, db: Session = Depends(get_db)):
    return db.query(models.Notificacion)\
        .filter(models.Notificacion.id_usuario == id_usuario)\
        .order_by(models.Notificacion.fecha_envio.desc())\
        .all()

# NOTIFICACIONES POR EMAIL (para app móvil)
@router.get("/usuario/email/{email}")
def get_notificaciones_por_email(email: str, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    notificaciones = db.query(models.Notificacion)\
        .filter(models.Notificacion.id_usuario == usuario.id_usuario)\
        .order_by(models.Notificacion.fecha_envio.desc())\
        .all()

    return [{
        "id":                n.id_notificacion,
        "id_notificacion":   n.id_notificacion,
        "id_usuario":        n.id_usuario,
        "titulo":            n.titulo,
        "mensaje":           n.mensaje,
        "tipo":              n.tipo,
        "leida":             n.leida,
        "fecha_creacion":    n.fecha_envio.isoformat() if n.fecha_envio else None,
        "tiempo":            obtener_tiempo_relativo(n.fecha_envio)
    } for n in notificaciones]

# CREAR NOTIFICACION
@router.post("/")
def crear_notificacion(notif: NotificacionCreate, db: Session = Depends(get_db)):
    nueva = models.Notificacion(
        id_usuario  = notif.id_usuario,
        tipo        = notif.tipo,
        titulo      = notif.titulo,
        mensaje     = notif.mensaje,
        leida       = False,
        fecha_envio = datetime.utcnow()
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# MARCAR COMO LEIDA
@router.put("/{id_notificacion}/leida")
def marcar_leida(id_notificacion: int, db: Session = Depends(get_db)):
    notif = db.query(models.Notificacion)\
        .filter(models.Notificacion.id_notificacion == id_notificacion)\
        .first()
    if notif:
        notif.leida = True
        db.commit()
    return {"mensaje": "Notificación marcada como leída"}

# MARCAR TODAS COMO LEIDAS
@router.put("/leidas/todas")
def marcar_todas_leidas(db: Session = Depends(get_db)):
    db.query(models.Notificacion)\
        .filter(models.Notificacion.leida == False)\
        .update({"leida": True})
    db.commit()
    return {"mensaje": "Todas las notificaciones marcadas como leídas"}

# ELIMINAR NOTIFICACION
@router.delete("/{id_notificacion}")
def eliminar_notificacion(id_notificacion: int, db: Session = Depends(get_db)):
    notif = db.query(models.Notificacion)\
        .filter(models.Notificacion.id_notificacion == id_notificacion)\
        .first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    db.delete(notif)
    db.commit()
    return {"mensaje": "Notificación eliminada correctamente"}