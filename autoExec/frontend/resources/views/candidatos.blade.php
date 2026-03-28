@extends('layouts.app')

@section('content')

<div class="space-y-6">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Gestión de Candidatos</h1>

        <div class="flex gap-3">
            <input id="buscador"
                type="text"
                placeholder="Buscar candidatos..."
                class="border rounded-lg px-4 py-2 w-80">

            <button onclick="abrirModal()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg">
                + Nuevo
            </button>
        </div>
    </div>

    <!-- CARDS -->
    <div class="grid grid-cols-4 gap-6">

        <div class="bg-white p-4 rounded-xl shadow">
            <p class="text-gray-500 text-sm">Total</p>
            <h2 class="text-2xl font-bold">{{ count($candidatos) }}</h2>
        </div>

        <div class="bg-white p-4 rounded-xl shadow">
            <p class="text-gray-500 text-sm">En Proceso</p>
            <h2 class="text-2xl font-bold">--</h2>
        </div>

        <div class="bg-white p-4 rounded-xl shadow">
            <p class="text-gray-500 text-sm">Finalistas</p>
            <h2 class="text-2xl font-bold">--</h2>
        </div>

        <div class="bg-white p-4 rounded-xl shadow">
            <p class="text-gray-500 text-sm">Contratados</p>
            <h2 class="text-2xl font-bold">--</h2>
        </div>

    </div>

    <!-- TABLA -->
    <div class="bg-white p-6 rounded-xl shadow">

        <h3 class="font-semibold mb-4">Lista de Candidatos</h3>

        <table class="w-full text-sm">

            <thead class="text-gray-500 border-b">
                <tr>
                    <th class="text-left py-2">Candidato</th>
                    <th>Posición</th>
                    <th>Experiencia</th>
                    <th>Educación</th>
                    <th>Ubicación</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>

            @forelse($candidatos as $i => $c)
                <tr class="border-b fila-candidato">

                    <td class="py-4 flex items-center gap-3">
                        <div class="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
                            {{ strtoupper(substr($c['nombre'],0,1)) }}
                        </div>
                        <div>
                            <p class="font-semibold">{{ $c['nombre'] }}</p>
                            <p class="text-gray-400 text-xs">{{ $c['email'] }}</p>
                        </div>
                    </td>

                    <td>{{ $c['posicion'] }}</td>
                    <td>{{ $c['experiencia'] }}</td>
                    <td>{{ $c['educacion'] }}</td>
                    <td>{{ $c['ubicacion'] }}</td>

                    <td class="flex gap-3">

                        <button onclick="editar({{ $i }})"
                            class="text-blue-600">
                            Editar
                        </button>

                        <form action="{{ route('candidatos.delete', $i) }}" method="POST">
                            @csrf
                            @method('DELETE')

                            <button class="text-red-500">
                                Eliminar
                            </button>
                        </form>

                    </td>

                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center py-6 text-gray-400">
                        No hay candidatos
                    </td>
                </tr>
            @endforelse

            </tbody>

        </table>

    </div>

</div>

<!-- MODAL -->
<div id="modal" class="hidden fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

    <div class="bg-white p-6 rounded-xl w-[500px]">

        <h2 class="text-xl font-bold mb-4">Candidato</h2>

        <form id="form" method="POST" action="/candidatos">
            @csrf

            <input id="nombre" name="nombre" placeholder="Nombre" class="w-full mb-2 border p-2">
            <input id="email" name="email" placeholder="Email" class="w-full mb-2 border p-2">
            <input id="posicion" name="posicion" placeholder="Posición" class="w-full mb-2 border p-2">
            <input id="experiencia" name="experiencia" placeholder="Experiencia" class="w-full mb-2 border p-2">
            <input id="educacion" name="educacion" placeholder="Educación" class="w-full mb-2 border p-2">
            <input id="ubicacion" name="ubicacion" placeholder="Ubicación" class="w-full mb-2 border p-2">

            <div class="flex justify-end gap-2 mt-4">
                <button type="button" onclick="cerrar()" class="bg-gray-300 px-4 py-2">
                    Cancelar
                </button>

                <button class="bg-blue-600 text-white px-4 py-2">
                    Guardar
                </button>
            </div>

        </form>

    </div>

</div>

<!-- JS -->
<script>

function abrirModal() {
    document.getElementById('form').reset();
    document.getElementById('form').action = "/candidatos";
    quitarPUT();
    document.getElementById('modal').classList.remove('hidden');
}

function cerrar() {
    document.getElementById('modal').classList.add('hidden');
}

function editar(i) {

    let data = @json($candidatos)[i];

    document.getElementById('nombre').value = data.nombre;
    document.getElementById('email').value = data.email;
    document.getElementById('posicion').value = data.posicion;
    document.getElementById('experiencia').value = data.experiencia;
    document.getElementById('educacion').value = data.educacion;
    document.getElementById('ubicacion').value = data.ubicacion;

    document.getElementById('form').action = "/candidatos/" + i;

    agregarPUT();

    document.getElementById('modal').classList.remove('hidden');
}

function agregarPUT() {
    quitarPUT();

    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_method';
    input.value = 'PUT';

    document.getElementById('form').appendChild(input);
}

function quitarPUT() {
    let old = document.querySelector('[name="_method"]');
    if (old) old.remove();
}

//  BUSCADOR
document.getElementById('buscador').addEventListener('keyup', function () {

    let texto = this.value.toLowerCase();

    document.querySelectorAll('.fila-candidato').forEach(f => {

        let contenido = f.innerText.toLowerCase();

        f.style.display = contenido.includes(texto) ? '' : 'none';

    });

});

</script>

@endsection