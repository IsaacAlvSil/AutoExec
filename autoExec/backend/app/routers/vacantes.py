from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models

router = APIRouter(prefix="/vacantes", tags=["Vacantes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def listar(db: Session = Depends(get_db)):
    return db.query(models.Vacante).all()

@router.post("/")
def crear(data: dict, db: Session = Depends(get_db)):
    vacante = models.Vacante(**data)
    db.add(vacante)
    db.commit()
    return vacante