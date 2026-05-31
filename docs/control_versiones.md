# Control de Versiones

## 1. Herramienta

El proyecto usa **Git** como sistema de control de versiones distribuido y **GitHub** como remoto:

- Repositorio: https://github.com/ingjvelez17/sigr
- Rama estable: `main`

Git se eligió por ser el estándar de la industria, por su modelo distribuido y por su soporte para tags anotados, que son fundamentales para congelar líneas base de forma inmutable.

## 2. Estrategia de ramas

Se adopta una variante simplificada de GitHub Flow adecuada para equipos pequeños:

```
main  ────●────●────●────●─────────●────●──►   (rama estable)
           \              \         /     \
            \              \       /       \
    feature/auth      feature/menu      hotfix/login
```

| Rama | Propósito |
| --- | --- |
| `main` | Rama estable. Cada commit es desplegable. Aquí viven los tags de línea base. |
| `feature/<nombre>` | Desarrollo de una nueva funcionalidad. Se elimina tras el merge. |
| `bugfix/<nombre>` | Corrección de un bug detectado en `main`. |
| `hotfix/<nombre>` | Parche urgente en producción. Genera tag PATCH. |

Reglas de protección de `main`:

- No se permite `push --force` directo.
- Todo cambio entra mediante Pull Request con al menos un revisor.
- Los checks de CI deben estar verdes antes del merge.
- Se prefiere *squash merge* para mantener un historial lineal.

## 3. Convención de mensajes de commit

Se adopta **Conventional Commits**, con el formato:

```
<tipo>(<ámbito opcional>): <descripción imperativa en español>
```

| Tipo | Cuándo usar | Ejemplo |
| --- | --- | --- |
| `feat` | Nueva funcionalidad | `feat(menu): agregar filtro por categoría` |
| `fix` | Corrección de bug | `fix(auth): manejar token expirado` |
| `docs` | Sólo documentación | `docs(readme): actualizar tabla de endpoints` |
| `refactor` | Reorganización sin cambio funcional | `refactor(orders): extraer cálculo de total` |
| `test` | Pruebas | `test(reservation): cubrir colisión de mesa` |
| `chore` | Tareas de mantenimiento | `chore: actualizar dependencias` |
| `style` | Formato | `style: aplicar prettier` |
| `perf` | Mejora de rendimiento | `perf(report): indexar created_at` |
| `ci` | Pipeline CI/CD | `ci: agregar workflow de tests` |

Reglas: descripción en imperativo presente, máximo 72 caracteres en la primera línea, sin punto final, referenciar issues en el footer con `Closes #N`.

## 4. Flujo operativo

```bash
git checkout main
git pull origin main
git checkout -b feature/menu-crud

# ... cambios ...
git add backend/src/controllers/menuController.js
git commit -m "feat(menu): implementar CRUD de platos"
git push -u origin feature/menu-crud
```

Para abrir el PR:

```bash
gh pr create --base main \
  --title "feat(menu): CRUD completo de platos" \
  --body "Implementa los 5 endpoints CRUD bajo /api/menu/items. Closes #12"
```

El PR debe incluir: descripción del cambio, pasos de prueba y checklist de tests, docs actualizadas y ausencia de secretos. Tras la aprobación se hace *squash merge* en `main` y se elimina la rama remota.

## 5. Creación del tag de línea base

Una vez aprobado el alcance comprometido para la versión 1.0.0:

```bash
git checkout main
git pull origin main

git tag -a v1.0.0-baseline \
  -m "Línea base SIGR v1.0.0 - Aprobada por Juan Esteban Vélez el 2026-05-31"

git push origin v1.0.0-baseline

gh release create v1.0.0-baseline \
  --title "SIGR v1.0.0 - Línea Base" \
  --notes-file CHANGELOG.md
```

Se usa un tag **anotado** (con `-a`) y no liviano porque el anotado se almacena como objeto Git completo con autor, fecha y mensaje firmable. Un tag liviano es sólo un puntero móvil y no debe usarse para líneas base.

El tag `v1.0.0-baseline` es **inmutable**. Si se descubre un defecto, no se modifica el tag sino que se crea un nuevo tag de parche (`v1.0.1-baseline`) y se documenta el cambio en `CHANGELOG.md`.

## 6. GitHub Issues

Todo el seguimiento operativo se hace en GitHub Issues del repositorio.

