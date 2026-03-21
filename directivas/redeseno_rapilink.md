# Rediseño Rapilink ISP (Stitch)

## Objetivo
Refactorizar y rediseñar la arquitectura visual de Rapilink (empresa ISP) basándonos en el contenido de su repositorio obsoleto (`https://github.com/marioth727/RapilinkSAS.git`) y en los estándares modernos de la competencia en Colombia. El diseño se generará mediante Stitch, buscando una "excelente experiencia de usuario", con animaciones, secciones de FAQ y un formulario de contacto (diseño visual para futura integración con n8n).

## Entradas
- URL del repo source: `https://github.com/marioth727/RapilinkSAS.git`
- Búsquedas web de la competencia (ISPs en Colombia, ej. Claro, Movistar, Wom, ISPs locales).

## Salidas
- Proyecto de Stitch con pantallas para: Inicio, Servicios (Planes de Internet), Preguntas Frecuentes (FAQ), y Contacto.
- Documento de especificación de diseño (DESIGN.md).

## Lógica y Pasos
1. Clonar el repositorio en `.tmp/RapilinkSAS` temporalmente para extraer textos informativos (misión, visión, planes).
2. Investigar ISPs en Colombia para sugerir secciones adicionales.
3. Definir un prompt maestro de interfaz visual incorporando las instrucciones de Stitch.
4. Llamar al MCP de Stitch para inicializar el proyecto.
5. Generar iterativamente la UI con `stitch_generate_screen_from_text`.

## Trampas Conocidas y Casos Borde
- *Funcionalidad de Formularios:* Stitch es puramente de diseño UI estático/generativo; la conexión real con n8n no ocurrirá en Stitch, por lo tanto, el foco de la etapa de Stitch radicará en la existencia visual del "Contact Form", no en su lógica de backend.
