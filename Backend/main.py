from fastapi import FastAPI
from Backend.data.db import engine
from models import models
from routers import vacantes

# Crea las tablas en la BD
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API AutoExec")

# Conectamos el router de vacantes a la app principal
app.include_router(vacantes.router)

@app.get("/")
def read_root():
    return {"mensaje": "¡FastAPI funcionando!"}