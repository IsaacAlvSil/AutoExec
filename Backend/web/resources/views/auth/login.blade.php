<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoExec - Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-white min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md px-4">
        <div class="bg-gray-50 rounded-2xl p-8 shadow-xl">

            <!-- Logo -->
            <div class="flex flex-col items-center mb-8">
                <div class="flex flex-col items-center mb-8">
                <img src="{{ asset('images/logo.png') }}" alt="Logo AutoExec" class="w-24 h-auto mb-4">
                <h1 class="text-2xl font-bold text-gray-900">AutoExec</h1>
                </div>
                <p class="text-sm text-gray-500 text-center mt-1">
                    Sistema de Gestión de Personal<br>
                    Industria Automotriz
                </p>
            </div>

            <!-- Errores -->
            @if($errors->any())
                <div class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {{ $errors->first() }}
                </div>
            @endif

            <!-- Formulario -->
            <form method="POST" action="/login">
                @csrf
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input type="email" name="email" value="{{ old('email') }}"
                        placeholder="correo@empresa.com"
                        class="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-400">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input type="password" name="password"
                        class="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                </div>
                <div class="flex items-center justify-between mb-6">
                    <label class="flex items-center gap-2 text-sm text-gray-600">
                    </label>
                    <a href="/recuperar-password" class="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit"
                    class="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition text-sm">
                    Iniciar Sesión
                </button>
            </form>

            <div class="mt-6 border-t border-gray-200 pt-4 text-center">
                <p class="text-xs text-gray-400">Sistema seguro para reclutadores y recursos humanos</p>
                <p class="text-xs text-gray-400 mt-1">© 2026 AutoRecruit. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
</body>
</html>