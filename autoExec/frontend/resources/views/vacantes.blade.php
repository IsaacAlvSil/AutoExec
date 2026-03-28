@extends('layouts.app')

@section('content')

<div class="p-6 space-y-6">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Gestión de Vacantes</h1>

        <div class="flex gap-3">
            <button class="border px-4 py-2 rounded-lg">Filtros</button>

            <button onclick="abrirModal()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
                + Nueva Vacante
            </button>
        </div>
    </div>

    <!--  BUSCADOR -->
    <input id="buscador"
        type="text"
        placeholder="Buscar vacantes..."
        class="w-full border rounded-lg p-3">

    <!-- CARDS -->
    <div class="grid grid-cols-4 gap-6">

        <div class="bg-white p-5 rounded-xl shadow">
            <p class="text-gray-500">Total Vacantes</p>
            <h2 class="text-3xl font-bold">{{ count($vacantes) }}</h2>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
            <p class="text-gray-500">Activas</p>
            <h2 class="text-3xl font-bold text-green-600">{{ count($vacantes) }}</h2>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
            <p class="text-gray-500">En Revisión</p>
            <h2 class="text-3xl font-bold text-yellow-500">0</h2>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
            <p class="text-gray-500">Postulantes</p>
            <h2 class="text-3xl font-bold">--</h2>
        </div>

    </div>

    <!-- TABLA -->
    <div class="bg-white rounded-xl shadow p-5">

        <h2 class="text-lg font-semibold mb-4">Lista de Vacantes</h2>

        <table class="w-full text-sm">

            <thead class="text-gray-500 border-b">
                <tr>
                    <th class="text-left py-3">Posición</th>
                    <th>Departamento</th>
                    <th>Ubicación</th>
                    <th>Salario</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>

            @forelse($vacantes as $i => $vacante)
                <tr class="border-b hover:bg-gray-50 fila-vacante">

                    <td class="py-4">
                        <p class="font-semibold">{{ $vacante['titulo'] }}</p>
                        <span class="text-gray-400 text-xs">Tiempo Completo</span>
                    </td>

                    <td>{{ $vacante['departamento'] }}</td>
                    <td>{{ $vacante['ubicacion'] }}</td>

                    <td>
                        ${{ $vacante['salario_min'] }} - ${{ $vacante['salario_max'] }}
                    </td>

                    <td class="flex gap-3">

                        <!-- EDITAR -->
                        <button onclick="editarVacante({{ $i }})"
                            class="text-blue-600 font-semibold">
                            Editar
                        </button>

                        <!-- ELIMINAR -->
                        <form action="{{ route('vacantes.delete', $i) }}" method="POST">
                            @csrf
                            @method('DELETE')

                            <button class="text-red-500 font-semibold">
                                Eliminar
                            </button>
                        </form>

                    </td>

                </tr>

            @empty

                <tr>
                    <td colspan="5" class="text-center py-6 text-gray-400">
                        No hay vacantes registradas
                    </td>
                </tr>

            @endforelse

            </tbody>

        </table>

    </div>

</div>

<!-- MODAL -->
<div id="modalVacante" class="hidden fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

    <div class="bg-white w-[600px] rounded-xl shadow-lg p-6">

        <h2 class="text-xl font-bold mb-4">Vacante</h2>

        <form id="formVacante" method="POST" action="/vacantes">
            @csrf

            <input id="titulo" name="titulo" placeholder="Título"
                class="w-full border rounded-lg p-2 mb-2">

            <input id="departamento" name="departamento" placeholder="Departamento"
                class="w-full border rounded-lg p-2 mb-2">

            <input id="ubicacion" name="ubicacion" placeholder="Ubicación"
                class="w-full border rounded-lg p-2 mb-2">

            <div class="grid grid-cols-2 gap-2">
                <input id="salario_min" name="salario_min" placeholder="Salario mínimo"
                    class="border rounded-lg p-2">

                <input id="salario_max" name="salario_max" placeholder="Salario máximo"
                    class="border rounded-lg p-2">
            </div>

            <div class="flex justify-end gap-3 pt-4">

                <button type="button" onclick="cerrarModal()"
                    class="px-4 py-2 border rounded-lg">
                    Cancelar
                </button>

                <button class="bg-blue-600 text-white px-5 py-2 rounded-lg">
                    Guardar
                </button>

            </div>

        </form>

    </div>

</div>

<!-- JS -->
<script>

// MODAL
function abrirModal() {
    document.getElementById('formVacante').reset();
    document.getElementById('formVacante').action = "/vacantes";
    eliminarMetodoPUT();
    document.getElementById('modalVacante').classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('modalVacante').classList.add('hidden');
}

// EDITAR
function editarVacante(index) {

    let vacantes = @json($vacantes);
    let data = vacantes[index];

    document.getElementById('titulo').value = data.titulo;
    document.getElementById('departamento').value = data.departamento;
    document.getElementById('ubicacion').value = data.ubicacion;
    document.getElementById('salario_min').value = data.salario_min;
    document.getElementById('salario_max').value = data.salario_max;

    document.getElementById('formVacante').action = "/vacantes/" + index;

    agregarMetodoPUT();

    document.getElementById('modalVacante').classList.remove('hidden');
}

// PUT METHOD
function agregarMetodoPUT() {
    eliminarMetodoPUT();

    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_method';
    input.value = 'PUT';

    document.getElementById('formVacante').appendChild(input);
}

function eliminarMetodoPUT() {
    let old = document.querySelector('[name="_method"]');
    if (old) old.remove();
}

//  BUSCADOR PRO
document.getElementById('buscador').addEventListener('keyup', function () {

    let texto = this.value.toLowerCase();

    let filas = document.querySelectorAll('.fila-vacante');

    filas.forEach(fila => {

        let contenido = fila.innerText.toLowerCase();

        if (contenido.includes(texto)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }

    });

});

</script>

@endsection