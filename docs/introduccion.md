# Introducción

Una línea base en ingeniería de software es un conjunto de artefactos —código, modelo de datos, documentación y configuración— que ha sido revisado y aprobado formalmente, y que en adelante sólo puede modificarse mediante un procedimiento controlado de cambios. Es el punto fijo al que todos los participantes del proyecto se refieren cuando hablan de "la versión actual del producto".

Establecer una línea base temprano en el ciclo de vida no es un trámite administrativo: es lo que hace posible que cualquier integrante futuro pueda reconstruir el mismo estado del sistema, que las auditorías encuentren un punto de partida estable, y que la gestión de cambios deje de ser una conversación informal y se convierta en un proceso trazable.

## Sobre el sistema SIGR

El Sistema Integral de Gestión de Restaurante (SIGR) cubre las operaciones diarias de un restaurante mediano: autenticación de los actores que intervienen (clientes, meseros y administrador), un menú digital editable, registro y seguimiento de pedidos hacia cocina, reservas con control de mesa por fecha y hora, y cierre de caja con reportes diarios de ventas.

La versión 1.0.0 contiene los cinco módulos críticos comprometidos en la planeación inicial y constituye la primera entrega funcionalmente completa del producto. Antes de iniciar la siguiente iteración —que sumará facturación electrónica y pagos en línea— es imprescindible congelar el estado actual, documentarlo y aprobarlo formalmente.

## Alcance del documento

El presente informe documenta esa línea base y comprende:

- Portada, introducción y objetivo del taller.
- Descripción del proyecto y de los componentes incluidos.
- Estrategia de versionado con Git y herramientas de soporte.
- Criterios de aceptación verificados.
- Documentación asociada (README, CHANGELOG, licencia, modelo de datos, manual de despliegue).
- Validación y aprobación firmada del entregable.

## Justificación académica

El trabajo aplica los conceptos de la Unidad 2 del curso *Gestión del Software*: identificación de ítems de configuración, definición y aprobación de una línea base, adopción de un modelo de ramas en Git, uso de versionado semántico y de la convención Keep a Changelog, y establecimiento de un flujo de Pull Request como mecanismo de control de calidad antes de incorporar cambios a la rama estable.

## Lectura recomendada

Para evaluar el entregable se sugiere recorrer los documentos en este orden:

1. Portada (`docs/portada.md`).
2. Introducción (este documento).
3. Objetivo del taller (`docs/objetivo_taller.md`).
4. README — visión técnica del producto.
5. `docs/linea_base_v1.md` — artefacto central de la entrega.
6. `docs/control_versiones.md` — evidencia del dominio de SCM.
7. `docs/estructura_bd.md` — diseño del modelo de datos.
8. `docs/manual_despliegue.md` — operación en producción.
9. `CHANGELOG.md` — historial detallado.
10. Código fuente y `database/schema.sql` como soporte material.

El proyecto adopta [Semantic Versioning 2.0.0](https://semver.org/). El sufijo `-baseline` indica una versión congelada y aprobada formalmente, no una pre-release.
