from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import time

DATABASE_URL = "postgresql://postgres:1234@db:5432/autoexec"

#  ESPERAR A QUE POSTGRES ESTÉ LISTO
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        print("✅ Conectado a PostgreSQL")
        connection.close()
        break
    except:
        print("⏳ Esperando PostgreSQL...")
        time.sleep(3)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()