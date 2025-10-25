document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    checkAuthentication();
    
    // Inicializar la interfaz
    initializeDashboard();
    
    // Event listeners principales
    document.getElementById('weatherForm').addEventListener('submit', updateWeather);
    document.getElementById('userForm').addEventListener('submit', createUser);
    document.getElementById('initiativeForm').addEventListener('submit', saveInitiative);
    document.getElementById('eventForm').addEventListener('submit', saveEvent);
    document.getElementById('seedForm').addEventListener('submit', saveSeed);
    document.getElementById('toolForm').addEventListener('submit', saveTool);
    
    // Event listeners para preview del clima
    ['temperatura', 'estadoClimatico', 'humedad', 'velocidadViento'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateWeatherPreview);
    });
    
    // Cargar datos existentes
    loadUsers();
    loadInitiatives();
    loadEvents();
    loadSeeds();
    loadTools();
    updateInventoryStats();

    // Configurar tab por defecto
    switchTab('clima');
});

// Verificar si el usuario está autenticado
function checkAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'admin.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    document.getElementById('currentUserName').textContent = user.username;
    document.getElementById('userRole').textContent = user.role.toUpperCase();
    
    // Ocultar gestión de usuarios para roles que no sean administrador
    if (user.role !== 'administrador') {
        document.getElementById('userManagement').style.display = 'none';
        document.querySelector('.dashboard-container').style.gridTemplateColumns = '1fr';
    }
}

function initializeDashboard() {
    // Cargar datos del clima actual si existen
    const customWeather = localStorage.getItem('customWeather');
    if (customWeather) {
        const weather = JSON.parse(customWeather);
        document.getElementById('temperatura').value = weather.temperatura;
        document.getElementById('estadoClimatico').value = weather.estado;
        document.getElementById('humedad').value = weather.humedad;
        document.getElementById('velocidadViento').value = weather.viento;
        updateWeatherPreview();
    }
}

// Funciones de gestión del clima
function updateWeather(e) {
    e.preventDefault();
    
    const temperatura = document.getElementById('temperatura').value;
    const estado = document.getElementById('estadoClimatico').value;
    const humedad = document.getElementById('humedad').value;
    const viento = document.getElementById('velocidadViento').value;
    
    const weatherData = {
        temperatura: parseFloat(temperatura),
        estado: estado,
        humedad: parseInt(humedad),
        viento: parseFloat(viento),
        timestamp: new Date().toISOString(),
        isCustom: true
    };
    
    // Guardar en localStorage
    localStorage.setItem('customWeather', JSON.stringify(weatherData));
    
    // Actualizar el sitio principal
    updateMainSiteWeather(weatherData);
    
    // Mostrar mensaje de éxito
    showMessage('weatherSuccessMsg', 'Clima actualizado correctamente');
}

function resetWeatherToAPI() {
    // Eliminar datos personalizados
    localStorage.removeItem('customWeather');
    
    // Limpiar formulario
    document.getElementById('weatherForm').reset();
    updateWeatherPreview();
    
    // Restaurar funcionamiento normal de la API en el sitio principal
    restoreAPIWeather();
    
    showMessage('weatherSuccessMsg', 'Clima restaurado a datos reales de la API');
}

function updateWeatherPreview() {
    const temperatura = document.getElementById('temperatura').value || '--';
    const estado = document.getElementById('estadoClimatico').value || '--';
    const humedad = document.getElementById('humedad').value || '--';
    const viento = document.getElementById('velocidadViento').value || '--';
    
    document.getElementById('previewTemperatura').textContent = temperatura === '--' ? '--°C' : temperatura + '°C';
    document.getElementById('previewEstado').textContent = estado === '--' ? '--' : estado.charAt(0).toUpperCase() + estado.slice(1);
    document.getElementById('previewDetalles').textContent = `Humedad: ${humedad}% | Viento: ${viento} km/h`;
}

function updateMainSiteWeather(weatherData) {
    // Crear evento personalizado para comunicarse con el sitio principal
    const weatherEvent = new CustomEvent('weatherUpdate', { detail: weatherData });
    window.dispatchEvent(weatherEvent);
    
    // También guardamos en localStorage para persistencia entre páginas
    localStorage.setItem('currentWeatherDisplay', JSON.stringify({
        temperatura: `${Math.round(weatherData.temperatura)}°C`,
        estado: weatherData.estado.charAt(0).toUpperCase() + weatherData.estado.slice(1)
    }));
    
    // Guardar en el historial de cambios climáticos
    saveWeatherHistory(weatherData);
    
    // Enviar notificación de cambio climático
    sendWeatherChangeNotification(weatherData);
}

