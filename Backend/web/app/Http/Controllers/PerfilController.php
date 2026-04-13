<?php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Illuminate\Http\Request;

class PerfilController extends Controller
{
    public function __construct(private ApiService $api) {}

    public function index()
    {
        $response = $this->api->getTodosPerfiles();
        $perfiles = $response->successful() ? $response->json() : [];
        return view('perfiles.index', compact('perfiles'));
    }

    public function buscar(Request $request)
    {
        $email  = $request->query('email');
        $perfil = null;
        $error  = null;

        if ($email) {
            $response = $this->api->getPerfilByEmail($email);
            if ($response->successful()) {
                $perfil = $response->json();
            } else {
                $error = 'No se encontró ningún perfil con ese email.';
            }
        }

        return view('perfiles.index', compact('perfil', 'email', 'error'));
    }

    public function edit(int $id)
    {
        return view('perfiles.edit', compact('id'));
    }

    public function update(Request $request, int $id)
    {
        $response = $this->api->actualizarPerfil($id, $request->all());

        if ($response->successful()) {
            return redirect()->route('perfiles.index')
                ->with('success', 'Perfil actualizado correctamente.');
        }

        return back()->withErrors(['api' => 'Error al actualizar el perfil.']);
    }
}