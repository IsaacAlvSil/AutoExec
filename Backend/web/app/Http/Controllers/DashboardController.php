<?php

namespace App\Http\Controllers;

use App\Services\ApiService;

class DashboardController extends Controller
{
    public function __construct(private ApiService $api) {}

    public function index()
    {
        $vacantesResponse = $this->api->getVacantes();
        $vacantes         = $vacantesResponse->successful() ? $vacantesResponse->json() : [];

        $modalidadData      = $this->api->getVacantasPorModalidad()->json() ?? [];
        $postVacanteData    = $this->api->getPostulacionesPorVacante()->json() ?? [];
        $postDeptoData      = $this->api->getPostulacionesPorDepartamento()->json() ?? [];

        $stats = [
            'total_vacantes' => count($vacantes),
            'vacantes'       => $vacantes,
        ];

        return view('dashboard.index', compact(
            'stats',
            'modalidadData',
            'postVacanteData',
            'postDeptoData'
        ));
    }
}