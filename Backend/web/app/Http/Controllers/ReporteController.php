<?php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Barryvdh\DomPDF\Facade\Pdf;

class ReporteController extends Controller
{
    public function __construct(private ApiService $api) {}

    public function index()
    {
        return view('reportes.index');
    }

    public function pdfCandidatos()
    {
        $response = $this->api->getTodosPerfiles();
        $perfiles = $response->successful() ? $response->json() : [];

        $pdf = Pdf::loadView('reportes.candidatos_pdf', compact('perfiles'))
            ->setPaper('a4', 'portrait');

        return $pdf->download('reporte-candidatos.pdf');
    }

    public function pdfPostulaciones()
    {
        $response     = $this->api->getPostulacionesPorVacante();
        $postulaciones = $response->successful() ? $response->json() : [];

        $vacantesResponse = $this->api->getVacantes();
        $vacantes         = $vacantesResponse->successful() ? $vacantesResponse->json() : [];

        $pdf = Pdf::loadView('reportes.postulaciones_pdf', compact('postulaciones', 'vacantes'))
            ->setPaper('a4', 'portrait');

        return $pdf->download('reporte-postulaciones.pdf');
    }
}