from fastapi import FastAPI
from .database import Base, engine
from .routers import vacantes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AutoExec API")

app.include_router(vacantes.router)