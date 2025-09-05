# 🐾 Adoptme - Sistema de Adopción de Mascotas

[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-adoptme--app-blue)](https://hub.docker.com/r/erikbouvier/adoptme-app)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)](https://mongodb.com/)

## 📋 Descripción

Adoptme es una API REST desarrollada en Node.js y Express para gestionar un sistema de adopción de mascotas. La aplicación permite gestionar usuarios, mascotas y procesos de adopción con documentación completa en Swagger y tests funcionales.

## 🚀 Características

- ✅ API REST completa para gestión de usuarios, mascotas y adopciones
- ✅ Documentación interactiva con Swagger UI
- ✅ Tests funcionales completos (10/12 tests pasando)
- ✅ Containerización con Docker y Docker Compose
- ✅ Base de datos MongoDB
- ✅ Logging con Winston
- ✅ Mocking de datos para testing
- ✅ Imagen disponible en Docker Hub

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Base de datos:** MongoDB con Mongoose
- **Documentación:** Swagger (swagger-jsdoc, swagger-ui-express)
- **Testing:** Mocha, Chai, Supertest
- **Logging:** Winston
- **Containerización:** Docker, Docker Compose
- **Otros:** bcrypt, jsonwebtoken, multer, cookie-parser

## 🐳 Docker Hub

**Imagen en Docker Hub:** https://hub.docker.com/r/erikbouvier/adoptme-app

Para descargar y ejecutar la imagen desde Docker Hub:

```bash
# Descargar la imagen
docker pull erikbouvier/adoptme-app:latest

# Ejecutar con MongoDB local
docker run -p 8080:8080 -e MONGODB_URI=mongodb://host.docker.internal:27017/adoptme_test erikbouvier/adoptme-app:latest

# O usar docker-compose (recomendado)
docker-compose up
```

## 🚀 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd Adoptme_PreEntrega_1
```

2. **Ejecutar con Docker Compose:**
```bash
docker-compose up
```

3. **Acceder a la aplicación:**
- API: http://localhost:8080
- Documentación Swagger: http://localhost:8080/api-docs

### Opción 2: Ejecución Local

1. **Prerequisitos:**
   - Node.js 18+ 
   - MongoDB 6.0+
   - npm

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
# Crear archivo .env basado en .env.example
cp .env.example .env
```

4. **Iniciar MongoDB:**
```bash
# En Windows (si tienes MongoDB instalado)
mongod

# O usar MongoDB en Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Ejecutar la aplicación:**
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

### Opción 3: Solo con Docker

```bash
# Construir la imagen
docker build -t adoptme-app .

# Ejecutar el contenedor
docker run -p 8080:8080 adoptme-app
```

## 📚 Documentación API

La documentación interactiva de la API está disponible en:
- **Local:** http://localhost:8080/api-docs
- **Docker:** http://localhost:8080/api-docs

### Endpoints Principales

#### 👥 Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:uid` - Obtener usuario por ID
- `PUT /api/users/:uid` - Actualizar usuario
- `DELETE /api/users/:uid` - Eliminar usuario

#### 🐕 Mascotas
- `GET /api/pets` - Obtener todas las mascotas
- `GET /api/pets/:pid` - Obtener mascota por ID
- `POST /api/pets` - Crear nueva mascota
- `PUT /api/pets/:pid` - Actualizar mascota
- `DELETE /api/pets/:pid` - Eliminar mascota

#### 💕 Adopciones
- `GET /api/adoptions` - Obtener todas las adopciones
- `GET /api/adoptions/:aid` - Obtener adopción por ID
- `POST /api/adoptions/:uid/:pid` - Crear nueva adopción

#### 🔐 Sesiones
- `POST /api/sessions/register` - Registrar usuario
- `POST /api/sessions/login` - Iniciar sesión
- `POST /api/sessions/logout` - Cerrar sesión

#### 🎭 Mocks (Testing)
- `GET /api/mocks/mockingpets` - Generar mascotas de prueba
- `GET /api/mocks/mockingusers` - Generar usuarios de prueba

## 🧪 Testing

El proyecto incluye tests funcionales completos para todos los endpoints de adopción:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo tests de adopción
npm run test:adoptions
```

**Resultados de Testing:**
- ✅ 10 tests pasando exitosamente
- ⚠️ 2 tests con timeout en casos edge (IDs inválidos)
- 📊 Cobertura: Todos los endpoints principales cubiertos

### Tests Incluidos:
- ✅ Obtener todas las adopciones
- ✅ Obtener adopción por ID
- ✅ Crear adopción exitosamente
- ✅ Manejo de errores (404, 400)
- ✅ Casos edge (múltiples adopciones, registros únicos)

## 📁 Estructura del Proyecto

```
src/
├── controllers/          # Controladores de las rutas
├── dao/                 # Data Access Objects
│   └── models/          # Modelos de MongoDB
├── dto/                 # Data Transfer Objects
├── routes/              # Definición de rutas
├── services/            # Lógica de negocio
├── utils/               # Utilidades (logger, mocking, etc.)
├── config/              # Configuraciones (Swagger)
└── app.js              # Archivo principal
test/                    # Tests funcionales
logs/                    # Archivos de logs
```

## 🔧 Configuración

### Variables de Entorno

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/adoptme_test
NODE_ENV=development
```

### Docker Compose

El archivo `docker-compose.yml` incluye:
- Aplicación Node.js en puerto 8080
- MongoDB en puerto 27017
- Volúmenes persistentes para datos
- Red personalizada para comunicación entre servicios

## 📝 Scripts Disponibles

```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo con nodemon
npm test           # Ejecutar tests
npm run test:adoptions  # Ejecutar solo tests de adopción
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

**Pablo Bouvier** - Backend III - CoderHouse

## 🔗 Enlaces Útiles

- [Docker Hub Repository](https://hub.docker.com/r/erikbouvier/adoptme-app)
- [Documentación Swagger](http://localhost:8080/api-docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

---

⭐ Si este proyecto te fue útil, ¡no olvides darle una estrella!
- `POST /api/adoptions/:uid/:pid` - Crear nueva adopción

#### 🔐 Sesiones
- `POST /api/sessions/register` - Registrar nuevo usuario
- `POST /api/sessions/login` - Iniciar sesión
- `GET /api/sessions/current` - Obtener sesión actual

## 🔧 Instalación y Configuración

### Prerequisitos
- Node.js v18 o superior
- MongoDB
- Docker y Docker Compose (opcional)

### Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ErikBouvier/PreEntrega1-Backend-III-Pablo-Bouvier.git
   cd PreEntrega1-Backend-III-Pablo-Bouvier/Adoptme_PreEntrega_1
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env basado en .env.example
   cp .env.example .env
   ```

4. **Iniciar MongoDB localmente**
   ```bash
   # Asegúrate de que MongoDB esté ejecutándose en localhost:27017
   ```

5. **Ejecutar la aplicación**
   ```bash
   # Modo desarrollo
   npm run dev
   
   # Modo producción
   npm start
   ```

6. **Acceder a la aplicación**
   - API: http://localhost:8080
   - Documentación: http://localhost:8080/api-docs

### 🐳 Instalación con Docker

#### Opción 1: Docker Compose (Recomendado)

```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en background
docker-compose up -d --build
```

#### Opción 2: Docker Manual

```bash
# Construir la imagen
docker build -t adoptme-app .

# Ejecutar MongoDB
docker run -d --name mongo-adoptme -p 27017:27017 mongo:6.0

# Ejecutar la aplicación
docker run -d --name adoptme-app -p 8080:8080 --link mongo-adoptme:mongo -e MONGO_URL=mongodb://mongo:27017/adoptme_prod adoptme-app
```

### 🐳 Imagen en DockerHub

La imagen oficial está disponible en DockerHub:

**🔗 [https://hub.docker.com/r/pablobouvier/adoptme-app](https://hub.docker.com/r/pablobouvier/adoptme-app)**

#### Uso directo desde DockerHub:

```bash
# Ejecutar con docker-compose desde DockerHub
version: '3.8'
services:
  app:
    image: pablobouvier/adoptme-app:latest
    ports:
      - "8080:8080"
    environment:
      - MONGO_URL=mongodb://mongo:27017/adoptme_prod
    depends_on:
      - mongo
  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"

# O ejecutar directamente
docker run -p 8080:8080 pablobouvier/adoptme-app:latest
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests específicos de adopciones
npm run test:adoptions
```

### Cobertura de Tests

Los tests incluyen:
- ✅ Tests funcionales completos para el router de adopciones
- ✅ Casos de éxito y error
- ✅ Validaciones de datos
- ✅ Tests de integración con base de datos

## 📁 Estructura del Proyecto

```
adoptme/
├── src/
│   ├── config/
│   │   └── swagger.config.js
│   ├── controllers/
│   │   ├── adoptions.controller.js
│   │   ├── pets.controller.js
│   │   ├── sessions.controller.js
│   │   └── users.controller.js
│   ├── dao/
│   │   ├── models/
│   │   │   ├── Adoption.js
│   │   │   ├── Pet.js
│   │   │   └── User.js
│   │   ├── Adoption.js
│   │   ├── Pets.dao.js
│   │   └── Users.dao.js
│   ├── dto/
│   │   ├── Pet.dto.js
│   │   └── User.dto.js
│   ├── repository/
│   │   ├── AdoptionRepository.js
│   │   ├── GenericRepository.js
│   │   ├── PetRepository.js
│   │   └── UserRepository.js
│   ├── routes/
│   │   ├── adoption.router.js
│   │   ├── mocks.router.js
│   │   ├── pets.router.js
│   │   ├── sessions.router.js
│   │   └── users.router.js
│   ├── services/
│   │   └── index.js
│   ├── utils/
│   │   ├── index.js
│   │   ├── logger.js
│   │   ├── mocking.js
│   │   └── uploader.js
│   └── app.js
├── test/
│   └── adoption.test.js
├── logs/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── package.json
└── README.md
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

**Pablo Bouvier**
- GitHub: [@ErikBouvier](https://github.com/ErikBouvier)
- Email: contacto@pablobouvier.com

## 🆘 Soporte

Si tienes algún problema o pregunta, por favor:

1. Revisa la documentación en `/api-docs`
2. Verifica que MongoDB esté ejecutándose
3. Consulta los logs en la carpeta `logs/`
4. Abre un issue en GitHub

---

⭐ **¡No olvides dar una estrella al proyecto si te fue útil!** ⭐
