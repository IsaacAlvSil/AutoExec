from fastapi import FastAPI
from data.db import engine
from models import models
from routers import vacantes, auth
from routers import perfiles_router
# Crea las tablas en la BD
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API AutoExec")

# Conectamos el router de vacantes a la app principal
app.include_router(vacantes.router)
app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"mensaje": "¡FastAPI funcionando!"}