<div class="w-64 bg-gray-900 text-white min-h-screen">

    <!-- LOGO -->
    <div class="p-6">
        <h1 class="text-xl font-bold">AutoExec</h1>
        <p class="text-sm text-gray-400">Sistema de Gestión RH</p>
    </div>

    <!-- MENU -->
    <ul class="space-y-2 px-3">

        <li>
            <a href="{{ route('dashboard') }}"
               class="block px-4 py-2 rounded
               {{ request()->is('dashboard') ? 'bg-blue-600' : 'hover:bg-gray-800' }}">
                Dashboard
            </a>
        </li>

        <li>
            <a href="{{ route('vacantes') }}"
               class="block px-4 py-2 rounded
               {{ request()->is('vacantes*') ? 'bg-blue-600' : 'hover:bg-gray-800' }}">
                Vacantes
            </a>
        </li>

        <li>
            <a href="{{ route('candidatos') }}"
               class="block px-4 py-2 rounded
               {{ request()->is('candidatos*') ? 'bg-blue-600' : 'hover:bg-gray-800' }}">
                Candidatos
            </a>
        </li>

        <li>
            <a href="{{ route('evaluaciones') }}"
               class="block px-4 py-2 rounded
               {{ request()->is('evaluaciones*') ? 'bg-blue-600' : 'hover:bg-gray-800' }}">
                Evaluaciones
            </a>
        </li>

        <li>
            <a href="{{ route('postulaciones') }}"
               class="block px-4 py-2 rounded
               {{ request()->is('postulaciones*') ? 'bg-blue-600' : 'hover:bg-gray-800' }}">
                Postulaciones
            </a>
        </li>

        <li>
            <a href="{{ route('reportes') }}"
               class="block px-4 py-2 rounded
               {{ request()->is('reportes*') ? 'bg-blue-600' : 'hover:bg-gray-800' }}">
                Reportes
            </a>
        </li>

        <li>
            <a href="{{ route('comunicacion') }}"
               class="block px-4 py-2 rounded
               {{ request()->is('comunicacion*') ? 'bg-blue-600' : 'hover:bg-gray-800' }}">
                Comunicación
            </a>
        </li>

        <li>
            <a href="{{ route('admin') }}"
               class="block px-4 py-2 rounded
               {{ request()->is('admin*') ? 'bg-blue-600' : 'hover:bg-gray-800' }}">
                Administración
            </a>
        </li>

    </ul>

</div>