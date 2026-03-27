from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from data.db import SessionLocal
from models.models import Usuario
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

# Dependencia para obtener la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Esquema para recibir datos del login
class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # 1. Buscar al usuario por email
    user = db.query(Usuario).filter(Usuario.email == request.email).first()
    
    # 2. Verificar si existe
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El correo electrónico no está registrado"
        )
    
    # 3. Verificar contraseña (aquí comparamos el string directamente con password_hash)
    if user.password_hash != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta"
        )
    
    # 4. Si todo está bien, devolvemos datos básicos del usuario
    return {
        "status": "success",
        "message": "Login exitoso",
        "user": {
            "id": user.id_usuario,
            "email": user.email,
            "id_rol": user.id_rol
        }
    }