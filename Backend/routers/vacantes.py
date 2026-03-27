from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from data.db import SessionLocal
from models import models

# Creamos el router (un mini-main.py exclusivo para vacantes)
router = APIRouter(
    prefix="/api/vacantes",
    tags=["Vacantes"]
)

# Dependencia de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🟢 LEER VACANTES
@router.get("/")
def get_vacantes(db: Session = Depends(get_db)):
    return db.query(models.Vacante).all()

# 🔵 CREAR VACANTE
@router.post("/")
def crear_vacante(title: str, company: str, urgent: bool = False, db: Session = Depends(get_db)):
    nueva_vacante = models.Vacante(title=title, company=company, urgent=urgent)
    db.add(nueva_vacante)
    db.commit()
    db.refresh(nueva_vacante)
    return nueva_vacante