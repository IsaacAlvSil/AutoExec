<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoExec - Recuperar contraseña</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-800 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md px-4">
        <div class="bg-gray-50 rounded-2xl p-8 shadow-xl">
            <div class="flex flex-col items-center mb-6">
                <div class="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
                <p class="text-sm text-gray-500 text-center mt-1">Ingresa tu email y tu nueva contraseña</p>
            </div>

            @if(session('success'))
                <div class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {{ session('success') }}
                </div>
            @endif
            @if($errors->any())
                <div class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {{ $errors->first() }}
                </div>
            @endif

            <form method="POST" action="/recuperar-password">
                @csrf
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input type="email" name="email" value="{{ old('email') }}"
                        placeholder="correo@empresa.com"
                        class="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-400">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                    <input type="password" name="nueva_password"
                        class="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                    <input type="password" name="nueva_password_confirmation"
                        class="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                </div>
                <button type="submit"
                    class="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition text-sm">
                    Cambiar contraseña
                </button>
            </form>

            <div class="mt-4 text-center">
                <a href="/login" class="text-sm text-blue-600 hover:underline">Volver al inicio de sesión</a>
            </div>
        </div>
    </div>
</body>
</html>