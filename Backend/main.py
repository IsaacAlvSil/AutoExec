from fastapi import FastAPI

app = FastAPI(title="API Radar Automotriz")

@app.get("/")
def read_root():
    return {"mensaje": "¡La API FastAPI está corriendo al 100%!"}

@app.get("/api/vacantes")
def get_vacantes():
    # Más adelante, esto vendrá de PostgreSQL. Por ahora es un dato de prueba.
    return [
        {
            "id": 1, 
            "title": "Director de Operaciones", 
            "company": "AutoMotors SA",
            "urgent": True
        }
    ]