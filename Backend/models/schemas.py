# models/schemas.py
from pydantic import BaseModel
from typing import Optional

# Modelo para recibir los datos del frontend
class LoginRequest(BaseModel):
    email: str
    password: str

class UsuarioCreate(BaseModel):
    email: str
    password: str
    id_rol: int

#Esquema para enviar vacantes a la app
class VacanteResponse(BaseModel):
    id_vacante: int
    titulo: str
    descripcion: str
    salario_ofrecido: float
    estado: str
    ubicacion: Optional[str] = None
    modalidad: Optional[str] = None
    nivel_ingles: Optional[str] = None

    class Config:
        from_attributes = True


class CertificacionBase(BaseModel):
    nombre: str
    institucion: str
    anio: Optional[int] = None

# Lo que pedimos cuando React Native hace un POST (Crear)
class CertificacionCreate(CertificacionBase):
    id_perfil: int

# Lo que FastAPI le responde a React Native
class CertificacionOut(CertificacionBase):
    id_certificacion: int
    id_perfil: int

    class Config:
        from_attributes = True



class PerfilUpdate(BaseModel):
    puesto_actual: Optional[str] = None
    telefono: Optional[str] = None
    experiencia_anios: Optional[int] = None
    resumen_profesional: Optional[str] = None