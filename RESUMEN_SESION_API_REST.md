# 📚 Resumen de la Sesión: Arquitectura y Comunicación API REST

**Proyecto:** `app_tareas_separado`  
**Fecha:** 12 de Octubre, 2026  

---

## 1. Infraestructura y Puertos Levantados

Separamos el monolito en dos servidores independientes comunicándose por red:

* **Backend (Django REST Framework):**  
  * URL base: `http://127.0.0.1:8001/api/tareas/`
  * Ejecuta la lógica del negocio, validaciones y conexión con SQLite.
* **Frontend (HTML5 / Vanilla CSS / JavaScript):**  
  * URL: `http://127.0.0.1:8080/`
  * Provee la interfaz visual al usuario e interactúa con el backend mediante `fetch()`.

---

## 2. Replicación Visual y Funcional (CRUD Completo)

Se adaptó el frontend para tener la misma apariencia *Dark Mode con Glassmorphism* del proyecto monolítico original:
* **Badges de estado:** *Completada* (verde) y *Pendiente* (ámbar).
* **Campos del modelo:** Título, Descripción y Estado (completada/pendiente).
* **Modal interactivo:** Confirmación antes de eliminar tareas (`DELETE`).
* **Formulario reutilizable:** Sirve tanto para crear tareas nuevas (`POST`) como para editar existentes (`PUT`).

---

## 3. ¿Qué es una API REST vs. un Endpoint?

* **API (Application Programming Interface):** Es el sistema de comunicación completo que expone el backend para que cualquier cliente interactúe con él.
* **Endpoint:** Es cada dirección URL específica con su método HTTP asociado.

### Los Endpoints de nuestro proyecto:
Configurados automáticamente en `backend/api_project/urls.py` mediante `DefaultRouter`:

| Método HTTP | Endpoint (URL) | Acción en BD | Función interna DRF |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/api/tareas/` | `SELECT *` | `.list()` (Listar todas) |
| **`GET`** | `/api/tareas/{id}/` | `SELECT WHERE id=X` | `.retrieve()` (Detalle) |
| **`POST`** | `/api/tareas/` | `INSERT INTO` | `.create()` (Crear) |
| **`PUT`** | `/api/tareas/{id}/` | `UPDATE WHERE id=X` | `.update()` (Actualizar) |
| **`DELETE`**| `/api/tareas/{id}/` | `DELETE WHERE id=X` | `.destroy()` (Eliminar) |

---

## 4. El Ciclo de Actualización (`PUT`)

1. **HTML:** El formulario tiene un `<input type="hidden" id="tareaId">`. Si tiene valor (ej: `id = 1`), el frontend sabe que es una edición.
2. **JavaScript (`app.js`):**  
   * Prepara el objeto en memoria JS.
   * `JSON.stringify(datos)` convierte el objeto a texto JSON plano.
   * `fetch(url, { method: 'PUT', body: ... })` envía la petición a `http://127.0.0.1:8001/api/tareas/1/`.
3. **Backend (`Django`):**
   * **CORS:** `CorsMiddleware` valida que el origen `8080` tenga autorización (`CORS_ALLOW_ALL_ORIGINS = True`).
   * **Router:** Detecta `PUT /api/tareas/1/` y delega a `TareaViewSet.update()`.
   * **Serializer:** `TareaSerializer(tarea, data=request.data)` valida tipos y restricciones (`is_valid()`).
   * **Base de datos:** Se ejecuta el `UPDATE` en la tabla SQLite.

---

## 5. El Ciclo de Lectura (`GET` / `SELECT`)

1. **Frontend:** Ejecuta `fetch('http://127.0.0.1:8001/api/tareas/')`. Al no especificar método, por estándar JS asume **`GET`**.
2. **Backend:**
   * El Router vincula el `GET` al método `.list()`.
   * Se ejecuta el `SELECT` definido en el atributo de clase `queryset = Tarea.objects.all().order_by('-id')`.
   * El Serializer convierte los modelos de Python a diccionarios.
   * `JSONRenderer` transforma los diccionarios a texto JSON puro y responde con código `200 OK`.
3. **Frontend:** Recibe el JSON (`respuesta.json()`) y crea dinámicamente las etiquetas `<li>` para renderizarlas en el DOM.

---

## 6. POO en Django REST Framework: Código Explícito vs `ModelViewSet`

### ¿Por qué `views.py` tiene solo 4 líneas?
```python
class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all().order_by('-id')
    serializer_class = TareaSerializer
```
* **Herencia:** `ModelViewSet` ya contiene la lógica de `list()`, `create()`, `update()`, etc., programada internamente en sus clases padre (*Mixins*).
* **Los ingredientes:** `queryset` y `serializer_class` son **atributos de clase**. Se definen al arrancar el servidor y son consultados por el padre (`get_queryset()` y `get_serializer()`) cada vez que entra una petición HTTP.

### Comparativa:
* **Código explícito (A mano):** Escribir cada función con `@api_view`, manejar los `try/except`, validar a mano los `404` y registrar cada URL (~40 líneas por modelo). Útil para entender las bases o crear endpoints muy atípicos.
* **`ModelViewSet`:** Ahorra cientos de líneas repetitivas (*boilerplate*), estandariza respuestas de error y facilita añadir paginación y filtros.

---

## 7. Consumo desde Otras Aplicaciones Web

La API REST es **agnóstica** del cliente. Al responder con JSON estándar:
* Cualquier aplicación en **React, Angular, Vue, aplicaciones móviles (Flutter/React Native)** o **backends en otros lenguajes (Node.js, PHP, C#)** puede consumir los datos haciendo simplemente un `GET http://127.0.0.1:8001/api/tareas/`.
