#!/bin/sh
# Copia solo los archivos del sitio a dist/ (lo que Cloudflare Pages publica).
# Así el código de functions/, netlify/ y otros archivos del repositorio no quedan públicos.
set -e

rm -rf dist
mkdir dist
cp -r index.html _headers robots.txt sitemap.xml css js hero imagenes dist/

echo "Sitio listo en dist/"
