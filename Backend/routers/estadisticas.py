from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from data.db import get_db
from models import models

router = APIRouter(
    prefix="/api/estadisticas",
    tags=["Estadisticas"]
)

# VACANTES POR MODALIDAD
@router.get("/vacantes-por-modalidad")
def vacantes_por_modalidad(db: Session = Depends(get_db)):
    resultado = db.query(
        models.Vacante.modalidad,
        func.count(models.Vacante.id_vacante).label("total")
    ).group_by(models.Vacante.modalidad).all()
    return [{"modalidad": r.modalidad, "total": r.total} for r in resultado]

# POSTULACIONES POR VACANTE
@router.get("/postulaciones-por-vacante")
def postulaciones_por_vacante(db: Session = Depends(get_db)):
    resultado = db.query(
        models.Vacante.titulo,
        func.count(models.Postulacion.id_postulacion).label("total")
    ).join(models.Postulacion, models.Vacante.id_vacante == models.Postulacion.id_vacante)\
     .group_by(models.Vacante.titulo).all()
    return [{"vacante": r.titulo, "total": r.total} for r in resultado]

# POSTULACIONES POR DEPARTAMENTO
@router.get("/postulaciones-por-departamento")
def postulaciones_por_departamento(db: Session = Depends(get_db)):
    resultado = db.query(
        models.Departamento.nombre,
        func.count(models.Postulacion.id_postulacion).label("total")
    ).join(models.Vacante, models.Departamento.id_departamento == models.Vacante.id_departamento)\
     .join(models.Postulacion, models.Vacante.id_vacante == models.Postulacion.id_vacante)\
     .group_by(models.Departamento.nombre).all()
    return [{"departamento": r.nombre, "total": r.total} for r in resultado]