@extends('layouts.app')

@section('title', 'Vacantes')

@section('content')
<div class="p-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-2xl font-bold text-white">Vacantes</h1>
            <p class="text-gray-400 text-sm mt-1">{{ count($vacantes) }} vacantes registradas</p>
        </div>
        <a href="{{ route('vacantes.create') }}"
            class="bg-red-700 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            + Nueva vacante
        </a>
    </div>

    <!-- Tabla -->
    <div class="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
            <thead>
                <tr class="text-gray-400 border-b border-gray-700 bg-gray-900">
                    <th class="text-left px-6 py-4">Título</th>
                    <th class="text-left px-6 py-4">Ubicación</th>
                    <th class="text-left px-6 py-4">Modalidad</th>
                    <th class="text-left px-6 py-4">Salario</th>
                    <th class="text-left px-6 py-4">Inglés</th>
                    <th class="text-left px-6 py-4">Cierre</th>
                    <th class="text-left px-6 py-4">Estado</th>
                    <th class="text-left px-6 py-4">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($vacantes as $vacante)
                <tr class="border-b border-gray-700 hover:bg-gray-700 transition">
                    <td class="px-6 py-4">
                        <p class="text-white font-medium">{{ $vacante['titulo'] }}</p>
                        <p class="text-gray-400 text-xs mt-1 line-clamp-1">{{ Str::limit($vacante['descripcion'], 60) }}</p>
                    </td>
                    <td class="px-6 py-4 text-gray-300 text-xs">{{ $vacante['ubicacion'] }}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs
                            {{ $vacante['modalidad'] === 'Presencial' ? 'bg-blue-900 text-blue-300' : '' }}
                            {{ $vacante['modalidad'] === 'Híbrido' ? 'bg-purple-900 text-purple-300' : '' }}
                            {{ $vacante['modalidad'] === 'Remoto' ? 'bg-green-900 text-green-300' : '' }}
                        ">
                            {{ $vacante['modalidad'] }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-300">
                        ${{ number_format($vacante['salario_ofrecido'], 0) }}
                    </td>
                    <td class="px-6 py-4 text-gray-300 text-xs">{{ $vacante['nivel_ingles'] }}</td>
                    <td class="px-6 py-4 text-gray-400 text-xs">
                        {{ \Carbon\Carbon::parse($vacante['fecha_cierre'])->format('d/m/Y') }}
                    </td>
                    <td class="px-6 py-4">
                        <span class="text-xs px-2 py-1 rounded-full
                            {{ $vacante['estado'] === 'Activa' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400' }}">
                            {{ $vacante['estado'] }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            <a href="{{ route('vacantes.candidatos', $vacante['id_vacante']) }}"
                                class="text-xs bg-blue-900 hover:bg-blue-800 text-blue-300 px-3 py-1 rounded-lg transition">
                                Candidatos
                            <a href="{{ route('vacantes.edit', $vacante['id_vacante']) }}"
                                class="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg transition">
                                Editar
                            </a>
                            <form method="POST" action="{{ route('vacantes.destroy', $vacante['id_vacante']) }}"
                                onsubmit="return confirm('¿Eliminar esta vacante?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                    class="text-xs bg-red-900 hover:bg-red-800 text-red-300 px-3 py-1 rounded-lg transition">
                                    Eliminar
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="px-6 py-8 text-center text-gray-400">
                        No hay vacantes registradas.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

</div>
@endsection