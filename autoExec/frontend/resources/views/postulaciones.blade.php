@extends('layouts.app')

@section('content')

<div class="space-y-6">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Postulaciones</h1>

        <button onclick="abrirModal()"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg">
            + Nueva Postulación
        </button>
    </div>

    <!-- TABLA -->
    <div class="bg-white p-6 rounded-xl shadow">

        <table class="w-full text-sm">

            <thead class="border-b text-gray-500">
                <tr>
                    <th>Candidato</th>
                    <th>Vacante</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>

            @forelse($postulaciones as $i => $p)

                <tr class="border-b">

                    <td>{{ $p['candidato'] }}</td>
                    <td>{{ $p['vacante'] }}</td>

                    <td>
                        <form action="/postulaciones/{{ $i }}" method="POST">
                            @csrf
                            @method('PUT')

                            <select name="estado" onchange="this.form.submit()"
                                class="border rounded p-1">

                                <option {{ $p['estado']=='Nuevo'?'selected':'' }}>Nuevo</option>
                                <option {{ $p['estado']=='En proceso'?'selected':'' }}>En proceso</option>
                                <option {{ $p['estado']=='Entrevista'?'selected':'' }}>Entrevista</option>
                                <option {{ $p['estado']=='Contratado'?'selected':'' }}>Contratado</option>

                            </select>

                        </form>
                    </td>

                    <td>
                        <form action="/postulaciones/{{ $i }}" method="POST">
                            @csrf
                            @method('DELETE')

                            <button class="text-red-500">Eliminar</button>
                        </form>
                    </td>

                </tr>

            @empty

                <tr>
                    <td colspan="4" class="text-center py-6 text-gray-400">
                        No hay postulaciones
                    </td>
                </tr>

            @endforelse

            </tbody>

        </table>

    </div>

</div>

<!-- MODAL -->
<div id="modal" class="hidden fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

    <div class="bg-white p-6 rounded-xl w-[400px]">

        <h2 class="font-bold mb-4">Nueva Postulación</h2>

        <form action="/postulaciones" method="POST">
            @csrf

            <select name="candidato" class="w-full mb-2 border p-2">
                @foreach($candidatos as $c)
                    <option>{{ $c['nombre'] }}</option>
                @endforeach
            </select>

            <select name="vacante" class="w-full mb-2 border p-2">
                @foreach($vacantes as $v)
                    <option>{{ $v['titulo'] }}</option>
                @endforeach
            </select>

            <select name="estado" class="w-full mb-4 border p-2">
                <option>Nuevo</option>
                <option>En proceso</option>
            </select>

            <div class="flex justify-end gap-2">
                <button type="button" onclick="cerrar()" class="bg-gray-300 px-3 py-2">
                    Cancelar
                </button>

                <button class="bg-blue-600 text-white px-3 py-2">
                    Guardar
                </button>
            </div>

        </form>

    </div>

</div>

<script>

function abrirModal(){
    document.getElementById('modal').classList.remove('hidden');
}

function cerrar(){
    document.getElementById('modal').classList.add('hidden');
}

</script>

@endsection