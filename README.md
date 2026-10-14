# Órbita Store

Tienda web hecha con HTML, CSS y JavaScript puro (sin dependencias).

## Estructura

```
index.html      → Estructura de la página
css/styles.css  → Estilos (colores en las variables de :root)
js/script.js    → Catálogo, filtros, búsqueda, carrito y formulario
```

## Cómo verla

Abre `index.html` en el navegador (doble clic).

## Personalizar

- **Productos:** edita la lista `PRODUCTS` al inicio de `js/script.js`.
  Para usar fotos, agrega `image: "img/mi-foto.jpg"` a un producto.
- **Colores:** cambia las variables `--primary`, `--accent`, etc. en `css/styles.css`.
- **Moneda:** la función `formatPrice` en `js/script.js` (por defecto Lempiras, `L`).
