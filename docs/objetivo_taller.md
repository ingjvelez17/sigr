# Objetivo del Taller

El taller busca aplicar lo visto en la Unidad 2 de Gestión del Software en un caso concreto: establecer formalmente la primera línea base del SIGR. No se trata sólo de etiquetar un commit con Git, sino de pasar por todo el proceso —identificar qué se incluye, definir criterios de aceptación, documentar el estado y dejar registrada la aprobación—.

## Objetivos específicos

Al terminar el taller se espera haber logrado:

- Identificar cuáles son los ítems de configuración (CI) de un sistema fullstack: no sólo el código, también el esquema de la BD, los archivos de variables de entorno, los scripts de despliegue y la documentación.
- Definir una línea base funcional aprobada, materializada en un tag anotado de Git (`v1.0.0-baseline`) sobre un commit específico de la rama estable.
- Documentar la línea base de modo que cualquier persona pueda reconstruirla en otro equipo sin información adicional.
- Aplicar versionado semántico (SemVer 2.0.0) para que el número de versión comunique por sí solo el tipo de cambio.
- Diseñar un flujo de control de versiones con Git que cubra estrategia de ramas, convención de mensajes de commit, política de Pull Requests y tagging de línea base.
- Definir criterios de aceptación verificables (no "que esté bonito", sino afirmaciones que puedan marcarse cumple/no cumple).
- Establecer un proceso de validación y aprobación con responsables claros, incluso cuando el equipo es de una sola persona.

## Competencias del curso reforzadas

| Competencia | Cómo aparece en el entregable |
| --- | --- |
| Gestión de configuración | Inventario de CI, tagging, política de cambios |
| Documentación técnica | README, CHANGELOG, ERD, manual de despliegue |
| Planificación de versiones | Adopción de SemVer y de Keep a Changelog |
| Trabajo con Git | Estrategia de ramas, Conventional Commits, PRs |
| Aseguramiento de calidad | Criterios de aceptación verificables |

## Alcance

La línea base v1.0.0 cubre los cinco módulos críticos del sistema:

1. Autenticación con roles diferenciados (cliente, mesero, administrador).
2. Menú digital con CRUD de platos y categorías.
3. Pedidos en tiempo real con notificación a cocina vía Socket.IO.
4. Reservas por fecha, hora y mesa con control anti-colisión.
5. Cierre de caja por turno y reporte diario de ventas.

Quedan fuera del alcance de esta versión, para no inflar el primer hito:

- Facturación electrónica (DIAN).
- Integración con pasarelas de pago (PSE, tarjetas, billeteras).
- Aplicación móvil nativa.
- Reportes predictivos / BI avanzado.
