# routers/auth_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from data.db import get_db

from models.schemas import UsuarioCreate 
from security.hashing import get_password_hash 

from models.models import Usuario  
from models.schemas import LoginRequest, PasswordResetDirecto

from security.hashing import verify_password

router = APIRouter(prefix="/api", tags=["Autenticación"])

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == request.email).first()

    if not usuario or not verify_password(request.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
        )
    
    if usuario.estado != "activo":
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Esta cuenta está inactiva",
        )

    return {
        "mensaje": "Login exitoso",
        "usuario": {
            "id_usuario": usuario.id_usuario,
            "email": usuario.email,
            "id_rol": usuario.id_rol
        }
    }


@router.post("/registro")
def registrar_usuario(request: UsuarioCreate, db: Session = Depends(get_db)):
    usuario_existente = db.query(Usuario).filter(Usuario.email == request.email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    hashed_password = get_password_hash(request.password)

    nuevo_usuario = Usuario(
        email=request.email,
        password_hash=hashed_password,
        id_rol=request.id_rol
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return {"mensaje": "Usuario creado exitosamente", "id_usuario": nuevo_usuario.id_usuario}


@router.post("/cambiar-password-directo")
def cambiar_password_directo(request: PasswordResetDirecto, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == request.email).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No existe una cuenta con este correo."
        )

    usuario.password_hash = get_password_hash(request.nueva_password)

    db.commit()

    return {"mensaje": "Contraseña actualizada correctamente"}