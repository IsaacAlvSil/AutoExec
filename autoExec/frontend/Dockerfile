FROM php:8.2-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl \
    nodejs \
    npm \
    libpng-dev \
    libonig-dev \
    libxml2-dev

# Limpiar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Extensiones PHP
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www/html

# Copiar el proyecto
COPY . .

# Instalar dependencias de PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Instalar dependencias de JS y compilar (opcional si usas Vite/Tailwind)
RUN npm install && npm run build

# Permisos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Activar mod_rewrite de Apache
RUN a2enmod rewrite

# Configurar el DocumentRoot de Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# Exponer puerto 80
EXPOSE 80

CMD ["apache2-foreground"]