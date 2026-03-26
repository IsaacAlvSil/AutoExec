from sqlalchemy import Column, Integer, String, Boolean
from data.database import Base

class Vacante(Base):
    __tablename__ = "vacantes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String)
    urgent = Column(Boolean, default=False)