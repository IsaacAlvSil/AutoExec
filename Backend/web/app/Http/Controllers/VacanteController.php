<?php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Illuminate\Http\Request;

class VacanteController extends Controller
{
    public function __construct(private ApiService $api) {}

    public function index()
    {
        $response = $this->api->getVacantes();
        $vacantes = $response->successful() ? $response->json() : [];
        return view('vacantes.index', compact('vacantes'));
    }

    public function create()
    {
        $response      = $this->api->getDepartamentos();
        $departamentos = $response->successful() ? $response->json() : [];
        return view('vacantes.create', compact('departamentos'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo'           => 'required|string|max:255',
            'descripcion'      => 'required|string',
            'salario_ofrecido' => 'required|numeric|min:1',
            'nivel_ingles'     => 'required|string',
            'ubicacion'        => 'required|string',
            'modalidad'        => 'required|string',
            'id_departamento'  => 'required|integer',
            'fecha_cierre'     => 'required|date',
            'estado'           => 'required|string',
        ]);

        $response = $this->api->crearVacante([
            'titulo'           => $request->titulo,
            'descripcion'      => $request->descripcion,
            'salario_ofrecido' => (float) $request->salario_ofrecido,
            'nivel_ingles'     => $request->nivel_ingles,
            'ubicacion'        => $request->ubicacion,
            'modalidad'        => $request->modalidad,
            'id_departamento'  => (int) $request->id_departamento,
            'fecha_cierre'     => $request->fecha_cierre,
            'estado'           => $request->estado,
            'id_reclutador'    => session('user')['id_usuario'] ?? null,
        ]);

        if ($response->successful()) {
            return redirect()->route('vacantes.index')
                ->with('success', 'Vacante publicada correctamente.');
        }

        return back()->withErrors(['api' => 'Error al crear la vacante: ' . $response->body()]);
    }

    public function edit(int $id)
    {
        $response = $this->api->getVacante($id);
        if (!$response->successful()) {
            return redirect()->route('vacantes.index')
                ->withErrors(['api' => 'Vacante no encontrada.']);
        }
        $vacante       = $response->json();
        $depResponse   = $this->api->getDepartamentos();
        $departamentos = $depResponse->successful() ? $depResponse->json() : [];
        return view('vacantes.edit', compact('vacante', 'departamentos'));
    }

    public function update(Request $request, int $id)
    {
        $request->validate([
            'titulo'           => 'required|string|max:255',
            'descripcion'      => 'required|string',
            'salario_ofrecido' => 'required|numeric|min:1',
            'nivel_ingles'     => 'required|string',
            'ubicacion'        => 'required|string',
            'modalidad'        => 'required|string',
            'id_departamento'  => 'required|integer',
            'fecha_cierre'     => 'required|date',
            'estado'           => 'required|string',
        ]);

        $response = $this->api->actualizarVacante($id, [
            'titulo'           => $request->titulo,
            'descripcion'      => $request->descripcion,
            'salario_ofrecido' => (float) $request->salario_ofrecido,
            'nivel_ingles'     => $request->nivel_ingles,
            'ubicacion'        => $request->ubicacion,
            'modalidad'        => $request->modalidad,
            'id_departamento'  => (int) $request->id_departamento,
            'fecha_cierre'     => $request->fecha_cierre,
            'estado'           => $request->estado,
            'id_reclutador'    => session('user')['id_usuario'] ?? null,
        ]);

        if ($response->successful()) {
            return redirect()->route('vacantes.index')
                ->with('success', 'Vacante actualizada correctamente.');
        }

        return back()->withErrors(['api' => 'Error al actualizar: ' . $response->body()]);
    }

    public function destroy(int $id)
    {
        $this->api->eliminarVacante($id);
        return redirect()->route('vacantes.index')
            ->with('success', 'Vacante eliminada correctamente.');
    }

    public function candidatos(int $id)
    {
        $vacanteResponse    = $this->api->getVacante($id);
        $candidatosResponse = $this->api->getCandidatosVacante($id);

        if (!$vacanteResponse->successful()) {
            return redirect()->route('vacantes.index')
                ->withErrors(['api' => 'Vacante no encontrada.']);
        }

        $vacante    = $vacanteResponse->json();
        $candidatos = $candidatosResponse->successful() ? $candidatosResponse->json() : [];

        return view('vacantes.candidatos', compact('vacante', 'candidatos'));
    }
}