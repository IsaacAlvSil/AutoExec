from fastapi import FastAPI
from data.db import engine
from models import models
from routers import vacantes, auth, estadisticas
from routers import perfiles_router, notificaciones, postulaciones, certificaciones, departamentos
# Crea las tablas en la BD
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API AutoExec")

app.include_router(vacantes.router)
app.include_router(auth.router)
app.include_router(perfiles_router.router) 
app.include_router(notificaciones.router)
app.include_router(postulaciones.router)
app.include_router(certificaciones.router)
app.include_router(departamentos.router)
app.include_router(estadisticas.router)



@app.get("/")
def read_root():
    return {"mensaje": "FastAPI funcionando"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "FastAPI"}