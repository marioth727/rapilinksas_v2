# SOP: Rediseño de Sección de Planes (Rapilink)

## Objetivo
Actualizar la sección de planes en `src/components/PlanesGrid.tsx` para que coincida con el nuevo diseño visual: una tarjeta destacada (Popular) con fondo oscuro y las demás con fondos claros, iconos específicos y textos renovados.

## Entradas
- Imagen de referencia del nuevo diseño.
- Colores corporativos: `#1A3A5C` (Azul oscuro), `#0066CC` (Azul acción).
- Lista de planes actual en `PlanesGrid.tsx`.

## Lógica y Pasos
1. **Encabezado**: Cambiar el título a "Planes diseñados para tu vida" y el subtítulo a "Sin letras pequeñas, solo velocidad real."
2. **Estructura de Tarjeta**:
    - **Tarjetas Normales**: Fondo gris muy claro (`bg-gray-100` o similar), texto oscuro, botón "Solicitar" con estilo secundario.
    - **Tarjeta Popular (Familia 200MB)**: Fondo azul corporativo (`bg-[#1A3A5C]`), texto blanco, banner "MÁS POPULAR" estilizado, botón "Solicitar Ahora" con fondo azul brillante.
3. **Contenido de Tarjeta**:
    - Nombre del plan en la parte superior izquierda.
    - Velocidad debajo del nombre en negrita grande.
    - Precio destacado con "/ mes".
    - **Beneficios**: Todos los planes DEBEN incluir "Televisión Incluida" como primer beneficio.
    - Lista de beneficios con iconos descriptivos (ej. `Tv`, `Wifi`, `Download`).
4. **Interactividad**: Mantener animaciones de `framer-motion` para entrada y hover.

## Trampas Conocidas y Casos Borde
- **Contraste**: Asegurar que el texto sea legible en el fondo oscuro de la tarjeta popular.
- **Responsividad**: Las tarjetas deben apilarse correctamente en móviles y ajustarse a 4 columnas en desktop.
- **Iconos**: Asegurar que `lucide-react` esté bien importado y los iconos se ajusten al tamaño adecuado.
