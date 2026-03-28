from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from data.db import get_db

# IMPORTANTE: Importamos Perfil y Usuario para poder unirlos
from models.models import Perfil, Usuario 
from models.schemas import PerfilUpdate

router = APIRouter(prefix="/api/perfiles", tags=["Perfiles"])

# 1. READ: Obtener perfil por correo usando JOIN
@router.get("/email/{email}")
def obtener_perfil_por_email(email: str, db: Session = Depends(get_db)):
    # Buscamos el perfil que esté ligado al usuario que tenga ese email
    db_perfil = (
        db.query(Perfil)
        .join(Usuario, Perfil.id_usuario == Usuario.id_usuario)
        .filter(Usuario.email == email)
        .first()
    )
    
    if not db_perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    
    return db_perfil

# 2. UPDATE: Actualizar perfil 
@router.put("/{id_perfil}")
def actualizar_perfil(id_perfil: int, datos: PerfilUpdate, db: Session = Depends(get_db)):
    db_perfil = db.query(Perfil).filter(Perfil.id_perfil == id_perfil).first()
    
    if not db_perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    
    # Actualizamos solo las columnas que existen en tu base de datos
    if datos.puesto_actual is not None:
        db_perfil.puesto_actual = datos.puesto_actual
        
    if datos.telefono is not None:
        db_perfil.telefono = datos.telefono
        
    if datos.experiencia_anios is not None:
        db_perfil.experiencia_anios = datos.experiencia_anios
        
    if datos.resumen_profesional is not None:
        db_perfil.resumen_profesional = datos.resumen_profesional
        
    db.commit()
    db.refresh(db_perfil)
    
    return db_perfil