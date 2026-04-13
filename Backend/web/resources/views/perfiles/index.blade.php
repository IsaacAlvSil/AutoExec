@extends('layouts.app')

@section('title', 'Candidatos')

@section('content')
<div class="p-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-2xl font-bold text-white">Candidatos</h1>
            <p class="text-gray-400 text-sm mt-1">{{ count($perfiles) }} perfiles registrados</p>
        </div>
        <!-- Buscador -->
        <form method="GET" action="{{ route('perfiles.buscar') }}" class="flex gap-2">
            <input type="email" name="email" placeholder="Buscar por email..."
                class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 placeholder-gray-500 w-64">
            <button type="submit"
                class="bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition">
                Buscar
            </button>
        </form>
    </div>

    <!-- Grid de perfiles -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @forelse($perfiles as $perfil)
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-500 transition">

            <!-- Avatar y nombre -->
            <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {{ strtoupper(substr($perfil['nombre'] ?? 'U', 0, 1)) }}
                </div>
                <div class="min-w-0">
                    <p class="text-white font-semibold truncate">
                        {{ $perfil['nombre'] ?? '—' }} {{ $perfil['apellido'] ?? '' }}
                    </p>
                    <p class="text-gray-400 text-xs truncate">{{ $perfil['email'] }}</p>
                </div>
            </div>

            <!-- Info -->
            <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-500 text-xs w-24 flex-shrink-0">Puesto</span>
                    <span class="text-gray-300 text-xs truncate">{{ $perfil['puesto_actual'] ?? '—' }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-500 text-xs w-24 flex-shrink-0">Experiencia</span>
                    <span class="text-gray-300 text-xs">{{ $perfil['experiencia_anios'] ?? 0 }} años</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-500 text-xs w-24 flex-shrink-0">Ubicación</span>
                    <span class="text-gray-300 text-xs truncate">{{ $perfil['ubicacion'] ?? '—' }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-500 text-xs w-24 flex-shrink-0">Teléfono</span>
                    <span class="text-gray-300 text-xs">{{ $perfil['telefono'] ?? '—' }}</span>
                </div>
            </div>

            <!-- Resumen -->
            @if($perfil['resumen_profesional'])
            <p class="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                {{ $perfil['resumen_profesional'] }}
            </p>
            @endif

            <!-- Certificaciones -->
            @if(!empty($perfil['certificaciones']))
            <div class="mb-4">
                <p class="text-gray-500 text-xs mb-2">Certificaciones</p>
                <div class="flex flex-wrap gap-1">
                    @foreach(array_slice($perfil['certificaciones'], 0, 3) as $cert)
                    <span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {{ $cert['nombre'] }}
                    </span>
                    @endforeach
                    @if(count($perfil['certificaciones']) > 3)
                    <span class="bg-gray-700 text-gray-500 text-xs px-2 py-1 rounded-full">
                        +{{ count($perfil['certificaciones']) - 3 }} más
                    </span>
                    @endif
                </div>
            </div>
            @endif

        </div>
        @empty
        <div class="col-span-3 bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
            <p class="text-gray-400">No hay candidatos registrados.</p>
        </div>
        @endforelse
    </div>

</div>
@endsection