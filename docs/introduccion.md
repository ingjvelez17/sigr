# Introducción

Una línea base es un conjunto de artefactos —código, modelo de datos, configuración y documentación— que ha sido revisado y aprobado, y que de ahí en adelante sólo puede modificarse mediante un proceso controlado. En la práctica, es el punto fijo al que todos vuelven cuando se habla de "la versión actual del producto".

Establecerla temprano sirve para reconstruir el sistema en otro entorno sin sorpresas, para que cualquiera que entre al proyecto después tenga un punto de partida claro, y para que las decisiones de cambio dejen de discutirse de memoria y empiecen a quedar registradas.

## Sobre el sistema

El SIGR es una aplicación web para administrar la operación diaria de un restaurante mediano. La versión 1.0.0 incluye los cinco módulos que se consideran críticos para arrancar: autenticación de usuarios, menú digital, pedidos en tiempo real, reservas y cierre de caja con reportes.

Esta es la primera entrega funcionalmente completa del producto. Antes de iniciar la siguiente iteración —que incluirá facturación y pasarela de pagos— se congela el estado actual y se documenta formalmente como línea base.

## Qué contiene este informe

El documento sigue la estructura de la guía del taller. Después de esta introducción vienen el objetivo del taller y el contenido técnico, organizado en siete subsecciones que cubren: la descripción del proyecto, los componentes incluidos en la línea base, la estrategia de versionado con Git, los criterios usados para aprobarla, las herramientas de soporte, la documentación asociada y la validación final.

El código fuente, el `schema.sql` y los archivos `.md` referenciados están publicados en el repositorio:

> https://github.com/ingjvelez17/sigr

El tag `v1.0.0-baseline` apunta al commit que congela esta versión.

## Sobre las decisiones de diseño

El stack elegido (Node.js + Express + React + PostgreSQL) responde a tres criterios: ecosistema maduro con documentación abundante, facilidad para levantar el entorno de desarrollo, y soporte nativo de las características que la operación de restaurante necesita —especialmente la comunicación en tiempo real con la cocina vía WebSocket, que se resuelve con Socket.IO sin agregar servicios externos.

Las convenciones de código (camelCase para JavaScript, snake_case para SQL, Conventional Commits para Git) no son arbitrarias: son las que la mayoría del ecosistema usa, lo que facilita que un nuevo desarrollador entienda el proyecto sin tener que aprender reglas propias.
