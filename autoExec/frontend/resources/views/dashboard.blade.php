@extends('layouts.app')

@section('content')

<div class="space-y-6">

    <h1 class="text-2xl font-bold">Dashboard</h1>

    @php
        $vacantes = session('vacantes', []);
        $candidatos = session('candidatos', []);
        $postulaciones = session('postulaciones', []);

        $totalVacantes = count($vacantes);
        $totalCandidatos = count($candidatos);
        $totalPostulaciones = count($postulaciones);

        $contratados = collect($postulaciones)->where('estado','Contratado')->count();
    @endphp

    <!-- CARDS -->
    <div class="grid grid-cols-4 gap-6">

        <div class="bg-white p-5 rounded-xl shadow">
            <p class="text-gray-500 text-sm">Vacantes</p>
            <h2 class="text-2xl font-bold">{{ $totalVacantes }}</h2>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
            <p class="text-gray-500 text-sm">Candidatos</p>
            <h2 class="text-2xl font-bold">{{ $totalCandidatos }}</h2>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
            <p class="text-gray-500 text-sm">Postulaciones</p>
            <h2 class="text-2xl font-bold">{{ $totalPostulaciones }}</h2>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
            <p class="text-gray-500 text-sm">Contratados</p>
            <h2 class="text-2xl font-bold text-green-600">{{ $contratados }}</h2>
        </div>

    </div>

    <!-- GRAFICAS -->
    <div class="grid grid-cols-2 gap-6">

        <!-- BARRAS -->
        <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="mb-4 font-semibold">Resumen General</h3>
            <canvas id="graficaBarra"></canvas>
        </div>

        <!-- DONA -->
        <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="mb-4 font-semibold">Estado Postulaciones</h3>
            <canvas id="graficaDona"></canvas>
        </div>

    </div>

</div>

<!-- CHART JS -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>

let postulaciones = @json($postulaciones);

// CONTAR ESTADOS
let estados = {
    Nuevo: 0,
    "En proceso": 0,
    Entrevista: 0,
    Contratado: 0
};

postulaciones.forEach(p => {
    if(estados[p.estado] !== undefined){
        estados[p.estado]++;
    }
});

// GRAFICA BARRAS
new Chart(document.getElementById('graficaBarra'), {
    type: 'bar',
    data: {
        labels: ['Vacantes','Candidatos','Postulaciones','Contratados'],
        datasets: [{
            data: [
                {{ $totalVacantes }},
                {{ $totalCandidatos }},
                {{ $totalPostulaciones }},
                {{ $contratados }}
            ]
        }]
    }
});

// GRAFICA DONA
new Chart(document.getElementById('graficaDona'), {
    type: 'doughnut',
    data: {
        labels: Object.keys(estados),
        datasets: [{
            data: Object.values(estados)
        }]
    }
});

</script>

@endsection