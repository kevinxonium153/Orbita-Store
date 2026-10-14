# ÓRBITA

Tienda web de ÓRBITA: mini CD llavero y cuadros de pared con NFC, hechos en Honduras.
HTML, CSS y JavaScript puro, sin dependencias.

## Estructura

```
index.html      → Estructura: portada, cómo funciona, qué incluye, catálogo y contacto
css/styles.css  → Estilos con la paleta oficial (negro tinta, crema cálido, dorado)
js/script.js    → Datos de contacto, catálogo, filtros, búsqueda y carrito
img/            → Fotos de producto
```

## Cómo verla

Abre `index.html` en el navegador (doble clic).

## Personalizar

- **Contacto:** objeto `CONTACT` al inicio de `js/script.js` (WhatsApp, Instagram, TikTok, correo).
  Se actualiza en toda la página y en los pedidos.
- **Productos y precios:** lista `PRODUCTS` en `js/script.js`.
- **Colores:** variables en `:root` de `css/styles.css` (modo claro y oscuro).

## Pedidos

El carrito arma un mensaje con los productos y el subtotal y lo abre en WhatsApp
al número configurado en `CONTACT.whatsapp`.
