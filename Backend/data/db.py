from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Toma la URL de conexión de Docker o usa esta por defecto
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:123456@db:5432/automotriz_db")

# Crea el "motor" que se conecta a la BD
engine = create_engine(DATABASE_URL)

# Crea la fábrica de sesiones para cada petición que reciba la API
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base de la que heredarán nuestros modelos
Base = declarative_base()