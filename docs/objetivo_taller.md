# Objetivo del Taller

El taller tiene como propósito establecer formalmente la primera línea base del Sistema Integral de Gestión de Restaurante (SIGR), aplicando los principios de Gestión de Configuración del Software vistos en la Unidad 2 del curso *Gestión del Software*. La línea base constituye el primer hito de estabilidad del proyecto y será el punto de referencia sobre el cual se construirán las futuras validaciones, controles de cambio y entregas.

## Objetivos específicos

Al finalizar el taller se busca que el desarrollador sea capaz de:

1. Identificar los ítems de configuración que componen un sistema de software fullstack: código fuente, modelo de datos, documentación y scripts de despliegue.
2. Definir y aprobar una línea base funcional, congelando un estado específico del producto mediante un tag anotado de Git (`v1.0.0-baseline`) asociado a un commit concreto.
3. Documentar técnicamente la línea base de manera reproducible, auditable y comprensible para quien retome el proyecto en el futuro.
4. Aplicar versionado semántico (SemVer) para comunicar la naturaleza de los cambios entre versiones.
5. Diseñar un flujo de control de versiones con Git que incluya estrategia de ramas, convenciones de mensajes de commit, política de Pull Requests y proceso de creación de tags de línea base.
6. Definir criterios de aceptación verificables que el código debe cumplir para ser considerado parte de la línea base.
7. Establecer un proceso formal de validación y aprobación con los roles responsables claramente diferenciados.

## Competencias reforzadas

| Competencia | Evidencia en el entregable |
| --- | --- |
| Gestión de configuración | Definición de ítems, tagging, política de cambios |
| Documentación técnica | README, CHANGELOG, ERD, manual de despliegue |
| Planificación de versiones | Adopción de SemVer y de Keep a Changelog |
| Trabajo con Git | GitHub Flow, PRs revisados, squash merge |
| Aseguramiento de calidad | Criterios de aceptación verificables |
| Comunicación técnica | Tabla de endpoints, manual operativo |

## Alcance

La línea base comprende los cinco módulos críticos del sistema:

1. Autenticación con roles diferenciados (cliente, mesero, administrador).
2. Menú digital con CRUD de platos y categorías.
3. Registro y seguimiento de pedidos en tiempo real.
4. Reservas por fecha y hora.
5. Cierre de caja y reportes diarios de ventas.

Quedan fuera del alcance de esta versión, y se posponen para iteraciones posteriores:

- Facturación electrónica (DIAN).
- Integración con pasarelas de pago.
- Aplicación móvil nativa.
- Dashboards predictivos.
