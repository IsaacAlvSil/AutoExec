@extends('layouts.app')

@section('content')

<h1 class="text-2xl font-bold mb-6">Evaluaciones</h1>

<!-- HEADER -->
<div class="flex justify-between items-center mb-6">

    <h2 class="text-lg font-semibold">Sistema de Evaluaciones</h2>

    <button onclick="abrirModal()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
        + Asignar Evaluación
    </button>

</div>

<!-- CARDS -->
<div class="grid grid-cols-4 gap-6 mb-6">

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Total Evaluaciones</p>
        <h2 class="text-2xl font-bold">64</h2>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Completadas</p>
        <h2 class="text-2xl font-bold text-green-600">48</h2>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Pendientes</p>
        <h2 class="text-2xl font-bold text-yellow-600">16</h2>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Score Promedio</p>
        <h2 class="text-2xl font-bold">87.5</h2>
    </div>

</div>

<!-- GRÁFICAS -->
<div class="grid grid-cols-2 gap-6 mb-6">

    <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="font-semibold mb-4">Puntuación por Competencia</h3>
        <div class="h-48 flex items-center justify-center text-gray-400">
            📊 Gráfica aquí (Chart.js después)
        </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="font-semibold mb-4">Comparación de Perfiles</h3>
        <div class="h-48 flex items-center justify-center text-gray-400">
            📊 Radar aquí
        </div>
    </div>

</div>

<!-- TABLA -->
<div class="bg-white p-6 rounded-xl shadow">

    <h3 class="font-semibold mb-4">Evaluaciones Recientes</h3>

    <table class="w-full text-sm">

        <thead class="text-gray-500 border-b">
            <tr>
                <th class="text-left py-2">Candidato</th>
                <th>Posición</th>
                <th>Tipo</th>
                <th>Evaluación</th>
                <th>Evaluador</th>
                <th>Fecha</th>
                <th>Duración</th>
                <th>Puntuación</th>
                <th>Estado</th>
            </tr>
        </thead>

        <tbody>

            <tr class="border-b">
                <td class="py-3 font-medium">Juan Carlos Pérez</td>
                <td>Director de Planta</td>
                <td><span class="bg-gray-200 px-2 py-1 rounded">Técnica</span></td>
                <td>Lean Manufacturing</td>
                <td>Ing. Roberto Méndez</td>
                <td>2026-02-15</td>
                <td>120 min</td>
                <td class="text-green-600 font-bold">92</td>
                <td><span class="bg-green-100 text-green-700 px-2 py-1 rounded">Completada</span></td>
            </tr>

            <tr class="border-b">
                <td class="py-3 font-medium">María González</td>
                <td>Gerente de Calidad</td>
                <td><span class="bg-gray-200 px-2 py-1 rounded">Psicométrica</span></td>
                <td>Liderazgo</td>
                <td>Lic. Ana Torres</td>
                <td>2026-02-14</td>
                <td>90 min</td>
                <td class="text-blue-600 font-bold">88</td>
                <td><span class="bg-green-100 text-green-700 px-2 py-1 rounded">Completada</span></td>
            </tr>

            <tr>
                <td class="py-3 font-medium">Carlos Rodríguez</td>
                <td>Ingeniero de Procesos</td>
                <td><span class="bg-gray-200 px-2 py-1 rounded">Técnica</span></td>
                <td>Optimización</td>
                <td>Ing. Roberto Méndez</td>
                <td>2026-02-20</td>
                <td>90 min</td>
                <td>-</td>
                <td><span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pendiente</span></td>
            </tr>

        </tbody>

    </table>

</div>

<!-- MODAL -->
<div id="modalEvaluacion" class="fixed inset-0 bg-black bg-opacity-40 hidden items-center justify-center z-50">

    <div class="bg-white w-[700px] rounded-xl shadow-lg p-6 relative">

        <button onclick="cerrarModal()" class="absolute top-4 right-4 text-gray-500 text-xl">✕</button>

        <h2 class="text-xl font-bold mb-4">Asignar Nueva Evaluación</h2>

        <form class="space-y-4">

            <div>
                <label class="text-sm font-medium">Candidato</label>
                <select class="w-full border rounded-lg p-2 mt-1">
                    <option>Juan Carlos Pérez</option>
                    <option>María González</option>
                </select>
            </div>

            <div>
                <label class="text-sm font-medium">Tipo de Evaluación</label>
                <select class="w-full border rounded-lg p-2 mt-1">
                    <option>Técnica</option>
                    <option>Psicométrica</option>
                </select>
            </div>

            <div>
                <label class="text-sm font-medium">Evaluador</label>
                <select class="w-full border rounded-lg p-2 mt-1">
                    <option>Ing. Roberto Méndez</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <input type="date" class="border p-2 rounded-lg">
                <select class="border p-2 rounded-lg">
                    <option>60 min</option>
                    <option>90 min</option>
                </select>
            </div>

            <textarea class="w-full border p-2 rounded-lg"
                placeholder="Observaciones..."></textarea>

            <div class="flex justify-end gap-3">
                <button type="button" onclick="cerrarModal()"
                    class="border px-4 py-2 rounded-lg">
                    Cancelar
                </button>

                <button class="bg-blue-900 text-white px-6 py-2 rounded-lg">
                    Guardar
                </button>
            </div>

        </form>

    </div>

</div>

<!-- JS -->
<script>
function abrirModal() {
    document.getElementById('modalEvaluacion').classList.remove('hidden');
    document.getElementById('modalEvaluacion').classList.add('flex');
}

function cerrarModal() {
    document.getElementById('modalEvaluacion').classList.add('hidden');
    document.getElementById('modalEvaluacion').classList.remove('flex');
}
</script>

@endsection
