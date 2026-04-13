<?php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Illuminate\Http\Request;

class PostulacionController extends Controller
{
    public function __construct(private ApiService $api) {}

    public function responder(Request $request, int $id)
    {
        $request->validate([
            'estado' => 'required|in:aceptada,rechazada,en_revision',
        ]);

        $this->api->responderPostulacion($id, $request->estado);

        return back()->with('success', 'Respuesta enviada al candidato correctamente.');
    }
}