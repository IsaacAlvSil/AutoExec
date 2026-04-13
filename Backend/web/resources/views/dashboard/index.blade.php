@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="p-6">

    <!-- Header -->
    <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="text-gray-400 text-sm mt-1">Bienvenido, {{ session('user')['email'] ?? '' }}</p>
    </div>

    <!-- Tarjetas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <p class="text-gray-400 text-sm mb-1">Total Vacantes</p>
            <p class="text-3xl font-bold text-white">{{ $stats['total_vacantes'] ?? 0 }}</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <p class="text-gray-400 text-sm mb-1">Total Postulaciones</p>
            <p class="text-3xl font-bold text-white">{{ array_sum(array_column($postVacanteData, 'total')) }}</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <p class="text-gray-400 text-sm mb-1">Departamentos activos</p>
            <p class="text-3xl font-bold text-white">{{ count($postDeptoData) }}</p>
        </div>
    </div>

    <!-- Gráficas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        <!-- Vacantes por Modalidad (Dona) -->
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 class="text-white font-semibold mb-4">Vacantes por modalidad</h2>
            <div class="relative h-64">
                <canvas id="modalidadChart"></canvas>
            </div>
        </div>

        <!-- Postulaciones por Departamento (Barras) -->
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 class="text-white font-semibold mb-4">Postulaciones por departamento</h2>
            <div class="relative h-64">
                <canvas id="departamentoChart"></canvas>
            </div>
        </div>

    </div>

    <!-- Postulaciones por Vacante (Barras horizontales) -->
    <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 class="text-white font-semibold mb-4">Postulaciones por vacante</h2>
        <div class="relative h-64">
            <canvas id="vacanteChart"></canvas>
        </div>
    </div>

    <!-- Vacantes recientes -->
    <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-white">Vacantes recientes</h2>
            <a href="{{ route('vacantes.index') }}" class="text-sm text-red-400 hover:text-red-300">Ver todas →</a>
        </div>
        @if(!empty($stats['vacantes']))
        <table class="w-full text-sm">
            <thead>
                <tr class="text-gray-400 border-b border-gray-700">
                    <th class="text-left pb-3">Título</th>
                    <th class="text-left pb-3">Departamento</th>
                    <th class="text-left pb-3">Estado</th>
                </tr>
            </thead>
            <tbody>
                @foreach(array_slice($stats['vacantes'], 0, 5) as $vacante)
                <tr class="border-b border-gray-700 hover:bg-gray-700">
                    <td class="py-3 text-white">{{ $vacante['titulo'] ?? '—' }}</td>
                    <td class="py-3 text-gray-400">{{ $vacante['id_departamento'] ?? '—' }}</td>
                    <td class="py-3">
                        <span class="bg-green-800 text-green-300 text-xs px-2 py-1 rounded-full">
                            {{ $vacante['estado'] ?? 'activo' }}
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <p class="text-gray-400 text-sm">No hay vacantes registradas aún.</p>
        @endif
    </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const modalidadData    = @json($modalidadData);
    const postVacanteData  = @json($postVacanteData);
    const postDeptoData    = @json($postDeptoData);

    // Gráfica dona - Vacantes por modalidad
    new Chart(document.getElementById('modalidadChart'), {
        type: 'doughnut',
        data: {
            labels: modalidadData.map(d => d.modalidad),
            datasets: [{
                data: modalidadData.map(d => d.total),
                backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#9CA3AF' } }
            }
        }
    });

    // Gráfica barras - Postulaciones por departamento
    new Chart(document.getElementById('departamentoChart'), {
        type: 'bar',
        data: {
            labels: postDeptoData.map(d => d.departamento),
            datasets: [{
                label: 'Postulaciones',
                data: postDeptoData.map(d => d.total),
                backgroundColor: '#EF4444',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } },
                y: { ticks: { color: '#9CA3AF', stepSize: 1 }, grid: { color: '#374151' } }
            }
        }
    });

    // Gráfica barras horizontales - Postulaciones por vacante
    new Chart(document.getElementById('vacanteChart'), {
        type: 'bar',
        data: {
            labels: postVacanteData.map(d => d.vacante),
            datasets: [{
                label: 'Postulaciones',
                data: postVacanteData.map(d => d.total),
                backgroundColor: '#8B5CF6',
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#9CA3AF', stepSize: 1 }, grid: { color: '#374151' } },
                y: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } }
            }
        }
    });
</script>
@endsection