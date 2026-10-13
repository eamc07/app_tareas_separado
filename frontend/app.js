const API_URL = 'http://127.0.0.1:8001/api/tareas/';

let tareaAEliminarId = null;

// ===== NAVEGACIÓN ENTRE VISTAS =====

function mostrarLista() {
    document.getElementById('vistaLista').style.display = 'block';
    document.getElementById('vistaFormulario').style.display = 'none';
    limpiarFormulario();
    obtenerTareas();
}

function mostrarFormulario(tareaId = null) {
    document.getElementById('vistaLista').style.display = 'none';
    document.getElementById('vistaFormulario').style.display = 'block';

    if (tareaId) {
        // Modo EDITAR: cargamos los datos de la tarea
        document.getElementById('formTitulo').textContent = 'Editar Tarea 📝';
        fetch(`${API_URL}${tareaId}/`)
            .then(respuesta => respuesta.json())
            .then(tarea => {
                document.getElementById('tareaId').value = tarea.id;
                document.getElementById('tituloInput').value = tarea.titulo;
                document.getElementById('descripcionInput').value = tarea.descripcion || '';
                document.getElementById('completadaInput').checked = tarea.completada;
            });
    } else {
        // Modo CREAR
        document.getElementById('formTitulo').textContent = 'Nueva Tarea ✨';
        limpiarFormulario();
    }
}

function limpiarFormulario() {
    document.getElementById('tareaId').value = '';
    document.getElementById('tituloInput').value = '';
    document.getElementById('descripcionInput').value = '';
    document.getElementById('completadaInput').checked = false;
}

// ===== OPERACIONES CRUD VÍA API REST =====

// LEER (GET) - Pide los datos al Backend
function obtenerTareas() {
    fetch(API_URL)
        .then(respuesta => respuesta.json())
        .then(datos => {
            const lista = document.getElementById('listaTareas');
            lista.innerHTML = '';

            if (datos.length === 0) {
                lista.innerHTML = `
                    <div class="empty-state">
                        <h2>🚀 ¡Todo al día!</h2>
                        <p>No tienes tareas pendientes en este momento.</p>
                    </div>
                `;
                return;
            }

            // Recorremos el JSON devuelto por Django
            datos.forEach(tarea => {
                const li = document.createElement('li');
                li.className = 'task-item';

                const badgeClass = tarea.completada ? 'status-completed' : 'status-pending';
                const badgeText = tarea.completada ? 'Completada' : 'Pendiente';

                li.innerHTML = `
                    <div class="task-info">
                        <span class="task-title">${tarea.titulo}</span>
                        <span class="task-status">
                            Estado: <span class="status-badge ${badgeClass}">${badgeText}</span>
                        </span>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-outline" style="padding: 0.5rem 1rem;" onclick="mostrarFormulario(${tarea.id})">✎ Editar</button>
                        <button class="btn btn-danger" style="padding: 0.5rem 1rem;" onclick="abrirModalEliminar(${tarea.id}, '${tarea.titulo.replace(/'/g, "\\'")}')">🗑</button>
                    </div>
                `;
                lista.appendChild(li);
            });
        });
}

// CREAR (POST) o ACTUALIZAR (PUT) - Envía datos al Backend
function guardarTarea(event) {
    event.preventDefault();

    const id = document.getElementById('tareaId').value;
    const titulo = document.getElementById('tituloInput').value;
    const descripcion = document.getElementById('descripcionInput').value;
    const completada = document.getElementById('completadaInput').checked;

    if (!titulo) return;

    const datos = {
        titulo: titulo,
        descripcion: descripcion,
        completada: completada
    };

    let url = API_URL;
    let metodo = 'POST';

    if (id) {
        // Si hay ID, estamos editando → usamos PUT
        url = `${API_URL}${id}/`;
        metodo = 'PUT';
    }

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(respuesta => respuesta.json())
    .then(() => {
        mostrarLista();
    });
}

// ELIMINAR (DELETE) - Modal de confirmación
function abrirModalEliminar(id, titulo) {
    tareaAEliminarId = id;
    document.getElementById('modalTareaTitulo').textContent = `"${titulo}"`;
    document.getElementById('modalEliminar').classList.add('active');
}

function cerrarModal() {
    tareaAEliminarId = null;
    document.getElementById('modalEliminar').classList.remove('active');
}

function confirmarEliminar() {
    if (!tareaAEliminarId) return;

    fetch(`${API_URL}${tareaAEliminarId}/`, {
        method: 'DELETE'
    })
    .then(() => {
        cerrarModal();
        obtenerTareas();
    });
}

// Cuando carga la página, pedimos las tareas
obtenerTareas();
