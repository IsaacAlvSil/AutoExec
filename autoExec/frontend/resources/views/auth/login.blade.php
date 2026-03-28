<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>AutoExec - Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-[#3e5570] flex items-center justify-center h-screen">

<div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

    <!-- LOGO -->
    <div class="flex justify-center mb-4">
        <div class="bg-[#2e4665] p-4 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
        </div>
    </div>

    <!-- TITULO -->
    <h2 class="text-2xl font-bold text-center text-[#2e4665]">AutoExec</h2>
    <p class="text-center text-gray-500 mt-1">Sistema de Gestión de Personal</p>
    <p class="text-center text-gray-400 text-sm mb-6">Industria Automotriz - Alto Mando</p>

    <!-- FORM -->
    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- EMAIL -->
        <label class="block mb-2 font-medium">Correo electrónico</label>
        <div class="flex items-center border rounded-lg px-3 py-2 mb-4">
            <span class="mr-2 text-gray-400"></span>
            <input type="email" name="email" class="w-full outline-none" placeholder="reclutador@empresa.com">
        </div>

        <!-- PASSWORD -->
        <label class="block mb-2 font-medium">Contraseña</label>
        <div class="flex items-center border rounded-lg px-3 py-2 mb-4">
            <span class="mr-2 text-gray-400"></span>
            <input type="password" name="password" class="w-full outline-none" placeholder="********">
        </div>

        <!-- OPTIONS -->
        <div class="flex justify-between items-center mb-4 text-sm">
            <label><input type="checkbox"> Recordarme</label>
            <a href="#" class="text-[#2e4665]">¿Olvidaste tu contraseña?</a>
        </div>

        <!-- BUTTON -->
        <button class="w-full bg-[#2e4665] text-white py-3 rounded-lg font-semibold hover:bg-[#243a55]">
            Iniciar Sesión
        </button>

    </form>

    <!-- FOOTER -->
    <div class="mt-6 text-center text-sm text-gray-400">
        Sistema seguro para reclutadores y recursos humanos <br>
        © 2026 AutoExec. Todos los derechos reservados.
    </div>

</div>

</body>
</html>