<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class ApiService
{
    protected string $baseUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = env('API_BASE_URL', 'http://api:8000');
        $this->timeout = (int) env('API_TIMEOUT', 30);
    }

    protected function client(): \Illuminate\Http\Client\PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->timeout($this->timeout)
            ->withToken(session('api_token', ''))
            ->acceptJson();
    }

    // ── Autenticación ──────────────────────────────────
    public function login(string $email, string $password): Response
    {
        return Http::baseUrl($this->baseUrl)
            ->acceptJson()
            ->post('/api/login', [
                'email'    => $email,
                'password' => $password,
            ]);
    }

    public function registro(array $data): Response
    {
        return Http::baseUrl($this->baseUrl)
            ->acceptJson()
            ->post('/api/registro', $data);
    }

    public function cambiarPassword(string $email, string $nuevaPassword): Response
    {
        return Http::baseUrl($this->baseUrl)
            ->acceptJson()
            ->post('/api/cambiar-password-directo', [
                'email'          => $email,
                'nueva_password' => $nuevaPassword,
            ]);
    }

    // ── Vacantes ───────────────────────────────────────
    public function getVacantes(): Response
    {
        return $this->client()->get('/api/vacantes/');
    }

    public function getVacante(int $id): Response
    {
        return $this->client()->get("/api/vacantes/{$id}");
    }

    public function crearVacante(array $data): Response
    {
        return $this->client()->post('/api/vacantes/', $data);
    }

    public function actualizarVacante(int $id, array $data): Response
    {
        return $this->client()->put("/api/vacantes/{$id}", $data);
    }

    public function eliminarVacante(int $id): Response
    {
        return $this->client()->delete("/api/vacantes/{$id}");
    }

    // ── Perfiles ───────────────────────────────────────
    public function getPerfilByEmail(string $email): Response
    {
        return $this->client()->get("/api/perfiles/email/{$email}");
    }

    public function crearPerfil(array $data): Response
    {
        return $this->client()->post('/api/perfiles', $data);
    }

    public function actualizarPerfil(int $idPerfil, array $data): Response
    {
        return $this->client()->put("/api/perfiles/{$idPerfil}", $data);
    }


    // ── Notificaciones ─────────────────────────────────
    public function getNotificaciones(): Response
    {
        $idUsuario = session('user')['id_usuario'] ?? 0;
        return $this->client()->get("/api/notificaciones/admin/{$idUsuario}");
    }

    public function marcarLeida(int $id): Response
    {
        return $this->client()->put("/api/notificaciones/{$id}/leida");
    }

    public function marcarTodasLeidas(): Response
    {
        return $this->client()->put('/api/notificaciones/leidas/todas');
    }

    public function eliminarNotificacion(int $id): Response
    {
        return $this->client()->delete("/api/notificaciones/{$id}");
    }

    public function eliminarNotificacionesLeidas(): Response
    {
        return $this->client()->delete('/api/notificaciones/leidas/eliminar');
    }


    // ── Postulaciones ──────────────────────────────────
    public function getCandidatosVacante(int $idVacante): Response
    {
        return $this->client()->get("/api/postulaciones/vacante/{$idVacante}/candidatos");
    }

    public function responderPostulacion(int $idPostulacion, string $estado): Response
    {
        return $this->client()->post("/api/postulaciones/{$idPostulacion}/respuesta", [
            'estado' => $estado,
        ]);
    }

    public function getTodosPerfiles(): Response
    {
        return $this->client()->get('/api/perfiles/');
    }


    public function getDepartamentos(): Response
    {
        return $this->client()->get('/api/departamentos/');
    }


    // ── Estadísticas ───────────────────────────────────
    public function getVacantasPorModalidad(): Response
    {
        return $this->client()->get('/api/estadisticas/vacantes-por-modalidad');
    }

    public function getPostulacionesPorVacante(): Response
    {
        return $this->client()->get('/api/estadisticas/postulaciones-por-vacante');
    }

    public function getPostulacionesPorDepartamento(): Response
    {
        return $this->client()->get('/api/estadisticas/postulaciones-por-departamento');
    }
}