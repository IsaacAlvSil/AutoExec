from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Ajusta estas importaciones según cómo se llamen tus archivos
from models import models
from models import schemas
from data.db import get_db 

router = APIRouter(
    prefix="/api/certificaciones",
    tags=["Certificaciones"]
)

#1. CREATE: Guardar una nueva certificación
@router.post("/", response_model=schemas.CertificacionOut)
def crear_certificacion(cert: schemas.CertificacionCreate, db: Session = Depends(get_db)):
    # Desempaquetamos los datos recibidos y los guardamos
    db_cert = models.Certificacion(**cert.model_dump()) 
    db.add(db_cert)
    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.get("/perfil/{id_perfil}", response_model=List[schemas.CertificacionOut])
def obtener_certificaciones(id_perfil: int, db: Session = Depends(get_db)):
    certificaciones = db.query(models.Certificacion).filter(models.Certificacion.id_perfil == id_perfil).all()
    return certificaciones

#3. UPDATE: Editar una certificación existente
@router.put("/{id_certificacion}", response_model=schemas.CertificacionOut)
def actualizar_certificacion(id_certificacion: int, cert: schemas.CertificacionBase, db: Session = Depends(get_db)):
    db_cert = db.query(models.Certificacion).filter(models.Certificacion.id_certificacion == id_certificacion).first()
    
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certificación no encontrada")
    
    # Actualizamos los campos
    db_cert.nombre = cert.nombre
    db_cert.institucion = cert.institucion
    db_cert.anio = cert.anio
    
    db.commit()
    db.refresh(db_cert)
    return db_cert

# 4. DELETE: Borrar una certificación
@router.delete("/{id_certificacion}")
def eliminar_certificacion(id_certificacion: int, db: Session = Depends(get_db)):
    db_cert = db.query(models.Certificacion).filter(models.Certificacion.id_certificacion == id_certificacion).first()
    
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certificación no encontrada")
    
    db.delete(db_cert)
    db.commit()
    return {"mensaje": "Certificación eliminada correctamente"}