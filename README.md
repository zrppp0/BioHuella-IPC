# BioHuella - Plataforma Ambiental de Manizales 🌿

## Descripción del Proyecto

BioHuella es una plataforma web integral dedicada a la conservación ambiental, sostenibilidad y biodiversidad de Manizales, Colombia. El proyecto combina información educativa, monitoreo climático en tiempo real, y herramientas administrativas para gestionar contenido ambiental.

## 🚀 Instalación y Configuración

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, puede ejecutarse desde archivos)
- Conexión a internet para la API del clima y fuentes externas

### Configuración Rápida
1. **Descargar el proyecto**: Clonar o descargar todos los archivos
2. **Abrir index.html**: Doble clic en el archivo o servir desde un servidor local
3. **Configurar API del Clima** (opcional):
   - Registrarse en [OpenWeatherMap](https://openweathermap.org/api)
   - Reemplazar la API key en `js/main.js` línea 4
4. **¡Listo para usar!**: Navegar por las diferentes categorías ambientales

### Instalación con Servidor Local
```bash
# Con Python
python -m http.server 8000

# Con Node.js (npx)
npx serve .

# Con PHP
php -S localhost:8000
```

Luego abrir: `http://localhost:8000`

## 🆕 Nuevas Funcionalidades - Estructura de Páginas Separadas

### ✅ Navegación Mejorada por Categorías
- **Páginas Separadas**: Cada categoría ambiental ahora tiene su propia página dedicada
- **Navegación Intuitiva**: Menú principal que dirige a páginas específicas
- **Indicador de Página Activa**: Resaltado visual de la página actual
- **Botones de Acción**: Enlaces directos desde la página principal a contenido detallado

### 🌍 Categorías Ambientales Implementadas

#### Categorías Principales:
1. **🌿 Conservación Ambiental** (`conservacion.html`)
   - Áreas protegidas (Nevado del Ruiz, Reservas Forestales)
   - Programas de reforestación y restauración ecológica
   - Conservación de fauna y recursos hídricos

2. **♾️ Sostenibilidad** (`sostenibilidad.html`)
   - Agricultura sostenible y café orgánico
   - Economía circular y gestión de residuos
   - Energías renovables y almacenamiento

3. **🌺 Biodiversidad** (`biodiversidad.html`)
   - Fauna silvestre (mariposas, aves, anfibios)
   - Flora nativa y jardín botánico
   - Investigación y monitoreo científico

4. **🌱 Iniciativas Ambientales** (`iniciativas.html`)
   - Movilidad sostenible y transporte verde
   - Educación comunitaria y brigadas ambientales
   - Compromisos ciudadanos y certificaciones

#### Nuevas Categorías Agregadas:
5. **📚 Educación Ambiental** (`educacion-ambiental.html`)
   - Programas educativos curriculares
   - Educación comunitaria y familiar
   - Recursos digitales y plataformas de aprendizaje

6. **🔬 Tecnología Verde** (`tecnologia-verde.html`)
   - Monitoreo inteligente con sensores IoT
   - Sistemas de energías limpias
   - Gestión hídrica inteligente

7. **🌡️ Acción Climática** (`cambio-climatico.html`)
   - Monitoreo climático y análisis de tendencias
   - Adaptación climática y gestión de riesgos
   - Mitigación de emisiones y sumideros de carbono

8. **🌾 Agricultura Urbana** (`agricultura-urbana.html`)
   - Huertos comunitarios, escolares y corporativos
   - Técnicas innovadoras (hidroponía, agricultura vertical)
   - Mercados verdes y banco de semillas

### ✅ Funcionalidades Administrativas Existentes
- **Modificación del Clima**: Control manual de parámetros climáticos
- **Gestión de Usuarios**: Sistema de roles y permisos
- **Gestión de Contenido**: Administración de iniciativas y eventos
- **Inventario de Jardín**: Control de semillas y herramientas

## Cómo Usar

### 1. Acceso al Panel de Administración
1. Hacer clic en "🔑 Admin" en la navegación principal
2. Usar una de las credenciales predefinidas:
   - **Usuario**: admin | **Contraseña**: admin123 (Administrador)
   - **Usuario**: editor | **Contraseña**: editor123 (Editor)
   - **Usuario**: viewer | **Contraseña**: viewer123 (Visualizador)

### 2. Modificar el Clima
1. En el dashboard, completar el formulario "Modificación del Clima"
2. Establecer temperatura (-10°C a 40°C)
3. Seleccionar estado climático del dropdown
4. Establecer humedad (0% a 100%)
5. Establecer velocidad del viento (0 a 200 km/h)
6. Hacer clic en "Actualizar Clima"

### 3. Gestionar Usuarios (Solo Administradores)
- **Crear usuarios**: Completar el formulario de usuario y hacer clic en "Crear Usuario"
- **Editar usuarios**: Hacer clic en "Editar" en la tabla de usuarios
- **Eliminar usuarios**: Hacer clic en "Eliminar" (con confirmación)
- **Activar/Desactivar**: Cambiar el estado de los usuarios

### 4. Restaurar Clima Real
- Hacer clic en "Restaurar Clima Real" para volver a los datos de la API

### 🌐 Navegación por Categorías
Cada categoría ahora funciona como una página independiente con contenido detallado:

- **Página Principal** (`index.html`): Resumen general con widget climático y enlaces a categorías
- **Páginas de Categorías**: Contenido especializado y detallado de cada tema ambiental
- **Navegación Unificada**: Menú consistente en todas las páginas
- **Transiciones Suaves**: Efectos visuales para mejorar la experiencia del usuario

## Estructura de Archivos

```
proyectov2/
├── index.html                    # Página principal con resumen y clima
├── admin.html                    # Página de login del administrador
├── dashboard.html                # Panel de administración completo
│
├── Páginas de Categorías:
├── conservacion.html             # Conservación ambiental y áreas protegidas
├── sostenibilidad.html           # Sostenibilidad y economía circular
├── biodiversidad.html            # Biodiversidad local y ecosistemas
├── iniciativas.html              # Iniciativas y proyectos comunitarios
├── educacion-ambiental.html      # Educación y formación ambiental
├── tecnologia-verde.html         # Tecnologías ambientales innovadoras
├── cambio-climatico.html         # Acción climática y adaptación
├── agricultura-urbana.html       # Agricultura urbana y seguridad alimentaria
│
├── css/
│   └── style.css                # Estilos globales (con nuevos estilos para navegación)
├── js/
│   ├── main.js                  # JavaScript principal (navegación mejorada)
│   └── dashboard.js             # JavaScript del panel administrativo
└── README.md                    # Documentación del proyecto
```

## 🛠️ Cómo Navegar por las Categorías

### Desde la Página Principal:
1. **Menú Superior**: Hacer clic en cualquier categoría del menú para ir directamente a esa página
2. **Botones de Exploración**: Usar los botones "Explorar [Categoría] →" al final de cada sección
3. **Widget del Clima**: Permanece funcional en la página principal

### Navegación entre Páginas:
- **Navegación Consistente**: Todas las páginas comparten el mismo menú de navegación
- **Página Activa**: La categoría actual se resalta visualmente en el menú
- **Regreso al Inicio**: Hacer clic en "BioHuella" o "🏠 Inicio" para volver a la página principal

## 🎆 Contenido Destacado por Categoría

### 🌿 Conservación Ambiental
- **Áreas Protegidas**: Nevado del Ruiz (38,664 hectáreas), Reserva Forestal Central
- **Programas Activos**: 5,000 árboles plantados, 200 hectáreas restauradas
- **Conservación Hídrica**: 127 nacimientos protegidos, 45 km de riberas restauradas

### ⚙️ Sostenibilidad 
- **Agricultura Sostenible**: 1,200 productores de café certificados, 400 hectáreas orgánicas
- **Economía Circular**: 80% de reciclaje, 25 empresas con industria verde
- **Energías Renovables**: Paneles solares, micro-eólica, sistemas de almacenamiento

### 🌺 Biodiversidad
- **Fauna**: 300+ especies de mariposas, 185 especies de aves, 35 especies de anfibios
- **Flora**: 800+ especies conservadas, 120 tipos de orquídeas nativas
- **Investigación**: Censo de biodiversidad, bioacústica, estudios genéticos

### 🌱 Iniciativas Comunitarias
- **Movilidad**: 2,500 usuarios de bicicletas, 35 buses eléctricos, 25 km de senderos
- **Educación**: 45 colegios verdes, 120 huertos urbanos, 800 voluntarios
- **Compromiso Ciudadano**: Pacto Verde, Manizales Carbono Neutral 2030

### 📚 Educación Ambiental
- **Programas Educativos**: 85 colegios con cátedra ambiental, 15 laboratorios verdes
- **Educación Comunitaria**: 1,200 familias en talleres, 95 empresas responsables
- **Recursos Digitales**: Plataforma EcoAprender, App EcoRetos, juegos ecológicos

### 🔬 Tecnología Verde
- **Monitoreo Inteligente**: 150 sensores IoT, imágenes satelitales, 5 modelos de IA
- **Energías Limpias**: 2.5 MW fotovoltaicos, 8 turbinas hidrocinéticas
- **Gestión Hídrica**: Riego inteligente, tratamiento avanzado, captación de lluvia

### 🌡️ Acción Climática
- **Monitoreo**: 12 estaciones meteorológicas, 30 años de datos climáticos
- **Adaptación**: 25 obras de bioingeniería, 18 km de corredores climáticos
- **Mitigación**: Sumideros de carbono, transporte limpio, industria neutra

### 🌾 Agricultura Urbana
- **Huertos**: 65 huertos barriales, 40 colegios, 18 empresas participantes
- **Innovación**: 12 sistemas hidropónicos, 8 torres verticales, 6 sistemas de aquaponía
- **Mercados**: Mercados verdes, banco de semillas, escuela de agricultura

## Características Técnicas

### 💻 Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Estilos**: CSS Grid, Flexbox, Gradientes, Animations
- **API Externa**: OpenWeatherMap para datos climáticos reales
- **Almacenamiento**: LocalStorage para persistencia de datos
- **Responsive Design**: Compatible con todos los dispositivos

### 🌐 Características de Navegación
- **Navegación Mixta**: Smooth scroll interno + redirección a páginas externas
- **Indicadores Visuales**: Resaltado de página activa y efectos hover
- **Accesibilidad**: Navegación clara y semántica
- **SEO Optimizado**: URLs descriptivas para cada categoría

### 🔒 Seguridad y Roles
- **Autenticación**: Sistema de login con roles diferenciados
- **Control de Acceso**: Funcionalidades restringidas según el rol del usuario
- **Validación**: Validación de formularios del lado del cliente
- **Persistencia Segura**: Datos almacenados localmente con estructura definida

## Notas Importantes

### 📝 Consideraciones Técnicas
1. **Almacenamiento Local**: Los datos se guardan en localStorage del navegador
2. **Compatibilidad**: Funciona en todos los navegadores modernos
3. **API del Clima**: Utiliza OpenWeatherMap para datos meteorológicos reales
4. **Estructura Modular**: Cada página es independiente pero comparte estilos globales

### 🚀 Para Producción
1. **Base de Datos**: Migrar de localStorage a base de datos real (MongoDB, PostgreSQL)
2. **Autenticación Segura**: Implementar JWT y autenticación del lado del servidor
3. **API Backend**: Crear API REST para gestión de contenido
4. **CDN**: Optimizar carga de imágenes y recursos estáticos

## Mejoras Futuras Sugeridas

### 🌱 Funcionalidades Adicionales
- **Sistema de Comentarios**: Permitir retroalimentación ciudadana en cada categoría
- **Mapa Interactivo**: Visualización geográfica de proyectos e iniciativas
- **Calendario de Eventos**: Sistema integrado de eventos ambientales
- **Newsletter**: Suscripción a noticias ambientales
- **Métricas en Tiempo Real**: Dashboard público con indicadores ambientales

### 📊 Analytics y Monitoreo
- **Google Analytics**: Seguimiento de visitas y comportamiento del usuario
- **Heatmaps**: Análisis de interacción con el contenido
- **Performance Monitoring**: Optimización de velocidad de carga
- **A/B Testing**: Pruebas de usabilidad y conversión

### 🌍 Integraciones Externas
- **Redes Sociales**: Compartir contenido en plataformas sociales
- **APIs Gubernamentales**: Integración con datos oficiales ambientales
- **Sistemas de Pago**: Para donaciones y membresías
- **Notificaciones Push**: Alertas sobre eventos y noticias importantes

## 📝 Credenciales de Acceso

### Usuarios Predefinidos
| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| `admin` | `admin123` | 🔑 Administrador | Acceso completo: clima, usuarios, contenido, inventario |
| `editor` | `editor123` | ✏️ Editor | Modificación del clima y gestión de contenido |
| `viewer` | `viewer123` | 👁️ Visualizador | Solo visualización del dashboard |

## 📱 Compatibilidad y Responsive Design

### Dispositivos Soportados
- **💻 Desktop**: Optimizado para pantallas grandes (1200px+)
- **📱 Tablet**: Adaptado para pantallas medianas (768px - 1199px)
- **📱 Móvil**: Completamente funcional en dispositivos pequeños (<768px)

### Navegadores Compatibles
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Opera 70+

## 🌿 Impacto Ambiental del Proyecto

### Objetivos de Sostenibilidad
- **Educación**: Informar a la comunidad sobre prácticas ambientales sostenibles
- **Participación**: Fomentar la participación ciudadana en iniciativas verdes
- **Transparencia**: Proporcionar datos ambientales accesibles y actualizados
- **Acción**: Facilitar la participación en proyectos de conservación

### Metas Ambientales
- 🌳 **Reforestación**: Meta de 10,000 árboles para 2025
- 📚 **Educación**: Llegar a 50,000 estudiantes con educación ambiental
- 🔋 **Carbono Neutral**: Contribuir a la meta de Manizales Carbono Neutral 2030
- 🌾 **Agricultura Urbana**: 200 huertos comunitarios activos para 2026

## 🤝 Contribución y Desarrollo

### Cómo Contribuir
1. **Fork del Proyecto**: Crear una copia del repositorio
2. **Crear Branch**: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar**: Implementar mejoras o corrección de bugs
4. **Testing**: Probar en múltiples dispositivos y navegadores
5. **Pull Request**: Enviar cambios para revisión

### Áreas de Contribución
- 🎨 **Diseño UI/UX**: Mejoras en la interfaz y experiencia del usuario
- 📝 **Contenido**: Actualización de información ambiental y proyectos
- 🔧 **Funcionalidades**: Nuevas características y herramientas
- 🐞 **Testing**: Reporte de bugs y pruebas de calidad
- 🌍 **Traducción**: Soporte para múltiples idiomas

## 📄 Licencia y Reconocimientos

### Licencia
Este proyecto está bajo Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

### Reconocimientos
- **OpenWeatherMap**: API gratuita para datos meteorológicos
- **Unsplash**: Imágenes de alta calidad para fondos ambientales
- **Google Fonts**: Tipografía Montserrat para una mejor legibilidad
- **Comunidad de Manizales**: Inspiración y datos reales de proyectos ambientales

### Contacto y Soporte
- 📧 **Email**: info@biohuella-manizales.com
- 🌍 **Web**: www.biohuella-manizales.com
- 📱 **Redes Sociales**: @BioHuellaManizales

---

**🌱 "La Tierra no es una herencia de nuestros padres, sino un préstamo de nuestros hijos" - BioHuella Manizales**
