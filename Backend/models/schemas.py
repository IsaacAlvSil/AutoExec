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
    nombre: Optional[str] = None      
    apellido: Optional[str] = None  
    puesto_actual: Optional[str] = None
    telefono: Optional[str] = None
    experiencia_anios: Optional[int] = None
    resumen_profesional: Optional[str] = None
    area: Optional[str] = None
    ubicacion: Optional[str] = None  

class PerfilCreate(BaseModel):
    nombre: str
    apellido: str
    puesto_actual: Optional[str] = None
    telefono: Optional[str] = None
    experiencia_anios: Optional[int] = 0
    area: Optional[str] = None
    ubicacion: Optional[str] = None
    email: str 

class PasswordResetDirecto(BaseModel):
    email: str
    nueva_password: str

# --- ESQUEMAS PARA NOTIFICACIONES ---
class NotificacionCreate(BaseModel):
    id_usuario: Optional[int] = None 
    tipo: str = "sistema"
    titulo: str
    mensaje: str

class NotificacionUpdate(BaseModel):
    leida: Optional[bool] = None



class VacanteCreate(BaseModel):
    titulo: str
    descripcion: str
    salario_ofrecido: float
    estado: str = "Activa"
    ubicacion: Optional[str] = None
    modalidad: Optional[str] = None
    nivel_ingles: Optional[str] = None
    id_departamento: Optional[int] = None
    id_reclutador: Optional[int] = None
    fecha_cierre: Optional[str] = None

class VacanteUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    salario_ofrecido: Optional[float] = None
    estado: Optional[str] = None
    ubicacion: Optional[str] = None
    modalidad: Optional[str] = None
    nivel_ingles: Optional[str] = None
    id_departamento: Optional[int] = None
    id_reclutador: Optional[int] = None
    fecha_cierre: Optional[str] = None


class PostulacionCreate(BaseModel):
    id_usuario: int
    id_vacante: int
    id_estado: int = 1  