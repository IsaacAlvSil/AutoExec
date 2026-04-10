from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from data.db import get_db
from models.models import Perfil, Usuario 
from models.schemas import PerfilUpdate, PerfilCreate
from datetime import datetime

router = APIRouter(prefix="/api/perfiles",
                   tags=["Perfiles"]
)

@router.get("/email/{email}")
def obtener_perfil_por_email(email: str, db: Session = Depends(get_db)):
    db_perfil = (
        db.query(Perfil)
        .join(Usuario, Perfil.id_usuario == Usuario.id_usuario)
        .filter(Usuario.email == email)
        .first()
    )
    
    if not db_perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    
    return db_perfil

@router.put("/{id_perfil}")
def actualizar_perfil(id_perfil: int, datos: PerfilUpdate, db: Session = Depends(get_db)):
    db_perfil = db.query(Perfil).filter(Perfil.id_perfil == id_perfil).first()
    
    if not db_perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    
    update_data = datos.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_perfil, key, value)
    
    db_perfil.fecha_actualizacion = datetime.now()


    db.commit()
    db.refresh(db_perfil)
    
    return db_perfil

@router.post("") 
def crear_perfil(perfil_data: PerfilCreate, db: Session = Depends(get_db)):
    
    usuario = db.query(Usuario).filter(Usuario.email == perfil_data.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado en la base de datos")

    perfil_existente = db.query(Perfil).filter(Perfil.id_usuario == usuario.id_usuario).first()
    if perfil_existente:
        raise HTTPException(status_code=400, detail="Este usuario ya tiene un perfil asignado")

    nuevo_perfil = Perfil(
        id_usuario=usuario.id_usuario,
        nombre=perfil_data.nombre,
        apellido=perfil_data.apellido,
        puesto_actual=perfil_data.puesto_actual,
        telefono=perfil_data.telefono,
        experiencia_anios=perfil_data.experiencia_anios,
        ubicacion=perfil_data.ubicacion,
        fecha_actualizacion=datetime.now()
        
        
    )
    
    try:
        db.add(nuevo_perfil)
        db.commit()
        db.refresh(nuevo_perfil)
        
        return nuevo_perfil 
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno al guardar: {str(e)}")