function restoreAPIWeather() {
    localStorage.removeItem('currentWeatherDisplay');
    const resetEvent = new CustomEvent('weatherReset');
    window.dispatchEvent(resetEvent);
}

// Funciones de gestión de usuarios
function createUser(e) {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    const status = document.getElementById('newStatus').value;
    
    // Obtener usuarios existentes
    let users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.username === username)) {
        showMessage('userErrorMsg', 'El usuario ya existe');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now().toString(),
        username: username,
        password: password,
        role: role,
        status: status,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('systemUsers', JSON.stringify(users));
    
    // Actualizar credenciales válidas para login
    updateValidCredentials();
    
    // Limpiar formulario
    clearUserForm();
    
    // Recargar tabla
    loadUsers();
    
    showMessage('userSuccessMsg', 'Usuario creado correctamente');
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    
    // Usuarios predefinidos si no hay usuarios guardados
    if (users.length === 0) {
        const defaultUsers = [
            { id: '1', username: 'admin', role: 'administrador', status: 'activo', createdAt: new Date().toISOString() },
            { id: '2', username: 'editor', role: 'editor', status: 'activo', createdAt: new Date().toISOString() },
            { id: '3', username: 'viewer', role: 'visualizador', status: 'activo', createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
        displayUsers(defaultUsers);
    } else {
        displayUsers(users);
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${getRoleIcon(user.role)} ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
            <td>
                <span class="status-indicator ${user.status === 'activo' ? 'status-active' : 'status-inactive'}"></span>
                ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </td>
            <td>
                <button class="btn btn-sm" onclick="editUser('${user.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Eliminar</button>
                <button class="btn btn-sm" onclick="toggleUserStatus('${user.id}')">${user.status === 'activo' ? 'Desactivar' : 'Activar'}</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getRoleIcon(role) {
    const icons = {
        'administrador': '🔑',
        'editor': '✏️',
        'visualizador': '👁️'
    };
    return icons[role] || '👤';
}

function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (user) {
        document.getElementById('newUsername').value = user.username;
        document.getElementById('newPassword').value = ''; // No mostrar contraseña por seguridad
        document.getElementById('newRole').value = user.role;
        document.getElementById('newStatus').value = user.status;
        
        // Cambiar el botón a "Actualizar"
        const submitBtn = document.querySelector('#userForm button[type="submit"]');
        submitBtn.textContent = 'Actualizar Usuario';
        submitBtn.onclick = (e) => updateUser(e, userId);
    }
}

function updateUser(e, userId) {
    e.preventDefault();
    
    let users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        const password = document.getElementById('newPassword').value;
        users[userIndex] = {
            ...users[userIndex],
            username: document.getElementById('newUsername').value,
            role: document.getElementById('newRole').value,
            status: document.getElementById('newStatus').value
        };
        
        // Solo actualizar contraseña si se proporciona una nueva
        if (password) {
            users[userIndex].password = password;
        }
        
        localStorage.setItem('systemUsers', JSON.stringify(users));
        updateValidCredentials();
        clearUserForm();
        loadUsers();
        showMessage('userSuccessMsg', 'Usuario actualizado correctamente');
    }
}

function deleteUser(userId) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        let users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('systemUsers', JSON.stringify(users));
        updateValidCredentials();
        loadUsers();
        showMessage('userSuccessMsg', 'Usuario eliminado correctamente');
    }
}

function toggleUserStatus(userId) {
    let users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (user) {
        user.status = user.status === 'activo' ? 'inactivo' : 'activo';
        localStorage.setItem('systemUsers', JSON.stringify(users));
        updateValidCredentials();
        loadUsers();
        showMessage('userSuccessMsg', `Usuario ${user.status === 'activo' ? 'activado' : 'desactivado'} correctamente`);
    }
}

