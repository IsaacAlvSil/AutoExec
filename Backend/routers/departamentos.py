from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from data.db import get_db
from models import models

router = APIRouter(
    prefix="/api/departamentos",
    tags=["Departamentos"]
)

@router.get("/")
def get_departamentos(db: Session = Depends(get_db)):
    return db.query(models.Departamento).all()