@extends('layouts.app')

@section('title', 'Notificaciones')

@section('content')
<div class="p-6 max-w-4xl">

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-2xl font-bold text-black">Notificaciones</h1>
            <p class="text-gray-400 text-sm mt-1">
                {{ $noLeidas }} sin leer · {{ count($notificaciones) }} en total
            </p>
        </div>
        <div class="flex gap-2">
            @if($noLeidas > 0)
            <form method="POST" action="{{ route('notificaciones.todasLeidas') }}">
                @csrf @method('PUT')
                <button type="submit"
                    class="text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">
                    Marcar todas como leídas
                </button>
            </form>
            @endif
            <form method="POST" action="{{ route('notificaciones.eliminarLeidas') }}"
                onsubmit="return confirm('¿Eliminar todas las notificaciones leídas?')">
                @csrf @method('DELETE')
                <button type="submit"
                    class="text-sm bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition">
                    Eliminar leídas
                </button>
            </form>
        </div>
    </div>

    <!-- Lista -->
    <div class="space-y-3">
        @forelse($notificaciones as $notif)
        <div class="bg-blue-800 border {{ !$notif['leida'] ? 'border-blue-700' : 'border-gray-700' }} rounded-xl p-4 flex items-start justify-between gap-4">
            <div class="flex items-start gap-3 flex-1">
                <!-- Icono tipo -->
                <div class="mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    {{ $notif['tipo'] === 'vacante' ? 'bg-blue-900' : '' }}
                    {{ $notif['tipo'] === 'postulacion' ? 'bg-purple-900' : '' }}
                    {{ !in_array($notif['tipo'], ['vacante','postulacion']) ? 'bg-gray-700' : '' }}
                ">
                    @if($notif['tipo'] === 'vacante')
                        <svg class="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01"/>
                        </svg>
                    @elseif($notif['tipo'] === 'postulacion')
                        <svg class="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    @else
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                        </svg>
                    @endif
                </div>

                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <p class="text-white font-medium text-sm">{{ $notif['titulo'] }}</p>
                        @if(!$notif['leida'])
                            <span class="bg-red-700 text-white text-xs px-2 py-0.5 rounded-full">Nueva</span>
                        @endif
                        <span class="text-xs px-2 py-0.5 rounded-full
                            {{ $notif['tipo'] === 'vacante' ? 'bg-blue-900 text-white' : '' }}
                            {{ $notif['tipo'] === 'postulacion' ? 'bg-purple-900 text-white' : '' }}
                            {{ !in_array($notif['tipo'], ['vacante','postulacion']) ? 'bg-gray-700 text-gray-400' : '' }}
                        ">{{ $notif['tipo'] }}</span>
                    </div>
                    <p class="text-gray-400 text-sm mt-1">{{ $notif['mensaje'] }}</p>
                    <p class="text-gray-200 text-xs mt-2">
                        {{ \Carbon\Carbon::parse($notif['fecha_envio'])->format('d/m/Y H:i') }}
                    </p>
                </div>
            </div>

            <!-- Acciones -->
            <div class="flex items-center gap-2 flex-shrink-0">
                @if(!$notif['leida'])
                <form method="POST" action="{{ route('notificaciones.leida', $notif['id_notificacion']) }}">
                    @csrf @method('PUT')
                    <button type="submit" class="text-xs text-gray-400 hover:text-white transition">
                        Leída
                    </button>
                </form>
                @endif
                <form method="POST" action="{{ route('notificaciones.eliminar', $notif['id_notificacion']) }}"
                    onsubmit="return confirm('¿Eliminar esta notificación?')">
                    @csrf @method('DELETE')
                    <button type="submit" class="text-xs text-red-400 hover:text-red-300 transition">
                        Eliminar
                    </button>
                </form>
            </div>
        </div>
        @empty
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
            <p class="text-gray-400">No hay notificaciones.</p>
        </div>
        @endforelse
    </div>

</div>
@endsection