from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import time

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://admin:password123@postgres:5432/autoexec"
)

# Esperar a que PostgreSQL esté listo
for i in range(15):
    try:
        engine = create_engine(DATABASE_URL)
        conn = engine.connect()
        print("✅ Conectado a PostgreSQL")
        conn.close()
        break
    except Exception as e:
        print(f"⏳ Esperando PostgreSQL... intento {i+1}/15")
        time.sleep(3)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
