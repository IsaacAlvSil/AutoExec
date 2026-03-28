from sqlalchemy import Column, Integer, String
from .database import Base

class Vacante(Base):
    __tablename__ = "vacantes"
    id = Column(Integer, primary_key=True)
    titulo = Column(String)
    descripcion = Column(String)
    salario = Column(Integer)