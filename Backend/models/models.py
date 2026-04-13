from sqlalchemy import Column, Integer, String, Boolean, Text, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from data.db import Base
from datetime import datetime

# ──────────────────────────────────────────────
# Tabla: roles
# ──────────────────────────────────────────────
class Rol(Base):
    __tablename__ = "roles"

    id_rol      = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String(50), nullable=False)
    descripcion = Column(Text)

    # Relación inversa
    usuarios = relationship("Usuario", back_populates="rol")


# ──────────────────────────────────────────────
# Tabla: usuarios
# ──────────────────────────────────────────────
class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario          = Column(Integer, primary_key=True, index=True)
    id_rol              = Column(Integer, ForeignKey("roles.id_rol"))
    email               = Column(String(150), unique=True, index=True, nullable=False)
    password_hash       = Column(String(255), nullable=False)
    estado              = Column(String(20), default="activo")
    fecha_creacion      = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime)

    # Relaciones
    rol                 = relationship("Rol", back_populates="usuarios")
    perfil              = relationship("Perfil", back_populates="usuario", uselist=False)
    postulaciones       = relationship("Postulacion", back_populates="usuario")
    documentos          = relationship("Documento", back_populates="usuario")
    notificaciones      = relationship("Notificacion", back_populates="usuario")
    inscripciones       = relationship("InscripcionCurso", back_populates="usuario")
    mensajes_enviados   = relationship("Mensaje", foreign_keys="Mensaje.id_emisor",   back_populates="emisor")
    mensajes_recibidos  = relationship("Mensaje", foreign_keys="Mensaje.id_receptor", back_populates="receptor")
    auditoria           = relationship("Auditoria", back_populates="usuario")
    vacantes_reclutadas = relationship("Vacante", back_populates="reclutador")


# ──────────────────────────────────────────────
# Tabla: perfiles
# ──────────────────────────────────────────────
class Perfil(Base):
    __tablename__ = "perfiles"

    id_perfil              = Column(Integer, primary_key=True, index=True)
    id_usuario             = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    nombre                 = Column(String(100))
    apellido               = Column(String(100))
    telefono               = Column(String(20))
    fecha_nacimiento       = Column(Date)
    puesto_actual          = Column(String(150))
    experiencia_anios      = Column(Integer)
    resumen_profesional    = Column(Text)
    ubicacion           = Column(String(255), nullable=True)
    fecha_actualizacion    = Column(DateTime)

    certificaciones = relationship("Certificacion", back_populates="perfil", cascade="all, delete-orphan")
    usuario = relationship("Usuario", back_populates="perfil")


# ──────────────────────────────────────────────
# Tabla: departamentos
# ──────────────────────────────────────────────
class Departamento(Base):
    __tablename__ = "departamentos"

    id_departamento = Column(Integer, primary_key=True, index=True)
    nombre          = Column(String(100), nullable=False)

    vacantes = relationship("Vacante", back_populates="departamento")


# ──────────────────────────────────────────────
# Tabla: vacantes
# ──────────────────────────────────────────────
class Vacante(Base):
    __tablename__ = "vacantes"

    id_vacante         = Column(Integer, primary_key=True, index=True)
    titulo             = Column(String(150), index=True)
    descripcion        = Column(Text)
    salario_ofrecido   = Column(Numeric(12, 2))
    estado             = Column(String(20), default="abierta")
    fecha_publicacion  = Column(DateTime, server_default=func.now())
    fecha_cierre       = Column(DateTime)
    id_departamento    = Column(Integer, ForeignKey("departamentos.id_departamento"))
    id_reclutador      = Column(Integer, ForeignKey("usuarios.id_usuario"))
    ubicacion          = Column(String(255), nullable=True)
    modalidad          = Column(String(100), nullable=True)
    nivel_ingles       = Column(String(100), nullable=True)
    

    departamento  = relationship("Departamento", back_populates="vacantes")
    reclutador    = relationship("Usuario", back_populates="vacantes_reclutadas")
    postulaciones = relationship("Postulacion", back_populates="vacante")


# ──────────────────────────────────────────────
# Tabla: estados_postulacion
# ──────────────────────────────────────────────
class EstadoPostulacion(Base):
    __tablename__ = "estados_postulacion"

    id_estado   = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String(50), nullable=False)
    descripcion = Column(Text)

    postulaciones = relationship("Postulacion", back_populates="estado")


# ──────────────────────────────────────────────
# Tabla: postulaciones
# ──────────────────────────────────────────────
class Postulacion(Base):
    __tablename__ = "postulaciones"

    id_postulacion    = Column(Integer, primary_key=True, index=True)
    id_usuario        = Column(Integer, ForeignKey("usuarios.id_usuario"))
    id_vacante        = Column(Integer, ForeignKey("vacantes.id_vacante"))
    fecha_postulacion = Column(DateTime, server_default=func.now())
    id_estado         = Column(Integer, ForeignKey("estados_postulacion.id_estado"))

    usuario              = relationship("Usuario",          back_populates="postulaciones")
    vacante              = relationship("Vacante",          back_populates="postulaciones")
    estado               = relationship("EstadoPostulacion", back_populates="postulaciones")
    resultados_evaluacion = relationship("ResultadoEvaluacion", back_populates="postulacion")


