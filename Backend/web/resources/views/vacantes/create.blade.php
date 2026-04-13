@extends('layouts.app')

@section('title', 'Nueva Vacante')

@section('content')
<div class="p-6 max-w-3xl">

    <div class="flex items-center gap-3 mb-8">
        <a href="{{ route('vacantes.index') }}" class="text-gray-400 hover:text-white transition">
            ← Volver
        </a>
        <div>
            <h1 class="text-2xl font-bold text-white">Nueva Vacante</h1>
            <p class="text-gray-400 text-sm mt-1">Completa los datos para publicar una nueva vacante</p>
        </div>
    </div>

    @if($errors->any())
        <div class="mb-6 bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
            {{ $errors->first() }}
        </div>
    @endif

    <form method="POST" action="{{ route('vacantes.store') }}">
        @csrf

        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">

            <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Título del puesto *</label>
                <input type="text" name="titulo" value="{{ old('titulo') }}"
                    placeholder="Ej. Ingeniero de Calidad Sr."
                    class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 placeholder-gray-500">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
                <textarea name="descripcion" rows="4"
                    placeholder="Describe las responsabilidades y requisitos del puesto..."
                    class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 placeholder-gray-500">{{ old('descripcion') }}</textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Salario ofrecido (MXN) *</label>
                    <input type="number" name="salario_ofrecido" value="{{ old('salario_ofrecido') }}"
                        placeholder="Ej. 35000"
                        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 placeholder-gray-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nivel de inglés *</label>
                    <select name="nivel_ingles"
                        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500">
                        <option value="">Seleccionar...</option>
                        <option value="Básico" {{ old('nivel_ingles') == 'Básico' ? 'selected' : '' }}>Básico</option>
                        <option value="Intermedio" {{ old('nivel_ingles') == 'Intermedio' ? 'selected' : '' }}>Intermedio</option>
                        <option value="Avanzado" {{ old('nivel_ingles') == 'Avanzado' ? 'selected' : '' }}>Avanzado</option>
                        <option value="Bilingüe" {{ old('nivel_ingles') == 'Bilingüe' ? 'selected' : '' }}>Bilingüe</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Ubicación *</label>
                    <input type="text" name="ubicacion" value="{{ old('ubicacion') }}"
                        placeholder="Ej. Parque Industrial Querétaro"
                        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 placeholder-gray-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Modalidad *</label>
                    <select name="modalidad"
                        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500">
                        <option value="">Seleccionar...</option>
                        <option value="Presencial" {{ old('modalidad') == 'Presencial' ? 'selected' : '' }}>Presencial</option>
                        <option value="Híbrido" {{ old('modalidad') == 'Híbrido' ? 'selected' : '' }}>Híbrido</option>
                        <option value="Remoto" {{ old('modalidad') == 'Remoto' ? 'selected' : '' }}>Remoto</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Departamento *</label>
                    <select name="id_departamento"
                        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500">
                        <option value="">Seleccionar departamento...</option>
                        @foreach($departamentos as $dep)
                            <option value="{{ $dep['id_departamento'] }}" {{ old('id_departamento') == $dep['id_departamento'] ? 'selected' : '' }}>
                                {{ $dep['nombre'] }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Fecha de cierre *</label>
                    <input type="date" name="fecha_cierre" value="{{ old('fecha_cierre') }}"
                        class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <select name="estado"
                    class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-red-500">
                    <option value="Activa" {{ old('estado', 'Activa') == 'Activa' ? 'selected' : '' }}>Activa</option>
                    <option value="Inactiva" {{ old('estado') == 'Inactiva' ? 'selected' : '' }}>Inactiva</option>
                    <option value="Cerrada" {{ old('estado') == 'Cerrada' ? 'selected' : '' }}>Cerrada</option>
                </select>
            </div>

        </div>

        <div class="flex items-center gap-4 mt-6">
            <button type="submit"
                class="bg-red-700 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition text-sm">
                Publicar vacante
            </button>
            <a href="{{ route('vacantes.index') }}" class="text-gray-400 hover:text-white text-sm transition">
                Cancelar
            </a>
        </div>

    </form>
</div>
@endsection