function updateValidCredentials() {
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const activeUsers = users.filter(u => u.status === 'activo');
    const credentials = activeUsers.map(u => ({
        username: u.username,
        password: u.password,
        role: u.role
    }));
    localStorage.setItem('validCredentials', JSON.stringify(credentials));
}

function clearUserForm() {
    document.getElementById('userForm').reset();
    const submitBtn = document.querySelector('#userForm button[type="submit"]');
    submitBtn.textContent = 'Crear Usuario';
    submitBtn.onclick = null;
}

// Funciones de utilidad
function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    window.location.href = 'admin.html';
}

// ========== NAVEGACIÓN POR PESTAÑAS ==========
function switchTab(tabName) {
    // Ocultar todos los contenidos de pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desactivar todos los botones de pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar el contenido de la pestaña seleccionada
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Activar el botón de la pestaña seleccionada
    event.target.classList.add('active');
    
    // Ajustar el layout del dashboard según la pestaña
    const container = document.querySelector('.dashboard-container');
    if (tabName === 'clima') {
        container.style.gridTemplateColumns = '1fr';
        container.style.maxWidth = '800px';
    } else if (tabName === 'usuarios') {
        container.style.gridTemplateColumns = '1fr';
        container.style.maxWidth = '1200px';
    } else {
        container.style.gridTemplateColumns = '1fr';
        container.style.maxWidth = '1400px';
    }
}

// ========== GESTIÓN DE INICIATIVAS ==========
let currentInitiativeId = null;

