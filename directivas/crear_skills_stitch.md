# Integrar Skills de Stitch

## Objetivo
Descargar, inspeccionar e integrar las skills de Stitch desde el repositorio público de GitHub (`https://github.com/google-labs-code/stitch-skills.git`) en el agente local para expandir sus capacidades.

## Entradas
- URL del repositorio: `https://github.com/google-labs-code/stitch-skills.git`

## Salidas
- Servidor / agente configurado con las nuevas skills listas para usarse.
- Carpetas movidas al directorio de skills del agente (`.agents/skills/` o similar).

## Lógica y Pasos
1. Clonar el repositorio dentro del directorio temporal `.tmp/stitch-skills`.
2. Inspeccionar la estructura del repositorio descargado para identificar la forma de las skills (carpetas con archivos `SKILL.md`).
3. Crear el directorio de skills del agente en el entorno local si no existe (`.agents/skills/`).
4. Copiar/Mover el contenido relevante desde el directorio temporal hacia `.agents/skills/`.
5. Eliminar o limpiar los datos temporales del clone (`.tmp/stitch-skills`).

## Trampas Conocidas y Casos Borde
- *Precaución:* El entorno de Windows puede requerir rutas absolutas y barras diagonales manejadas con cuidado.
- *Nota:* Algunas skills podrían venir comprimidas o con un README general que no forma parte de una skill individual. Hay que filtrar aquellas que sean verdaderamente skills (posean un `SKILL.md`).
