from sqlalchemy import Column, Integer, String, Boolean
from data.db import Base 

class Vacante(Base):
    __tablename__ = "vacantes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String)
    urgent = Column(Boolean, default=False)

# ¡Nuestra nueva tabla para el Login y JWT!
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String) 
    rol = Column(String, default="aspirante") # "aspirante" para la app móvil, "admin" para la web
    is_active = Column(Boolean, default=True)