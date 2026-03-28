# routers/auth_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from data.db import get_db

from models.schemas import UsuarioCreate # Asegúrate de importarlo arriba
from security.hashing import get_password_hash # Importa la función de encriptado

# Importamos el modelo de Base de Datos y el Schema de Pydantic
from models.models import Usuario  # <-- Ajusta esto al nombre exacto de tu archivo donde está la clase Usuario
from models.schemas import LoginRequest

# Importamos nuestra herramienta de seguridad
from security.hashing import verify_password

router = APIRouter(prefix="/api", tags=["Autenticación"])

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # 1. Buscar al usuario
    usuario = db.query(Usuario).filter(Usuario.email == request.email).first()

    # 2. Verificar existencia y contraseña usando nuestra función desacoplada
    if not usuario or not verify_password(request.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
        )
    
    # 3. Verificar estado
    if usuario.estado != "activo":
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Esta cuenta está inactiva",
        )

    # 4. Éxito
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
    # 1. Verificar si el correo ya existe
    usuario_existente = db.query(Usuario).filter(Usuario.email == request.email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    # 2. Encriptar la contraseña
    hashed_password = get_password_hash(request.password)

    # 3. Crear el nuevo usuario (el estado activo y las fechas se ponen solos)
    nuevo_usuario = Usuario(
        email=request.email,
        password_hash=hashed_password,
        id_rol=request.id_rol
    )

    # 4. Guardar en la base de datos
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return {"mensaje": "Usuario creado exitosamente", "id_usuario": nuevo_usuario.id_usuario}