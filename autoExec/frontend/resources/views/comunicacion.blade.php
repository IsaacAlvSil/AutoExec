@extends('layouts.app')

@section('content')

<h1 class="text-2xl font-bold mb-6">Comunicación</h1>

<!-- KPIs -->
<div class="grid grid-cols-4 gap-6 mb-6">

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Conversaciones</p>
        <h2 class="text-xl font-bold">24</h2>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">No leídos</p>
        <h2 class="text-xl font-bold text-yellow-600">3</h2>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Emails enviados</p>
        <h2 class="text-xl font-bold">156</h2>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Tiempo respuesta</p>
        <h2 class="text-xl font-bold">2.3h</h2>
    </div>

</div>

<!-- CHAT -->
<div class="grid grid-cols-3 gap-6 mb-6">

    <!-- LISTA -->
    <div class="bg-white rounded-xl shadow p-4">

        <input type="text" placeholder="Buscar conversaciones..."
            class="w-full border rounded-lg p-2 mb-4">

        <div class="space-y-3 text-sm">

            <div class="p-3 bg-gray-100 rounded-lg">
                <p class="font-semibold">Juan Carlos Pérez</p>
                <p class="text-gray-500 text-xs">Confirmo asistencia...</p>
            </div>

            <div class="p-3 hover:bg-gray-100 rounded-lg">
                <p class="font-semibold">María González</p>
                <p class="text-gray-500 text-xs">¿Podrían enviarme más detalles?</p>
            </div>

            <div class="p-3 hover:bg-gray-100 rounded-lg">
                <p class="font-semibold">Carlos Rodríguez</p>
                <p class="text-gray-500 text-xs">Adjunto mi portafolio</p>
            </div>

        </div>

    </div>

    <!-- CHAT ACTIVO -->
    <div class="bg-white rounded-xl shadow p-4 col-span-2 flex flex-col">

        <div class="mb-4">
            <h3 class="font-semibold">Juan Carlos Pérez</h3>
            <p class="text-xs text-gray-500">Director de Planta</p>
        </div>

        <div class="flex-1 space-y-3 overflow-y-auto text-sm mb-4">

            <div class="text-right">
                <span class="bg-blue-600 text-white px-3 py-2 rounded-lg inline-block">
                    Buenos días, gracias por tu interés.
                </span>
            </div>

            <div>
                <span class="bg-gray-200 px-3 py-2 rounded-lg inline-block">
                    Gracias por la oportunidad.
                </span>
            </div>

            <div class="text-right">
                <span class="bg-blue-600 text-white px-3 py-2 rounded-lg inline-block">
                    Programamos entrevista el viernes.
                </span>
            </div>

        </div>

        <div class="flex gap-2">
            <input type="text" placeholder="Escribe un mensaje..."
                class="flex-1 border rounded-lg p-2">
            <button class="bg-blue-600 text-white px-4 rounded-lg">Enviar</button>
        </div>

    </div>

</div>

<!-- SEGUNDA FILA -->
<div class="grid grid-cols-2 gap-6">

    <!-- NOTIFICACIONES -->
    <div class="bg-white p-6 rounded-xl shadow">

        <div class="flex justify-between mb-4">
            <h3 class="font-semibold">Notificaciones</h3>
            <span class="text-sm text-blue-600 cursor-pointer">Marcar todas</span>
        </div>

        <div class="space-y-3 text-sm">

            <div class="p-3 bg-gray-100 rounded-lg">
                <p class="font-semibold">Entrevista programada</p>
                <p class="text-gray-500">Juan Pérez - Mañana</p>
            </div>

            <div class="p-3 bg-gray-100 rounded-lg">
                <p class="font-semibold">Nuevo mensaje</p>
                <p class="text-gray-500">Carlos respondió</p>
            </div>

            <div class="p-3 bg-gray-100 rounded-lg">
                <p class="font-semibold">Evaluación completada</p>
                <p class="text-gray-500">María González</p>
            </div>

        </div>

    </div>

    <!-- PLANTILLAS -->
    <div class="bg-white p-6 rounded-xl shadow">

        <h3 class="font-semibold mb-4">Plantillas de Email</h3>

        <div class="space-y-4 text-sm">

            <div class="border p-3 rounded-lg">
                <p class="font-semibold">Confirmación de Entrevista</p>
                <p class="text-gray-500">Confirmamos tu entrevista...</p>
                <button class="mt-2 text-blue-600 text-sm">Usar</button>
            </div>

            <div class="border p-3 rounded-lg">
                <p class="font-semibold">Solicitud de Documentos</p>
                <p class="text-gray-500">Requerimos documentos...</p>
                <button class="mt-2 text-blue-600 text-sm">Usar</button>
            </div>

            <div class="border p-3 rounded-lg">
                <p class="font-semibold">Oferta Laboral</p>
                <p class="text-gray-500">Nos complace ofrecerte...</p>
                <button class="mt-2 text-blue-600 text-sm">Usar</button>
            </div>

        </div>

    </div>

</div>

@endsection