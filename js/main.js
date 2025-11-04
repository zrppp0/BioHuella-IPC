document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración del Clima ---
    // IMPORTANTE: Reemplaza 'TU_API_KEY' con tu propia clave de OpenWeatherMap.
    const apiKeys = [
        'c9573a063a6260d7b688d02aea1dc299',
        '7e4dadcd3ac9a9d324ccadb14da5b327'
    ];
    let currentKeyIndex = 0;
    const apiKey = apiKeys[currentKeyIndex];
    const city = 'Pereira';
    const countryCode = 'CO';
    const lang = 'es';
    const units = 'metric'; // Para grados Celsius

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}&lang=${lang}&units=${units}`;

    // --- Elementos del DOM ---
    const temperaturaEl = document.getElementById('temperatura');
    const estadoCieloEl = document.getElementById('estado-cielo');

    // --- Función para obtener el clima ---
    async function getClima() {
        // Verificar si hay datos personalizados del admin
        const customWeatherDisplay = localStorage.getItem('currentWeatherDisplay');
        if (customWeatherDisplay) {
            const weatherData = JSON.parse(customWeatherDisplay);
            temperaturaEl.textContent = weatherData.temperatura;
            estadoCieloEl.textContent = weatherData.estado;
            return;
        }
        
        // Mostrar indicador de carga
        temperaturaEl.textContent = 'Cargando...';
        estadoCieloEl.textContent = 'Obteniendo datos del clima...';
        
        console.log('🌤️ Obteniendo datos del clima de Manizales...');

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Error en la API: ${response.statusText}`);
            }
            const data = await response.json();
            
            // Actualizar el DOM con los datos del clima
            temperaturaEl.textContent = `${Math.round(data.main.temp)}°C`;
            estadoCieloEl.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);

        } catch (error) {
            console.error("No se pudo obtener el clima:", error);
            temperaturaEl.textContent = '20°C'; // Temperatura de ejemplo para Manizales
            estadoCieloEl.textContent = 'Datos no disponibles';
        }
    }

    // --- Event listeners para actualizaciones desde el panel admin ---
    window.addEventListener('weatherUpdate', (event) => {
        const weatherData = event.detail;
        temperaturaEl.textContent = `${Math.round(weatherData.temperatura)}°C`;
        estadoCieloEl.textContent = weatherData.estado.charAt(0).toUpperCase() + weatherData.estado.slice(1);
    });

    window.addEventListener('weatherReset', () => {
        getClima(); // Volver a cargar datos de la API
    });

    // --- Llamada inicial ---
    getClima();
    
    // --- Cargar contenido dinámico ---
    loadDynamicContent();

    // --- Smooth Scroll para la navegación interna ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // --- Navegación mejorada para páginas externas ---
    document.querySelectorAll('nav a:not([href^="#"]):not(.admin-link)').forEach(link => {
        link.addEventListener('click', function(e) {
            // Agregar efecto de transición suave
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // --- Initialize Plant AI Chat ---
    if (document.getElementById('chatMessages')) {
        new PlantAIChat();
    }
});

// ========== CARGA DE CONTENIDO DINÁMICO ==========
function loadDynamicContent() {
    loadInitiativesFromAdmin();
    loadEventsFromAdmin();
}

function loadInitiativesFromAdmin() {
    const initiatives = JSON.parse(localStorage.getItem('siteInitiatives') || '[]');
    const initiativesContainer = document.querySelector('#iniciativas');
    
    if (!initiativesContainer) return;
    
    // Filtrar solo iniciativas activas
    const activeInitiatives = initiatives.filter(i => i.status === 'activa');
    
    if (activeInitiatives.length === 0) {
        // Mantener el contenido por defecto si no hay iniciativas del admin
        return;
    }
    
    // Reemplazar el contenido de iniciativas con el contenido del admin
    const newsItems = initiativesContainer.querySelectorAll('.news-item');
    newsItems.forEach(item => item.remove());
    
    activeInitiatives.forEach(initiative => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <p><strong>${initiative.icon} ${initiative.title}:</strong> ${initiative.description}</p>
        `;
        initiativesContainer.appendChild(newsItem);
    });
}

function loadEventsFromAdmin() {
    const events = JSON.parse(localStorage.getItem('siteEvents') || '[]');
    
    // Filtrar eventos próximos (en los próximos 30 días)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= thirtyDaysFromNow;
    });
    
    if (upcomingEvents.length === 0) return;
    
    // Crear una nueva sección de eventos próximos si no existe
    let eventsSection = document.getElementById('eventos-proximos');
    if (!eventsSection) {
        eventsSection = document.createElement('section');
        eventsSection.id = 'eventos-proximos';
        eventsSection.innerHTML = `
            <h2>🗓️ Eventos Próximos</h2>
            <div class="events-container"></div>
        `;
        
        // Insertar antes de la sección de iniciativas
        const iniciativasSection = document.getElementById('iniciativas');
        iniciativasSection.parentNode.insertBefore(eventsSection, iniciativasSection);
    }
    
    const eventsContainer = eventsSection.querySelector('.events-container');
    eventsContainer.innerHTML = '';
    
    upcomingEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'news-item';
        eventItem.innerHTML = `
            <p><strong>${getEventTypeIcon(event.type)} ${event.title}:</strong> ${event.description}</p>
            <div class="event-meta" style="margin-top: 1rem; font-size: 0.9rem; color: var(--sky-blue);">
                <span>📅 ${new Date(event.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</span>
                <br>
                <span>📍 ${event.location}</span>
            </div>
        `;
        eventsContainer.appendChild(eventItem);
    });
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

// Escuchar cambios en localStorage para actualizar el contenido dinámicamente
window.addEventListener('storage', (e) => {
    if (e.key === 'siteInitiatives' || e.key === 'siteEvents') {
        loadDynamicContent();
    }
});

// También actualizar cuando se modifica desde el mismo origen
setInterval(() => {
    loadDynamicContent();
}, 5000); // Actualizar cada 5 segundos

// ========== AI CHAT FUNCTIONALITY ==========
class PlantAIChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        // Free AI endpoints - no API key required
        this.aiEndpoints = [
            'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
            'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill'
        ];
        
        this.currentEndpoint = 0;
        this.conversationHistory = [];
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        if (!this.sendButton || !this.chatInput) return;
        
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.chatInput.addEventListener('input', () => {
            this.sendButton.disabled = !this.chatInput.value.trim();
        });
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addMessage(message, 'user', '👤');
        this.chatInput.value = '';
        this.sendButton.disabled = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai', '🌱');
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            this.addErrorMessage();
        }
        
        this.sendButton.disabled = false;
    }
    
    async getAIResponse(userMessage) {
        // Create plant-focused context
        const plantContext = this.createPlantContext(userMessage);
        
        // Try local plant knowledge first
        const localResponse = this.getLocalPlantResponse(userMessage);
        if (localResponse) {
            return localResponse;
        }
        
        // Try AI endpoints
        for (let i = 0; i < this.aiEndpoints.length; i++) {
            try {
                const response = await this.queryAI(plantContext);
                if (response) {
                    return this.formatPlantResponse(response);
                }
            } catch (error) {
                console.log(`Endpoint ${i + 1} failed, trying next...`);
                this.currentEndpoint = (this.currentEndpoint + 1) % this.aiEndpoints.length;
            }
        }
        
        // Fallback response
        return this.getFallbackResponse(userMessage);
    }
    
    createPlantContext(userMessage) {
        return `Como asistente de IA especializado y conocedor, responde esta pregunta de manera útil y precisa: ${userMessage}. 
Incluye información relevante y consejos prácticos cuando sea apropiado. Mantén un tono amigable y educativo.`;
    }
    
    getLocalPlantResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Common plant questions with local responses
        const responses = {
            'riego': 'Para el riego óptimo: ✅ Riega por la mañana temprano ✅ Verifica la humedad del suelo con el dedo ✅ La mayoría de plantas necesitan agua cuando los primeros 2-3 cm de tierra están secos ✅ Es mejor regar profundo y menos frecuente que poco y a menudo. En Manizales, con el clima húmedo, generalmente necesitas regar menos que en climas secos.',
            
            'semillas': '🌱 Para germinar semillas exitosamente: ✅ Usa tierra de buena calidad y bien drenada ✅ Mantén humedad constante pero no encharcada ✅ La mayoría germinan entre 18-24°C ✅ Proporciona luz indirecta inicialmente ✅ Trasplanta cuando tengan 2-4 hojas verdaderas. En Manizales, puedes aprovechar la humedad natural del ambiente.',
            
            'plagas': '🐛 Control natural de plagas: ✅ Jabón potásico diluido para pulgones ✅ Tierra de diatomeas para insectos rastreros ✅ Plantas compañeras (albahaca, caléndula) ✅ Inspecciona regularmente ✅ Mantén plantas sanas con buen drenaje y ventilación. En climas húmedos como Manizales, la ventilación es crucial.',
            
            'abono': '🌿 Fertilización natural: ✅ Compost casero (restos de cocina + hojas secas) ✅ Humus de lombriz ✅ Abonos líquidos (té de banana, agua de arroz) ✅ Fertiliza en primavera/verano ✅ Menos es más - es mejor subalimentar que sobrealimentar.',
            
            'sol': '☀️ Requisitos de luz: ✅ Sol pleno: 6+ horas directas (tomates, pimientos) ✅ Sol parcial: 4-6 horas (lechugas, espinacas) ✅ Sombra: 2-4 horas (helechos, begonias) ✅ Observa cómo se mueve el sol en tu espacio ✅ En Manizales, aprovecha las ventanas orientadas al sur.',
            
            'trasplante': '🌱 Trasplante exitoso: ✅ Hazlo en tarde/noche para reducir estrés ✅ Riega bien antes y después ✅ No disturbes mucho las raíces ✅ Usa maceta solo 2-5 cm más grande ✅ Mantén en sombra parcial los primeros días. El clima de Manizales es ideal para trasplantes.',
        };
        
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        
        // Check for common plants
        if (lowerMessage.includes('tomate')) {
            return '🍅 Cultivo de tomates: ✅ Necesitan sol pleno (6+ horas) ✅ Suelo bien drenado con pH 6.0-6.8 ✅ Riego regular pero evita mojar las hojas ✅ Tutores para soporte ✅ Poda de brotes laterales ✅ En Manizales siembra en invernadero o área protegida.';
        }
        
        if (lowerMessage.includes('rosa')) {
            return '🌹 Cuidado de rosas: ✅ Sol matutino abundante ✅ Suelo rico en materia orgánica ✅ Riego en la base, no en hojas ✅ Poda en invierno ✅ Ventilación para prevenir hongos ✅ En Manizales, elige variedades resistentes a la humedad.';
        }
        
        if (lowerMessage.includes('orquídea')) {
            return '🌺 Cuidado de orquídeas: ✅ Luz brillante indirecta ✅ Sustrato especial (corteza, musgo) ✅ Riego semanal por inmersión ✅ Humedad alta (50-70%) ✅ Ventilación importante ✅ El clima de Manizales es perfecto para muchas variedades de orquídeas.';
        }
        
        // General knowledge responses
        if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            return '😊 ¡Hola! ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre plantas, ciencias, tecnología, medio ambiente, y muchos otros temas. ¡Pregunta lo que necesites!';
        }
        
        if (lowerMessage.includes('qué es la fotosintesis') || lowerMessage.includes('fotosintesis')) {
            return '🌱 La fotosintesis es el proceso por el cual las plantas convierten la luz solar en energía. Durante este proceso: ✅ Las plantas absorben CO₂ del aire ✅ Toman agua del suelo ✅ Usan clorofila para capturar luz solar ✅ Producen glucosa (azúcar) y oxigeno ✅ ¡Es fundamental para la vida en la Tierra!';
        }
        
        if (lowerMessage.includes('cambio climático') || lowerMessage.includes('calentamiento global')) {
            return '🌍 El cambio climático es el aumento de la temperatura global debido a actividades humanas: ✅ Emisiones de gases de efecto invernadero ✅ Deforestación ✅ Uso de combustibles fósiles. Para ayudar: 🌱 Planta árboles 🚲 Usa transporte sostenible ♾️ Recicla y reutiliza ☀️ Usa energías renovables';
        }
        
        if (lowerMessage.includes('qué es la inteligencia artificial') || lowerMessage.includes('que es ia')) {
            return '🤖 La Inteligencia Artificial (IA) es la capacidad de las máquinas para realizar tareas que normalmente requieren inteligencia humana: ✅ Aprendizaje automático ✅ Procesamiento de lenguaje natural ✅ Reconocimiento de patrones ✅ Toma de decisiones. ¡Como yo, que te estoy ayudando ahora!';
        }
        
        if (lowerMessage.includes('python') && (lowerMessage.includes('programar') || lowerMessage.includes('código'))) {
            return '🐍 Python es un lenguaje de programación fácil de aprender: ✅ Sintaxis simple y clara ✅ Gran comunidad ✅ Muchas librerías ✅ Útil para IA, web, ciencia de datos. Ejemplo básico: print("Hola mundo!"). ¡Perfecto para principiantes!';
        }
        
        if (lowerMessage.includes('energía renovable') || lowerMessage.includes('energías limpias')) {
            return '☀️ Las energías renovables son inagotables y limpias: ✅ Solar: paneles fotovoltaicos ✅ Eólica: turbinas de viento ✅ Hidráulica: fuerza del agua ✅ Geotérmica: calor terrestre ✅ Biomasa: materia orgánica. Colombia tiene gran potencial en todas estas áreas!';
        }
        
        if (lowerMessage.includes('qué puedes hacer') || lowerMessage.includes('que sabes')) {
            return '🤔 Puedo ayudarte con muchos temas: 🌱 Jardinería y plantas 🔬 Ciencias y tecnología 🌍 Medio ambiente 📚 Educación 💻 Programación básica 🗺️ Información general 🎨 Arte y cultura ⚙️ Consejos prácticos. ¡Pregunta cualquier cosa!';
        }
        
        return null;
    }
    
    async queryAI(prompt) {
        // Try multiple free AI endpoints
        const endpoints = [
            {
                url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
                type: 'huggingface'
            },
            {
                url: 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
                type: 'huggingface'
            },
            {
                url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small',
                type: 'huggingface'
            }
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await this.queryHuggingFace(endpoint.url, prompt);
                if (response && response.length > 10) {
                    return response;
                }
            } catch (error) {
                console.log(`Failed to query ${endpoint.url}:`, error);
                continue;
            }
        }
        
        // Try alternative free API
        try {
            return await this.queryAlternativeAPI(prompt);
        } catch (error) {
            console.log('All AI endpoints failed:', error);
            return null;
        }
    }
    
    async queryHuggingFace(url, prompt) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 200,
                    temperature: 0.7,
                    do_sample: true,
                    return_full_text: false
                },
                options: {
                    wait_for_model: true
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            return data[0].generated_text || data[0].response || data[0].text || '';
        }
        
        if (data.generated_text || data.response || data.text) {
            return data.generated_text || data.response || data.text;
        }
        
        return null;
    }
    
    async queryAlternativeAPI(prompt) {
        // Use a completely free API service - AI21 Studio has free tier
        try {
            const response = await fetch('https://api.ai21.com/studio/v1/experimental/j1-jumbo/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    numResults: 1,
                    maxTokens: 150,
                    temperature: 0.7
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.completions && data.completions.length > 0) {
                    return data.completions[0].data.text;
                }
            }
        } catch (error) {
            console.log('Alternative API failed:', error);
        }
        
        // Final fallback - try a simple public API
        try {
            const response = await fetch('https://api.openai-proxy.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: prompt
                    }],
                    max_tokens: 150
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices.length > 0) {
                    return data.choices[0].message.content;
                }
            }
        } catch (error) {
            console.log('OpenAI proxy failed:', error);
        }
        
        return null;
    }
    
    formatPlantResponse(response) {
        // Clean and format AI response
        let formatted = response.replace(/^(AI|Assistant|Bot):/i, '').trim();
        
        // Add plant emoji if not present
        if (!formatted.includes('🌱') && !formatted.includes('🌿') && !formatted.includes('🌺')) {
            formatted = '🌱 ' + formatted;
        }
        
        return formatted;
    }
    
    getFallbackResponse(userMessage) {
        const fallbacks = [
            '🌱 ¡Excelente pregunta! Basándome en buenas prácticas de jardinería, te sugiero consultar con expertos locales o libros especializados para obtener información específica sobre tu consulta. Mientras tanto, recuerda que la mayoría de plantas prosperan con: suelo bien drenado, riego adecuado, luz apropiada y amor. 💚',
            
            '🌿 Es una consulta muy interesante sobre jardinería. Te recomiendo experimentar con cuidado y observar cómo responde tu planta. Algunos principios generales: mantén un buen drenaje, riega cuando la tierra esté ligeramente seca, y proporciona la luz que tu planta necesita. ¡La experiencia es la mejor maestra en jardinería! 🌺',
            
            '🌺 ¡Me encanta tu interés por las plantas! Aunque no tengo información específica sobre esa consulta en este momento, te sugiero: observar tu planta regularmente, investigar en recursos confiables de jardinería, y no dudes en preguntar en viveros locales. En Manizales tienen excelentes conocimientos sobre plantas que se adaptan a nuestro clima. 🌱',
            
            '🌱 Es una pregunta fascinante sobre el mundo de las plantas. Te animo a explorar recursos especializados y experimentar con cuidado. Recuerda que cada planta es única y puede responder diferente según las condiciones locales. ¡El clima de Manizales es maravilloso para muchas especies! 🌿'
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    addMessage(content, sender, avatar) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addErrorMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">🌱</div>
            <div class="message-content error-message">
                <p>Disculpa, estoy teniendo dificultades técnicas en este momento. Puedes intentar reformular tu pregunta o consultarme sobre:</p>
                <ul>
                    <li>🌱 Cuidado básico de plantas</li>
                    <li>💧 Técnicas de riego</li>
                    <li>🌿 Control natural de plagas</li>
                    <li>🌺 Cultivo de plantas específicas</li>
                </ul>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