| Tipo | Etiqueta | Contenido esperado |
| --- | --- | --- |
| Bug | `bug` | Reproducción, esperado vs real, entorno |
| Mejora | `enhancement` | Motivación, propuesta, criterios de aceptación |
| Documentación | `docs` | Sección afectada, propuesta |
| Pregunta | `question` | Contexto y pregunta |

Etiquetas adicionales: `priority:high/medium/low`, `module:auth`, `module:menu`, `module:orders`, `module:reservations`, `module:cash`.

Flujo de cierre: un usuario abre el issue, se prioriza en el Project Board, se asigna a una persona, se vincula al PR mediante `Closes #N` en la descripción, y al hacer merge GitHub cierra automáticamente el issue.

Cada release agrupa issues en un *milestone* (`v1.0.0-baseline`, `v1.1.0`, etc.) para visualizar el avance hacia esa meta.

## 7. Validación y aprobación de la línea base

```
1. Congelar alcance (no merges fuera de hotfixes)
2. Ejecutar checklist de aceptación (docs/linea_base_v1.md §2)
3. QA firma evidencias
4. Líder de proyecto aprueba en reunión de release
5. Se crea el tag anotado v1.0.0-baseline
6. Se publica el release en GitHub con el CHANGELOG
7. Se notifica al equipo y se archiva la firma
```

| Rol | Responsabilidad |
| --- | --- |
| Desarrollador | Implementar cambios, abrir PRs, mantener tests verdes |
| QA | Verificar criterios de aceptación, firmar evidencia |
| Líder de proyecto | Aprobar formalmente la línea base |
| Arquitecto | Validar coherencia técnica |

Para este proyecto académico, dado que el equipo lo conforma una sola persona, los cuatro roles los asume Juan Esteban Vélez Vanegas como rol coordinador designado, dejando constancia en el documento `linea_base_v1.md`.

## 8. Herramientas de soporte del ecosistema

### GitHub

- Repositorio remoto: https://github.com/ingjvelez17/sigr
- Pull Requests como mecanismo único para integrar cambios a `main`.
- Releases asociados a cada tag con el `CHANGELOG.md` adjunto.
- Branch protection en `main` con requisitos de PR, revisión y checks.

### GitHub Issues

Sirve como herramienta única de seguimiento de bugs, mejoras y preguntas. Las etiquetas por módulo y por prioridad permiten filtrar el backlog. Los milestones agrupan el trabajo asociado a cada release.

### Jenkins (opcional, planeado)

Está planificado integrar Jenkins como servidor de CI/CD en una fase posterior. La pipeline contemplada tendría las siguientes etapas:

```
[Push a main / PR] -> [Checkout] -> [Lint] -> [Tests] -> [Build] -> [Deploy staging]
```

Referencia de `Jenkinsfile`:

```groovy
pipeline {
    agent any
    stages {
        stage('Install') { steps { sh 'npm run install:all' } }
        stage('Lint')    { steps { sh 'npm --prefix frontend run lint' } }
        stage('Test')    { steps { sh 'npm --prefix backend test' } }
        stage('Build')   { steps { sh 'npm run build' } }
    }
}
```

Mientras Jenkins no esté disponible, los checks básicos se ejecutan manualmente al abrir cada Pull Request.

### Otras convenciones

| Herramienta | Rol | Estado |
| --- | --- | --- |
| GitHub | Hosting, PRs, Issues, Releases | Activo |
| GitHub Issues | Seguimiento de bugs y mejoras | Activo |
| Jenkins | CI/CD | Planeado |
| Keep a Changelog | Convención de bitácora | Activo |
| Conventional Commits | Convención de commits | Activo |
| SemVer 2.0.0 | Esquema de versionado | Activo |

## 9. Comandos útiles

```bash
git tag --list
git show v1.0.0-baseline
git log v1.0.0-baseline..HEAD --oneline
git checkout v1.0.0-baseline
git log --all --decorate --oneline --graph
git shortlog -sne
git commit --amend
```

## 10. Trazabilidad de la línea base actual

| Atributo | Valor |
| --- | --- |
| Tag | `v1.0.0-baseline` |
| Fecha | 31/05/2026 |
| Rama de origen | `main` |
| Aprobador | Juan Esteban Vélez Vanegas |
| Documento de soporte | `docs/linea_base_v1.md` |
| Changelog | `CHANGELOG.md` |
