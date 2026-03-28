# security/hashing.py
from passlib.context import CryptContext

# Configuración de bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Verifica si la contraseña en texto plano coincide con el hash de la BD"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Genera el hash de una contraseña nueva (lo usaremos al registrar usuarios)"""
    return pwd_context.hash(password)