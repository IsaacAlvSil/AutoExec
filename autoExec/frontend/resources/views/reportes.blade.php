@extends('layouts.app')

@section('content')

<h1 class="text-2xl font-bold mb-6">Reportes y Analítica</h1>

<!-- FILTRO -->
<div class="flex justify-end mb-4">
    <select class="border rounded-lg px-3 py-2">
        <option>Último Mes</option>
        <option>Último Trimestre</option>
    </select>
</div>

<!-- CARDS -->
<div class="grid grid-cols-4 gap-6 mb-6">

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Tiempo Promedio</p>
        <h2 class="text-xl font-bold">22 días</h2>
        <span class="text-red-500 text-sm">+3 días</span>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Costo por Contratación</p>
        <h2 class="text-xl font-bold">$12,500</h2>
        <span class="text-red-500 text-sm">+$800</span>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Tasa de Conversión</p>
        <h2 class="text-xl font-bold">4.3%</h2>
        <span class="text-green-500 text-sm">+0.8%</span>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Retención</p>
        <h2 class="text-xl font-bold">94%</h2>
        <span class="text-green-500 text-sm">+2%</span>
    </div>

</div>

<!-- GRÁFICAS -->
<div class="grid grid-cols-2 gap-6 mb-6">

    <!-- TENDENCIA -->
    <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="font-semibold mb-4">Tendencia Mensual</h3>
        <div class="h-48 flex items-center justify-center text-gray-400">
            📊 Línea (Chart.js después)
        </div>
    </div>

    <!-- BARRA -->
    <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="font-semibold mb-4">Contrataciones por Departamento</h3>
        <div class="h-48 flex items-center justify-center text-gray-400">
            📊 Barra
        </div>
    </div>

</div>

<!-- SEGUNDA FILA -->
<div class="grid grid-cols-2 gap-6 mb-6">

    <!-- DONUT -->
    <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="font-semibold mb-4">Fuentes de Candidatos</h3>
        <div class="h-48 flex items-center justify-center text-gray-400">
            📊 Donut
        </div>
    </div>

    <!-- TIEMPO -->
    <div class="bg-white p-6 rounded-xl shadow">
        <h3 class="font-semibold mb-4">Tiempo por Etapa</h3>
        <div class="h-48 flex items-center justify-center text-gray-400">
            📊 Barras
        </div>
    </div>

</div>

<!-- TABLA -->
<div class="bg-white p-6 rounded-xl shadow mb-6">

    <h3 class="font-semibold mb-4">Métricas Detalladas</h3>

    <table class="w-full text-sm">

        <thead class="text-gray-500 border-b">
            <tr>
                <th class="text-left py-2">Métrica</th>
                <th>Octubre</th>
                <th>Noviembre</th>
                <th>Diciembre</th>
                <th>Promedio</th>
                <th>Cambio</th>
            </tr>
        </thead>

        <tbody>

            <tr class="border-b">
                <td class="py-3">Aplicaciones</td>
                <td>172</td>
                <td>163</td>
                <td>148</td>
                <td>161</td>
                <td class="text-red-500">-14%</td>
            </tr>

            <tr class="border-b">
                <td class="py-3">Entrevistas</td>
                <td>45</td>
                <td>40</td>
                <td>35</td>
                <td>40</td>
                <td class="text-red-500">-22%</td>
            </tr>

            <tr class="border-b">
                <td class="py-3">Ofertas</td>
                <td>10</td>
                <td>8</td>
                <td>6</td>
                <td>8</td>
                <td class="text-red-500">-40%</td>
            </tr>

            <tr class="border-b">
                <td class="py-3">Contrataciones</td>
                <td>8</td>
                <td>5</td>
                <td>4</td>
                <td>5.7</td>
                <td class="text-red-500">-50%</td>
            </tr>

            <tr class="border-b">
                <td class="py-3">Conversión</td>
                <td>4.7%</td>
                <td>3.1%</td>
                <td>2.7%</td>
                <td>3.5%</td>
                <td class="text-red-500">-43%</td>
            </tr>

            <tr>
                <td class="py-3">Tiempo (días)</td>
                <td>24</td>
                <td>22</td>
                <td>20</td>
                <td>22</td>
                <td class="text-green-500">+17%</td>
            </tr>

        </tbody>

    </table>

</div>

@endsection