function saveInitiative(e) {
    e.preventDefault();
    
    const formData = {
        id: currentInitiativeId || Date.now().toString(),
        icon: document.getElementById('initiativeIcon').value,
        title: document.getElementById('initiativeTitle').value,
        description: document.getElementById('initiativeDescription').value,
        status: document.getElementById('initiativeStatus').value,
        createdAt: currentInitiativeId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    let initiatives = JSON.parse(localStorage.getItem('siteInitiatives') || '[]');
    
    if (currentInitiativeId) {
        const index = initiatives.findIndex(i => i.id === currentInitiativeId);
        if (index !== -1) {
            initiatives[index] = { ...initiatives[index], ...formData };
        }
    } else {
        initiatives.push(formData);
    }
    
    localStorage.setItem('siteInitiatives', JSON.stringify(initiatives));
    
    clearInitiativeForm();
    loadInitiatives();
    
    showMessage('initiativeSuccessMsg', currentInitiativeId ? 'Iniciativa actualizada correctamente' : 'Iniciativa creada correctamente');
    currentInitiativeId = null;
}

function loadInitiatives() {
    const initiatives = JSON.parse(localStorage.getItem('siteInitiatives') || '[]');
    const container = document.getElementById('initiativesList');
    
    if (initiatives.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--sky-blue); padding: 2rem;">No hay iniciativas registradas</p>';
        return;
    }
    
    container.innerHTML = initiatives.map(initiative => `
        <div class="list-item">
            <div class="item-header">
                <h4 class="item-title">${initiative.icon} ${initiative.title}</h4>
                <div class="item-actions">
                    <button class="btn btn-sm" onclick="editInitiative('${initiative.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInitiative('${initiative.id}')">Eliminar</button>
                </div>
            </div>
            <div class="item-content">
                <p>${initiative.description}</p>
                <div class="item-meta">
                    <span class="status-badge status-${initiative.status}">${initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}</span>
                    <span class="meta-item">Creada: ${new Date(initiative.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function editInitiative(id) {
    const initiatives = JSON.parse(localStorage.getItem('siteInitiatives') || '[]');
    const initiative = initiatives.find(i => i.id === id);
    
    if (initiative) {
        document.getElementById('initiativeIcon').value = initiative.icon;
        document.getElementById('initiativeTitle').value = initiative.title;
        document.getElementById('initiativeDescription').value = initiative.description;
        document.getElementById('initiativeStatus').value = initiative.status;
        
        currentInitiativeId = id;
        document.querySelector('#initiativeForm button[type="submit"]').textContent = 'Actualizar Iniciativa';
    }
}

function deleteInitiative(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta iniciativa?')) {
        let initiatives = JSON.parse(localStorage.getItem('siteInitiatives') || '[]');
        initiatives = initiatives.filter(i => i.id !== id);
        localStorage.setItem('siteInitiatives', JSON.stringify(initiatives));
        loadInitiatives();
        showMessage('initiativeSuccessMsg', 'Iniciativa eliminada correctamente');
    }
}

function clearInitiativeForm() {
    document.getElementById('initiativeForm').reset();
    currentInitiativeId = null;
    document.querySelector('#initiativeForm button[type="submit"]').textContent = 'Guardar Iniciativa';
}

// ========== GESTIÓN DE EVENTOS ==========
let currentEventId = null;

function saveEvent(e) {
    e.preventDefault();
    
    const formData = {
        id: currentEventId || Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        description: document.getElementById('eventDescription').value,
        location: document.getElementById('eventLocation').value,
        type: document.getElementById('eventType').value,
        createdAt: currentEventId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    let events = JSON.parse(localStorage.getItem('siteEvents') || '[]');
    
    if (currentEventId) {
        const index = events.findIndex(e => e.id === currentEventId);
        if (index !== -1) {
            events[index] = { ...events[index], ...formData };
        }
    } else {
        events.push(formData);
    }
    
    localStorage.setItem('siteEvents', JSON.stringify(events));
    
    clearEventForm();
    loadEvents();
    
    showMessage('eventSuccessMsg', currentEventId ? 'Evento actualizado correctamente' : 'Evento creado correctamente');
    currentEventId = null;
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('siteEvents') || '[]');
    const container = document.getElementById('eventsList');
    
    if (events.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--sky-blue); padding: 2rem;">No hay eventos registrados</p>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="list-item">
            <div class="item-header">
                <h4 class="item-title">${getEventTypeIcon(event.type)} ${event.title}</h4>
                <div class="item-actions">
                    <button class="btn btn-sm" onclick="editEvent('${event.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEvent('${event.id}')">Eliminar</button>
                </div>
            </div>
            <div class="item-content">
                <p>${event.description}</p>
                <div class="item-meta">
                    <span class="meta-item">📅 ${new Date(event.date).toLocaleDateString()}</span>
                    <span class="meta-item">📍 ${event.location}</span>
                    <span class="meta-item">🏷️ ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getEventTypeIcon(type) {
    const icons = {
        'taller': '🔧',
        'conferencia': '🎤',
        'festival': '🎪',
        'limpieza': '🧹',
        'siembra': '🌱'
    };
    return icons[type] || '📅';
}

function editEvent(id) {
    const events = JSON.parse(localStorage.getItem('siteEvents') || '[]');
    const event = events.find(e => e.id === id);
    
    if (event) {
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventType').value = event.type;
        
        currentEventId = id;
        document.querySelector('#eventForm button[type="submit"]').textContent = 'Actualizar Evento';
    }
}

function deleteEvent(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        let events = JSON.parse(localStorage.getItem('siteEvents') || '[]');
        events = events.filter(e => e.id !== id);
        localStorage.setItem('siteEvents', JSON.stringify(events));
        loadEvents();
        showMessage('eventSuccessMsg', 'Evento eliminado correctamente');
    }
}

function clearEventForm() {
    document.getElementById('eventForm').reset();
    currentEventId = null;
    document.querySelector('#eventForm button[type="submit"]').textContent = 'Guardar Evento';
}

// ========== INVENTARIO DE SEMILLAS ==========
let currentSeedId = null;

function saveSeed(e) {
    e.preventDefault();
    
    const formData = {
        id: currentSeedId || Date.now().toString(),
        name: document.getElementById('seedName').value,
        type: document.getElementById('seedType').value,
        quantity: parseInt(document.getElementById('seedQuantity').value),
        unit: document.getElementById('seedUnit').value,
        season: document.getElementById('seedSeason').value,
        location: document.getElementById('seedLocation').value,
        notes: document.getElementById('seedNotes').value,
        createdAt: currentSeedId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    let seeds = JSON.parse(localStorage.getItem('gardenSeeds') || '[]');
    
    if (currentSeedId) {
        const index = seeds.findIndex(s => s.id === currentSeedId);
        if (index !== -1) {
            seeds[index] = { ...seeds[index], ...formData };
        }
    } else {
        seeds.push(formData);
    }
    
    localStorage.setItem('gardenSeeds', JSON.stringify(seeds));
    
    clearSeedForm();
    loadSeeds();
    updateInventoryStats();
    
    showMessage('seedSuccessMsg', currentSeedId ? 'Semilla actualizada correctamente' : 'Semilla agregada correctamente');
    currentSeedId = null;
}

function loadSeeds() {
    const seeds = JSON.parse(localStorage.getItem('gardenSeeds') || '[]');
    const container = document.getElementById('seedsList');
    
    if (seeds.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--sky-blue); padding: 2rem;">No hay semillas en inventario</p>';
        return;
    }
    
    container.innerHTML = seeds.map(seed => `
        <div class="list-item">
            <div class="item-header">
                <h4 class="item-title">${getSeedTypeIcon(seed.type)} ${seed.name}</h4>
                <div class="item-actions">
                    <button class="btn btn-sm" onclick="editSeed('${seed.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSeed('${seed.id}')">Eliminar</button>
                </div>
            </div>
            <div class="item-content">
                <p><strong>Cantidad:</strong> ${seed.quantity} ${seed.unit}</p>
                <p><strong>Temporada:</strong> ${seed.season.replace('_', ' ').charAt(0).toUpperCase() + seed.season.replace('_', ' ').slice(1)}</p>
                <p><strong>Ubicación:</strong> ${seed.location}</p>
                ${seed.notes ? `<p><strong>Notas:</strong> ${seed.notes}</p>` : ''}
                <div class="item-meta">
                    <span class="meta-item">${getSeedTypeIcon(seed.type)} ${seed.type.charAt(0).toUpperCase() + seed.type.slice(1)}</span>
                    <span class="meta-item ${seed.quantity < 10 ? 'status-badge status-pausada' : ''}">
                        📊 Stock: ${seed.quantity < 10 ? 'Bajo' : 'Normal'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function getSeedTypeIcon(type) {
    const icons = {
        'hortalizas': '🥕',
        'flores': '🌼',
        'hierbas': '🌿',
        'arboles': '🌳',
        'arbustos': '🌿',
        'medicinales': '🌱'
    };
    return icons[type] || '🌱';
}

function editSeed(id) {
    const seeds = JSON.parse(localStorage.getItem('gardenSeeds') || '[]');
    const seed = seeds.find(s => s.id === id);
    
    if (seed) {
        document.getElementById('seedName').value = seed.name;
        document.getElementById('seedType').value = seed.type;
        document.getElementById('seedQuantity').value = seed.quantity;
        document.getElementById('seedUnit').value = seed.unit;
        document.getElementById('seedSeason').value = seed.season;
        document.getElementById('seedLocation').value = seed.location;
        document.getElementById('seedNotes').value = seed.notes || '';
        
        currentSeedId = id;
        document.querySelector('#seedForm button[type="submit"]').textContent = 'Actualizar Semilla';
    }
}

function deleteSeed(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta semilla del inventario?')) {
        let seeds = JSON.parse(localStorage.getItem('gardenSeeds') || '[]');
        seeds = seeds.filter(s => s.id !== id);
        localStorage.setItem('gardenSeeds', JSON.stringify(seeds));
        loadSeeds();
        updateInventoryStats();
        showMessage('seedSuccessMsg', 'Semilla eliminada correctamente');
    }
}

function clearSeedForm() {
    document.getElementById('seedForm').reset();
    currentSeedId = null;
    document.querySelector('#seedForm button[type="submit"]').textContent = 'Guardar Semilla';
}

// ========== INVENTARIO DE HERRAMIENTAS ==========
let currentToolId = null;

function saveTool(e) {
    e.preventDefault();
    
    const formData = {
        id: currentToolId || Date.now().toString(),
        name: document.getElementById('toolName').value,
        category: document.getElementById('toolCategory').value,
        quantity: parseInt(document.getElementById('toolQuantity').value),
        condition: document.getElementById('toolCondition').value,
        location: document.getElementById('toolLocation').value,
        responsible: document.getElementById('toolResponsible').value,
        notes: document.getElementById('toolNotes').value,
        createdAt: currentToolId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    let tools = JSON.parse(localStorage.getItem('gardenTools') || '[]');
    
    if (currentToolId) {
        const index = tools.findIndex(t => t.id === currentToolId);
        if (index !== -1) {
            tools[index] = { ...tools[index], ...formData };
        }
    } else {
        tools.push(formData);
    }
    
    localStorage.setItem('gardenTools', JSON.stringify(tools));
    
    clearToolForm();
    loadTools();
    updateInventoryStats();
    
    showMessage('toolSuccessMsg', currentToolId ? 'Herramienta actualizada correctamente' : 'Herramienta agregada correctamente');
    currentToolId = null;
}

function loadTools() {
    const tools = JSON.parse(localStorage.getItem('gardenTools') || '[]');
    const container = document.getElementById('toolsList');
    
    if (tools.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--sky-blue); padding: 2rem;">No hay herramientas en inventario</p>';
        return;
    }
    
    container.innerHTML = tools.map(tool => `
        <div class="list-item">
            <div class="item-header">
                <h4 class="item-title">${getToolCategoryIcon(tool.category)} ${tool.name}</h4>
                <div class="item-actions">
                    <button class="btn btn-sm" onclick="editTool('${tool.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTool('${tool.id}')">Eliminar</button>
                </div>
            </div>
            <div class="item-content">
                <p><strong>Cantidad:</strong> ${tool.quantity}</p>
                <p><strong>Ubicación:</strong> ${tool.location}</p>
                ${tool.responsible ? `<p><strong>Responsable:</strong> ${tool.responsible}</p>` : ''}
                ${tool.notes ? `<p><strong>Notas:</strong> ${tool.notes}</p>` : ''}
                <div class="item-meta">
                    <span class="status-badge status-${tool.condition}">${getConditionText(tool.condition)}</span>
                    <span class="meta-item">${getToolCategoryIcon(tool.category)} ${tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getToolCategoryIcon(category) {
    const icons = {
        'mano': '✋',
        'corte': '✂️',
        'riego': '💧',
        'preparacion': '🔨',
        'medicion': '📏',
        'proteccion': '🛡️'
    };
    return icons[category] || '🔧';
}

function getConditionText(condition) {
    const texts = {
        'excelente': 'Excelente',
        'bueno': 'Bueno',
        'regular': 'Regular',
        'necesita_reparacion': 'Necesita Reparación',
        'fuera_de_servicio': 'Fuera de Servicio'
    };
    return texts[condition] || condition;
}

function editTool(id) {
    const tools = JSON.parse(localStorage.getItem('gardenTools') || '[]');
    const tool = tools.find(t => t.id === id);
    
    if (tool) {
        document.getElementById('toolName').value = tool.name;
        document.getElementById('toolCategory').value = tool.category;
        document.getElementById('toolQuantity').value = tool.quantity;
        document.getElementById('toolCondition').value = tool.condition;
        document.getElementById('toolLocation').value = tool.location;
        document.getElementById('toolResponsible').value = tool.responsible || '';
        document.getElementById('toolNotes').value = tool.notes || '';
        
        currentToolId = id;
        document.querySelector('#toolForm button[type="submit"]').textContent = 'Actualizar Herramienta';
    }
}

function deleteTool(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta herramienta del inventario?')) {
        let tools = JSON.parse(localStorage.getItem('gardenTools') || '[]');
        tools = tools.filter(t => t.id !== id);
        localStorage.setItem('gardenTools', JSON.stringify(tools));
        loadTools();
        updateInventoryStats();
        showMessage('toolSuccessMsg', 'Herramienta eliminada correctamente');
    }
}

function clearToolForm() {
    document.getElementById('toolForm').reset();
    currentToolId = null;
    document.querySelector('#toolForm button[type="submit"]').textContent = 'Guardar Herramienta';
}

// ========== ESTADÍSTICAS DE INVENTARIO ==========
function updateInventoryStats() {
    const seeds = JSON.parse(localStorage.getItem('gardenSeeds') || '[]');
    const tools = JSON.parse(localStorage.getItem('gardenTools') || '[]');
    
    // Estadísticas de semillas
    const totalSeeds = seeds.length;
    const lowStockSeeds = seeds.filter(s => s.quantity < 10).length;
    
    document.getElementById('totalSeeds').textContent = totalSeeds;
    document.getElementById('lowStockSeeds').textContent = lowStockSeeds;
    
    // Estadísticas de herramientas
    const totalTools = tools.reduce((sum, tool) => sum + tool.quantity, 0);
    const needRepairTools = tools.filter(t => t.condition === 'necesita_reparacion' || t.condition === 'fuera_de_servicio').length;
    
    document.getElementById('totalTools').textContent = totalTools;
    document.getElementById('needRepairTools').textContent = needRepairTools;
}

// ========== HISTORIAL DE CLIMA ==========
function saveWeatherHistory(weatherData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const historyEntry = {
        id: Date.now().toString(),
        ...weatherData,
        modifiedBy: currentUser ? currentUser.username : 'Sistema',
        modifiedAt: new Date().toISOString(),
        source: 'manual'
    };
    
    let weatherHistory = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
    weatherHistory.unshift(historyEntry); // Agregar al inicio
    
    // Mantener solo los últimos 100 registros
    if (weatherHistory.length > 100) {
        weatherHistory = weatherHistory.slice(0, 100);
    }
    
    localStorage.setItem('weatherHistory', JSON.stringify(weatherHistory));
    console.log('📊 Historial climático actualizado:', historyEntry);
}

function getWeatherHistory(limit = 20) {
    const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
    return history.slice(0, limit);
}

function exportWeatherHistory() {
    const history = getWeatherHistory(100);
    const csv = convertToCSV(history);
    downloadCSV(csv, 'historial-clima-manizales.csv');
}

function convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = ['Fecha', 'Temperatura (°C)', 'Estado', 'Humedad (%)', 'Viento (km/h)', 'Modificado por'];
    const rows = data.map(entry => [
        new Date(entry.modifiedAt).toLocaleString('es-ES'),
        entry.temperatura,
        entry.estado,
        entry.humedad,
        entry.viento,
        entry.modifiedBy
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
}

// ========== NOTIFICACIONES PUSH ==========
let notificationPermission = false;

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            notificationPermission = permission === 'granted';
            if (notificationPermission) {
                console.log('✅ Permisos de notificación concedidos');
            } else {
                console.log('❌ Permisos de notificación denegados');
            }
        });
    }
}

function sendWeatherChangeNotification(weatherData) {
    if (!notificationPermission && 'Notification' in window) {
        requestNotificationPermission();
    }
    
    if (notificationPermission) {
        const notification = new Notification('🌤️ Cambio Climático - Manizales', {
            body: `Nuevo clima: ${weatherData.estado} a ${Math.round(weatherData.temperatura)}°C`,
            icon: '/favicon.ico',
            tag: 'weather-update',
            requireInteraction: true,
            actions: [
                { action: 'view', title: 'Ver sitio', icon: '/icon-view.png' },
                { action: 'dismiss', title: 'Cerrar', icon: '/icon-close.png' }
            ]
        });
        
        notification.onclick = function() {
            window.open('/', '_blank');
            notification.close();
        };
        
        // Auto cerrar después de 5 segundos
        setTimeout(() => {
            notification.close();
        }, 5000);
        
        console.log('🔔 Notificación enviada:', weatherData);
    } else {
        console.log('❌ No se pueden enviar notificaciones - permisos denegados');
    }
}

function sendEventReminder(eventData) {
    if (notificationPermission) {
        const notification = new Notification('📅 Recordatorio de Evento', {
            body: `${eventData.title} - ${new Date(eventData.date).toLocaleDateString('es-ES')}`,
            icon: '/favicon.ico',
            tag: 'event-reminder'
        });
        
        notification.onclick = function() {
            window.open('/#iniciativas', '_blank');
            notification.close();
        };
    }
}

// ========== JWT-LIKE AUTHENTICATION ENHANCEMENT ==========
function generateToken(user) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        userId: user.id,
        username: user.username,
        role: user.role,
        exp: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
        iat: Date.now()
    };
    
    // Simulación de JWT (en producción usarías una librería real)
    const token = btoa(JSON.stringify(header)) + '.' + 
                  btoa(JSON.stringify(payload)) + '.' + 
                  btoa('signature-simulation');
    
    return token;
}

function validateToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const payload = JSON.parse(atob(parts[1]));
        
        if (payload.exp < Date.now()) {
            console.log('🔐 Token expirado');
            return null;
        }
        
        return payload;
    } catch (error) {
        console.error('❌ Error validando token:', error);
        return null;
    }
}

function enhancedLogin(username, password) {
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const user = users.find(u => u.username === username && u.password === password && u.status === 'activo');
    
    if (user) {
        const token = generateToken(user);
        const sessionData = {
            user: user,
            token: token,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', token);
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
        
        console.log('✅ Login exitoso con token:', token);
        return true;
    }
    
    return false;
}

// ========== REST API SIMULATION ==========
class ManizalesVerdeAPI {
    constructor() {
        this.baseURL = window.location.origin;
        this.version = 'v1';
    }
    
    // Weather endpoints
    async getWeather() {
        return this.get('weather/current');
    }
    
    async updateWeather(weatherData) {
        return this.post('weather/update', weatherData);
    }
    
    async getWeatherHistory(limit = 20) {
        return this.get(`weather/history?limit=${limit}`);
    }
    
    // Users endpoints
    async getUsers() {
        return this.get('users');
    }
    
    async createUser(userData) {
        return this.post('users', userData);
    }
    
    async updateUser(id, userData) {
        return this.put(`users/${id}`, userData);
    }
    
    async deleteUser(id) {
        return this.delete(`users/${id}`);
    }
    
    // Initiatives endpoints
    async getInitiatives() {
        return this.get('initiatives');
    }
    
    async createInitiative(data) {
        return this.post('initiatives', data);
    }
    
    // Events endpoints
    async getEvents() {
        return this.get('events');
    }
    
    async createEvent(data) {
        return this.post('events', data);
    }
    
    // Inventory endpoints
    async getInventory(type) {
        return this.get(`inventory/${type}`);
    }
    
    // Generic HTTP methods (localStorage simulation)
    async get(endpoint) {
        console.log(`📡 GET /api/${this.version}/${endpoint}`);
        
        const [resource] = endpoint.split('/');
        const storageKey = this.getStorageKey(resource);
        const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        return this.createResponse(data);
    }
    
    async post(endpoint, data) {
        console.log(`📡 POST /api/${this.version}/${endpoint}`, data);
        
        const [resource] = endpoint.split('/');
        const storageKey = this.getStorageKey(resource);
        let existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        data.id = data.id || Date.now().toString();
        data.createdAt = new Date().toISOString();
        
        existingData.push(data);
        localStorage.setItem(storageKey, JSON.stringify(existingData));
        
        return this.createResponse(data, 201);
    }
    
    async put(endpoint, data) {
        console.log(`📡 PUT /api/${this.version}/${endpoint}`, data);
        
        const [resource, id] = endpoint.split('/');
        const storageKey = this.getStorageKey(resource);
        let existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        const index = existingData.findIndex(item => item.id === id);
        if (index !== -1) {
            existingData[index] = { ...existingData[index], ...data, updatedAt: new Date().toISOString() };
            localStorage.setItem(storageKey, JSON.stringify(existingData));
            return this.createResponse(existingData[index]);
        }
        
        return this.createResponse({ error: 'Not found' }, 404);
    }
    
    async delete(endpoint) {
        console.log(`📡 DELETE /api/${this.version}/${endpoint}`);
        
        const [resource, id] = endpoint.split('/');
        const storageKey = this.getStorageKey(resource);
        let existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        const filteredData = existingData.filter(item => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(filteredData));
        
        return this.createResponse({ message: 'Deleted successfully' });
    }
    
    getStorageKey(resource) {
        const mapping = {
            'weather': 'weatherHistory',
            'users': 'systemUsers',
            'initiatives': 'siteInitiatives',
            'events': 'siteEvents',
            'inventory': 'gardenSeeds'
        };
        return mapping[resource] || resource;
    }
    
    createResponse(data, status = 200) {
        return {
            status,
            data,
            timestamp: new Date().toISOString(),
            ok: status < 400
        };
    }
}

// Instancia global de la API
const api = new ManizalesVerdeAPI();

// Inicializar características avanzadas cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Solicitar permisos de notificación
    requestNotificationPermission();
    
    // Verificar token de sesión
    const token = localStorage.getItem('authToken');
    if (token && !validateToken(token)) {
        console.log('🔐 Sesión expirada, redirigiendo al login');
        logout();
    }
    
    console.log('🌱 Manizales Verde - Sistema avanzado iniciado');
    console.log('📊 API simulada disponible en window.api');
});

// Exponer API globalmente para pruebas
window.api = api;