# ──────────────────────────────────────────────
# Tabla: evaluaciones
# ──────────────────────────────────────────────
class Evaluacion(Base):
    __tablename__ = "evaluaciones"

    id_evaluacion  = Column(Integer, primary_key=True, index=True)
    nombre         = Column(String(150))
    tipo           = Column(String(50))
    descripcion    = Column(Text)
    puntaje_maximo = Column(Integer)

    resultados = relationship("ResultadoEvaluacion", back_populates="evaluacion")


# ──────────────────────────────────────────────
# Tabla: resultados_evaluacion
# ──────────────────────────────────────────────
class ResultadoEvaluacion(Base):
    __tablename__ = "resultados_evaluacion"

    id_resultado      = Column(Integer, primary_key=True, index=True)
    id_postulacion    = Column(Integer, ForeignKey("postulaciones.id_postulacion", ondelete="CASCADE"))
    id_evaluacion     = Column(Integer, ForeignKey("evaluaciones.id_evaluacion"))
    puntaje_obtenido  = Column(Integer)
    observaciones     = Column(Text)
    fecha_realizacion = Column(DateTime, server_default=func.now())

    postulacion = relationship("Postulacion", back_populates="resultados_evaluacion")
    evaluacion  = relationship("Evaluacion",  back_populates="resultados")


# ──────────────────────────────────────────────
# Tabla: tipo_documentos
# ──────────────────────────────────────────────
class TipoDocumento(Base):
    __tablename__ = "tipo_documentos"

    id_tipo = Column(Integer, primary_key=True, index=True)
    nombre  = Column(String(100), nullable=False)

    documentos = relationship("Documento", back_populates="tipo")


# ──────────────────────────────────────────────
# Tabla: documentos
# ──────────────────────────────────────────────
class Documento(Base):
    __tablename__ = "documentos"

    id_documento  = Column(Integer, primary_key=True, index=True)
    id_usuario    = Column(Integer, ForeignKey("usuarios.id_usuario"))
    url_archivo   = Column(Text)
    fecha_subida  = Column(DateTime, server_default=func.now())
    id_tipo       = Column(Integer, ForeignKey("tipo_documentos.id_tipo"))

    usuario = relationship("Usuario",       back_populates="documentos")
    tipo    = relationship("TipoDocumento", back_populates="documentos")


# ──────────────────────────────────────────────
# Tabla: cursos
# ──────────────────────────────────────────────
class Curso(Base):
    __tablename__ = "cursos"

    id_curso        = Column(Integer, primary_key=True, index=True)
    nombre          = Column(String(150))
    descripcion     = Column(Text)
    duracion_horas  = Column(Integer)

    inscripciones = relationship("InscripcionCurso", back_populates="curso")


# ──────────────────────────────────────────────
# Tabla: inscripciones_curso
# ──────────────────────────────────────────────
class InscripcionCurso(Base):
    __tablename__ = "inscripciones_curso"

    id_inscripcion = Column(Integer, primary_key=True, index=True)
    id_usuario     = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    id_curso       = Column(Integer, ForeignKey("cursos.id_curso"))
    progreso       = Column(Integer, default=0)
    estado         = Column(String(20), default="en_progreso")

    usuario = relationship("Usuario", back_populates="inscripciones")
    curso   = relationship("Curso",   back_populates="inscripciones")


# ──────────────────────────────────────────────
# Tabla: notificaciones
# ──────────────────────────────────────────────
class Notificacion(Base):
    __tablename__ = "notificaciones"

    id_notificacion = Column(Integer, primary_key=True, index=True)
    id_usuario      = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=True)
    tipo            = Column(String(50), default="sistema")
    titulo          = Column(String(150))
    mensaje         = Column(Text)
    leida           = Column(Boolean, default=False)
    fecha_envio     = Column(DateTime, default=datetime.now)

    usuario = relationship("Usuario", back_populates="notificaciones")


# ──────────────────────────────────────────────
# Tabla: mensajes
# ──────────────────────────────────────────────
class Mensaje(Base):
    __tablename__ = "mensajes"

    id_mensaje   = Column(Integer, primary_key=True, index=True)
    id_emisor    = Column(Integer, ForeignKey("usuarios.id_usuario"))
    id_receptor  = Column(Integer, ForeignKey("usuarios.id_usuario"))
    contenido    = Column(Text)
    fecha_envio  = Column(DateTime, server_default=func.now())

    emisor   = relationship("Usuario", foreign_keys=[id_emisor],   back_populates="mensajes_enviados")
    receptor = relationship("Usuario", foreign_keys=[id_receptor],  back_populates="mensajes_recibidos")


# ──────────────────────────────────────────────
# Tabla: auditoria
# ──────────────────────────────────────────────
class Auditoria(Base):
    __tablename__ = "auditoria"

    id_auditoria = Column(Integer, primary_key=True, index=True)
    id_usuario   = Column(Integer, ForeignKey("usuarios.id_usuario"))
    accion       = Column(String(200))
    fecha        = Column(DateTime, server_default=func.now())

    usuario = relationship("Usuario", back_populates="auditoria")


class Certificacion(Base):
    __tablename__ = "certificaciones"

    id_certificacion = Column(Integer, primary_key=True, index=True)
    id_perfil = Column(Integer, ForeignKey('perfiles.id_perfil', ondelete="CASCADE"), nullable=False)
    
    nombre = Column(String(150), nullable=False)
    institucion = Column(String(150), nullable=False)
    anio = Column(Integer)

    perfil = relationship("Perfil", back_populates="certificaciones")