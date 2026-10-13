# 📝 App Tareas - API REST

Aplicación de gestión de tareas con arquitectura separada: **Backend (Django REST Framework)** y **Frontend (HTML/CSS/JS)**.

## 🏗️ Arquitectura

```
app_tareas_separado/
├── backend/          # API REST con Django
│   ├── api/          # App principal (models, views, serializers)
│   └── api_project/  # Configuración del proyecto Django
└── frontend/         # Interfaz web (HTML + JS vanilla)
    ├── index.html
    └── app.js
```

## ⚙️ Tecnologías

- **Backend:** Python, Django, Django REST Framework
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Base de datos:** SQLite (desarrollo)

## 🚀 Instalación

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py runserver 8001
```

### Frontend
Abrir `frontend/index.html` en el navegador o usar Live Server.

## 📡 Endpoints de la API

| Método   | URL                  | Acción            |
|----------|----------------------|-------------------|
| GET      | /api/tareas/         | Listar tareas     |
| POST     | /api/tareas/         | Crear tarea       |
| GET      | /api/tareas/{id}/    | Detalle de tarea  |
| PUT      | /api/tareas/{id}/    | Actualizar tarea  |
| DELETE   | /api/tareas/{id}/    | Eliminar tarea    |

## 👤 Autor

Edward Méndez - [@eamc07](https://github.com/eamc07)