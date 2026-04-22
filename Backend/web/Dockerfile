FROM php:8.3-apache

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    libpq-dev libpng-dev libonig-dev libxml2-dev \
    nodejs npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Extensiones PHP
RUN docker-php-ext-install pdo pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar proyecto
COPY . .

# Instalar dependencias PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Copiar .env si no existe y generar APP_KEY
RUN cp .env.example .env 2>/dev/null || true
RUN php artisan key:generate --force

# Instalar y compilar assets JS/CSS
RUN npm install && npm run build 2>/dev/null || echo "Build de assets omitido"

# Permisos Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Activar mod_rewrite (necesario para Laravel)
RUN a2enmod rewrite

# Configurar DocumentRoot → /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf 2>/dev/null || true

# AllowOverride All — sin esto Laravel da 404 en todas las rutas
RUN find /etc/apache2 -name "*.conf" -exec \
    sed -i 's/AllowOverride None/AllowOverride All/g' {} \; 2>/dev/null || true

EXPOSE 80

CMD ["apache2-foreground"]
