@extends('layouts.app')

@section('title', 'Candidatos')

@section('content')
<div class="p-6">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
        <a href="{{ route('vacantes.index') }}" class="text-gray-400 hover:text-white transition">← Volver</a>
        <div>
            <h1 class="text-2xl font-bold text-white">Candidatos postulados</h1>
            <p class="text-gray-400 text-sm mt-1">{{ $vacante['titulo'] }} · {{ count($candidatos) }} candidato(s)</p>
        </div>
    </div>

    @if(session('success'))
        <div class="mb-6 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-sm">
            {{ session('success') }}
        </div>
    @endif

    @forelse($candidatos as $candidato)
    <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-4">

        <!-- Info principal -->
        <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {{ strtoupper(substr($candidato['perfil']['nombre'] ?? 'U', 0, 1)) }}
                </div>
                <div>
                    <p class="text-white font-semibold text-lg">
                        {{ $candidato['perfil']['nombre'] ?? '—' }} {{ $candidato['perfil']['apellido'] ?? '' }}
                    </p>
                    <p class="text-gray-400 text-sm">{{ $candidato['email'] }}</p>
                    <p class="text-gray-400 text-sm">{{ $candidato['perfil']['puesto_actual'] ?? 'Sin puesto actual' }}</p>
                </div>
            </div>

            <!-- Respuesta -->
            <form method="POST" action="{{ route('postulaciones.responder', $candidato['id_postulacion']) }}">
                @csrf
                <div class="flex items-center gap-2">
                    <select name="estado"
                        class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500">
                        <option value="en_revision">En revisión</option>
                        <option value="aceptada">Aceptada</option>
                        <option value="rechazada">Rechazada</option>
                    </select>
                    <button type="submit"
                        class="bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition">
                        Enviar respuesta
                    </button>
                </div>
            </form>
        </div>

        <!-- Detalles del perfil -->
        @if($candidato['perfil'])
        <div class="mt-6 grid grid-cols-3 gap-4 border-t border-gray-700 pt-4">
            <div>
                <p class="text-gray-500 text-xs">Teléfono</p>
                <p class="text-gray-300 text-sm">{{ $candidato['perfil']['telefono'] ?? '—' }}</p>
            </div>
            <div>
                <p class="text-gray-500 text-xs">Experiencia</p>
                <p class="text-gray-300 text-sm">{{ $candidato['perfil']['experiencia_anios'] ?? '0' }} años</p>
            </div>
            <div>
                <p class="text-gray-500 text-xs">Ubicación</p>
                <p class="text-gray-300 text-sm">{{ $candidato['perfil']['ubicacion'] ?? '—' }}</p>
            </div>
        </div>

        @if($candidato['perfil']['resumen_profesional'])
        <div class="mt-4">
            <p class="text-gray-500 text-xs mb-1">Resumen profesional</p>
            <p class="text-gray-300 text-sm leading-relaxed">{{ $candidato['perfil']['resumen_profesional'] }}</p>
        </div>
        @endif

        <!-- Certificaciones -->
        @if(!empty($candidato['perfil']['certificaciones']))
        <div class="mt-4 border-t border-gray-700 pt-4">
            <p class="text-gray-500 text-xs mb-3">Certificaciones</p>
            <div class="flex flex-wrap gap-2">
                @foreach($candidato['perfil']['certificaciones'] as $cert)
                <div class="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
                    <p class="text-white text-xs font-medium">{{ $cert['nombre'] }}</p>
                    <p class="text-gray-400 text-xs">{{ $cert['institucion'] }} {{ $cert['anio'] ? '· '.$cert['anio'] : '' }}</p>
                </div>
                @endforeach
            </div>
        </div>
        @endif
        @endif

        <div class="mt-3">
            <p class="text-gray-500 text-xs">
                Postulado el {{ \Carbon\Carbon::parse($candidato['fecha_postulacion'])->format('d/m/Y H:i') }}
            </p>
        </div>

    </div>
    @empty
    <div class="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
        <p class="text-gray-400">No hay candidatos postulados a esta vacante aún.</p>
    </div>
    @endforelse

</div>
@endsection