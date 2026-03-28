@extends('layouts.app')

@section('content')

<h1 class="text-2xl font-bold mb-6">Administración del Sistema</h1>

<!-- KPIs -->
<div class="grid grid-cols-4 gap-6 mb-6">

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Usuarios Totales</p>
        <h2 class="text-xl font-bold">17</h2>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Activos</p>
        <h2 class="text-xl font-bold text-green-600">14</h2>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Roles</p>
        <h2 class="text-xl font-bold text-purple-600">4</h2>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-500 text-sm">Eventos Hoy</p>
        <h2 class="text-xl font-bold text-yellow-600">42</h2>
    </div>

</div>

<!-- USUARIOS -->
<div class="bg-white p-6 rounded-xl shadow mb-6">

    <div class="flex justify-between mb-4">
        <h3 class="font-semibold">Gestión de Usuarios</h3>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Nuevo Usuario</button>
    </div>

    <table class="w-full text-sm">
        <thead class="text-left text-gray-500">
            <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Departamento</th>
                <th>Estado</th>
                <th>Último Acceso</th>
                <th>Acciones</th>
            </tr>
        </thead>

        <tbody class="space-y-2">

            <tr class="border-t">
                <td class="py-2">Roberto Méndez</td>
                <td>Administrador</td>
                <td>Recursos Humanos</td>
                <td><span class="text-green-600">Activo</span></td>
                <td>2026-02-22</td>
                <td>✏️ 🗑️</td>
            </tr>

            <tr class="border-t">
                <td class="py-2">Ana Torres</td>
                <td>Reclutador Senior</td>
                <td>RH</td>
                <td><span class="text-green-600">Activo</span></td>
                <td>2026-02-22</td>
                <td>✏️ 🗑️</td>
            </tr>

            <tr class="border-t">
                <td class="py-2">Luis Fernández</td>
                <td>Evaluador</td>
                <td>Dirección</td>
                <td><span class="text-green-600">Activo</span></td>
                <td>2026-02-21</td>
                <td>✏️ 🗑️</td>
            </tr>

            <tr class="border-t">
                <td class="py-2">Carmen Ruiz</td>
                <td>Reclutador</td>
                <td>RH</td>
                <td><span class="text-gray-500">Inactivo</span></td>
                <td>2026-02-15</td>
                <td>✏️ 🗑️</td>
            </tr>

        </tbody>
    </table>

</div>

<!-- ROLES -->
<div class="grid grid-cols-2 gap-6 mb-6">

    <div class="bg-white p-6 rounded-xl shadow">

        <h3 class="font-semibold mb-4">Administrador</h3>

        <p class="text-sm text-gray-500 mb-3">Acceso completo</p>

        <div class="flex flex-wrap gap-2 text-xs mb-3">
            <span class="bg-gray-200 px-2 py-1 rounded">Usuarios</span>
            <span class="bg-gray-200 px-2 py-1 rounded">Configuración</span>
        </div>

        <button class="text-blue-600 text-sm">Editar</button>

    </div>

    <div class="bg-white p-6 rounded-xl shadow">

        <h3 class="font-semibold mb-4">Reclutador Senior</h3>

        <p class="text-sm text-gray-500 mb-3">Gestión completa</p>

        <div class="flex flex-wrap gap-2 text-xs mb-3">
            <span class="bg-gray-200 px-2 py-1 rounded">Vacantes</span>
            <span class="bg-gray-200 px-2 py-1 rounded">Candidatos</span>
        </div>

        <button class="text-blue-600 text-sm">Editar</button>

    </div>

</div>

<!-- AUDITORÍA -->
<div class="bg-white p-6 rounded-xl shadow mb-6">

    <div class="flex justify-between mb-4">
        <h3 class="font-semibold">Registro de Auditoría</h3>
        <button class="text-blue-600 text-sm">Ver completo</button>
    </div>

    <ul class="space-y-2 text-sm">

        <li>Roberto creó vacante</li>
        <li>Ana actualizó candidato</li>
        <li>Luis asignó evaluación</li>
        <li>Roberto eliminó usuario</li>
        <li>Ana exportó reporte</li>

    </ul>

</div>

<!-- CONFIGURACIÓN -->
<div class="bg-white p-6 rounded-xl shadow">

    <h3 class="font-semibold mb-4">Configuración del Sistema</h3>

    <div class="space-y-3 text-sm">

        <div class="flex justify-between">
            <span>Idioma</span>
            <span>Español</span>
        </div>

        <div class="flex justify-between">
            <span>Zona Horaria</span>
            <span>CDMX</span>
        </div>

        <div class="flex justify-between">
            <span>Formato Fecha</span>
            <span>DD/MM/YYYY</span>
        </div>

        <div class="flex justify-between">
            <span>Notificaciones</span>
            <span>Activadas</span>
        </div>

        <div class="flex justify-between">
            <span>Retención</span>
            <span>365 días</span>
        </div>

    </div>

    <div class="mt-4 flex gap-2">
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Guardar Cambios
        </button>

        <button class="bg-gray-200 px-4 py-2 rounded-lg">
            Restaurar
        </button>
    </div>

</div>

@endsection