<?php

namespace App\Http\Controllers;

use App\Services\ApiService;

class NotificacionController extends Controller
{
    public function __construct(private ApiService $api) {}

    public function index()
    {
        $response        = $this->api->getNotificaciones();
        $notificaciones  = $response->successful() ? $response->json() : [];
        $noLeidas        = count(array_filter($notificaciones, fn($n) => !$n['leida']));
        return view('notificaciones.index', compact('notificaciones', 'noLeidas'));
    }

    public function marcarLeida(int $id)
    {
        $this->api->marcarLeida($id);
        return back()->with('success', 'Notificación marcada como leída.');
    }

    public function marcarTodasLeidas()
    {
        $this->api->marcarTodasLeidas();
        return back()->with('success', 'Todas las notificaciones marcadas como leídas.');
    }

    public function eliminar(int $id)
    {
        $this->api->eliminarNotificacion($id);
        return back()->with('success', 'Notificación eliminada.');
    }

    public function eliminarLeidas()
    {
        $this->api->eliminarNotificacionesLeidas();
        return back()->with('success', 'Notificaciones leídas eliminadas.');
    }
}