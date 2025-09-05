# 📦 DOCUMENTACIÓN DE DEPENDENCIAS - PROYECTO ADOPTME

## 🎯 **DESCRIPCIÓN GENERAL**

Este documento explica **detalladamente** cada dependencia y librería utilizada en el proyecto Adoptme, incluyendo su propósito, funcionamiento y por qué es necesaria.

---

## 📋 **DEPENDENCIAS DE PRODUCCIÓN**

### **🌐 Express - `express@^4.18.2`**

**¿Qué es?**
- Framework web minimalista y flexible para Node.js
- Base fundamental de la aplicación web

**¿Qué hace en nuestro proyecto?**
- **Servidor HTTP**: Maneja requests y responses
- **Middleware**: Sistema de middleware para procesamiento de requests
- **Routing**: Sistema de rutas para organizar endpoints
- **JSON parsing**: Convierte automáticamente JSON en objetos JavaScript

**Ejemplo de uso:**
```javascript
const app = express();
app.use(express.json());  // Middleware para parsear JSON
app.get('/api/users', handler);  // Definir rutas
app.listen(8080);  // Iniciar servidor
```

---

### **🗄️ Mongoose - `mongoose@^6.7.5`**

**¿Qué es?**
- ODM (Object Document Mapper) para MongoDB y Node.js
- Abstrae la interacción con MongoDB mediante esquemas y modelos

**¿Qué hace en nuestro proyecto?**
- **Conexión a DB**: Maneja la conexión con MongoDB Atlas
- **Schemas**: Define la estructura de documentos (User, Pet, Adoption)
- **Validaciones**: Valida datos antes de guardar en DB
- **Queries**: Facilita consultas con métodos como `find()`, `create()`
- **Relaciones**: Maneja referencias entre documentos con `populate()`

**Ejemplo de uso:**
```javascript
mongoose.connect('mongodb://...');  // Conexión
const userSchema = new mongoose.Schema({...});  // Schema
const User = mongoose.model('User', userSchema);  // Modelo
const users = await User.find();  // Query
```

---

### **🔐 bcrypt - `bcrypt@^5.1.0`**

**¿Qué es?**
- Librería para hashing seguro de contraseñas
- Implementa el algoritmo bcrypt con salt automático

**¿Qué hace en nuestro proyecto?**
- **Encriptación**: Convierte contraseñas en hashes seguros
- **Salt dinámico**: Genera salt único para cada password
- **Verificación**: Compara passwords de forma segura
- **Protección**: Previene ataques de rainbow table

**Ejemplo de uso:**
```javascript
// Encriptar
const hashedPassword = await bcrypt.hash('password123', 10);

// Verificar
const isValid = await bcrypt.compare('password123', hashedPassword);
```

**¿Por qué es importante?**
- ❌ **NUNCA** guardar passwords en texto plano
- ✅ bcrypt es resistente a ataques de fuerza bruta
- ✅ Salt automático previene ataques de diccionario

---

### **🎫 JSON Web Token - `jsonwebtoken@^8.5.1`**

**¿Qué es?**
- Estándar para transmitir información de forma segura
- Token autocontenido que incluye claims del usuario

**¿Qué hace en nuestro proyecto?**
- **Autenticación**: Crea tokens después del login
- **Autorización**: Verifica permisos en requests protegidos
- **Sesiones**: Mantiene estado de usuario sin server-side sessions
- **Expiración**: Tokens con tiempo de vida limitado

**Ejemplo de uso:**
```javascript
// Crear token
const token = jwt.sign(
  { userId: user._id, role: user.role }, 
  'secretKey', 
  { expiresIn: '1h' }
);

// Verificar token
const decoded = jwt.verify(token, 'secretKey');
```

**Estructura de un JWT:**
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

### **🍪 Cookie Parser - `cookie-parser@^1.4.6`**

**¿Qué es?**
- Middleware de Express para parsear cookies HTTP
- Facilita el acceso a cookies en requests

**¿Qué hace en nuestro proyecto?**
- **Parseo**: Convierte cookies HTTP en objetos JavaScript
- **JWT Storage**: Almacena tokens JWT en cookies httpOnly
- **Seguridad**: Cookies httpOnly no accesibles desde JavaScript del cliente

**Ejemplo de uso:**
```javascript
app.use(cookieParser());

// Leer cookie
const token = req.cookies['coderCookie'];

// Escribir cookie
res.cookie('coderCookie', token, { 
  maxAge: 3600000,  // 1 hora
  httpOnly: true    // Seguridad
});
```

---

### **📁 Multer - `multer@^1.4.5-lts.1`**

**¿Qué es?**
- Middleware para manejar `multipart/form-data`
- Especializado en subida de archivos

**¿Qué hace en nuestro proyecto?**
- **Upload de imágenes**: Permite subir fotos de mascotas
- **Storage local**: Guarda archivos en filesystem
- **Validaciones**: Controla tipo y tamaño de archivos
- **Naming**: Genera nombres únicos para evitar colisiones

**Ejemplo de uso:**
```javascript
const storage = multer.diskStorage({
  destination: './src/public/img',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
router.post('/withimage', upload.single('image'), handler);
```

---

### **📝 Winston - `winston@^3.11.0`**

**¿Qué es?**
- Librería de logging profesional para Node.js
- Sistema de logging multi-transport y configurable

**¿Qué hace en nuestro proyecto?**
- **Múltiples destinos**: Consola + archivos
- **Niveles**: error, warn, info, debug
- **Formato**: JSON para archivos, coloreado para consola
- **Rotación**: Manejo automático de archivos grandes

**Ejemplo de uso:**
```javascript
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Usuario creado exitosamente');
logger.error('Error de conexión a DB');
```

**Niveles de logging:**
- **error**: Errores críticos
- **warn**: Advertencias
- **info**: Información general
- **debug**: Información de desarrollo

---

### **🎲 Faker.js - `@faker-js/faker@^8.4.1`**

**¿Qué es?**
- Librería para generar datos falsos pero realistas
- Útil para testing y desarrollo

**¿Qué hace en nuestro proyecto?**
- **Mock users**: Genera usuarios con datos realistas
- **Mock pets**: Genera mascotas con nombres y especies
- **Testing**: Facilita pruebas con datos consistentes
- **Desarrollo**: Llena la BD con datos para testing

**Ejemplo de uso:**
```javascript
import { faker } from '@faker-js/faker';

const mockUser = {
  first_name: faker.person.firstName(),     // "John"
  last_name: faker.person.lastName(),       // "Doe"
  email: faker.internet.email(),            // "john.doe@email.com"
  birthDate: faker.date.past({ years: 10 }) // Fecha aleatoria
};
```

**Datos que puede generar:**
- Nombres, apellidos, emails
- Fechas, direcciones, teléfonos
- Texto lorem ipsum
- URLs de imágenes
- Y mucho más...

---

### **🧪 Supertest - `supertest@^6.3.3`**

**¿Qué es?**
- Librería para testing de APIs HTTP
- Construida sobre SuperAgent

**¿Qué hace en nuestro proyecto?**
- **Testing de endpoints**: Prueba rutas de la API
- **Assertions**: Verifica respuestas HTTP
- **Integration testing**: Pruebas de integración completas

**Ejemplo de uso:**
```javascript
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/users', () => {
  it('should return users list', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/);
      
    expect(response.body.status).toBe('success');
  });
});
```

---

## 🛠️ **DEPENDENCIAS DE DESARROLLO**

### **☕ Mocha - `mocha@^10.1.0`**

**¿Qué es?**
- Framework de testing para JavaScript
- Proporciona estructura para organizar tests

**¿Qué hace en nuestro proyecto?**
- **Test runner**: Ejecuta todos los tests
- **Estructura**: `describe()` y `it()` para organizar tests
- **Hooks**: `before()`, `after()`, `beforeEach()`, `afterEach()`
- **Reporting**: Genera reportes de resultados

**Ejemplo de uso:**
```javascript
describe('User Controller', () => {
  beforeEach(() => {
    // Setup antes de cada test
  });

  it('should create a user', async () => {
    // Test específico
  });

  it('should validate required fields', async () => {
    // Otro test
  });
});
```

---

### **🔍 Chai - `chai@^4.3.7`**

**¿Qué es?**
- Librería de assertions para testing
- Sintaxis expresiva y legible

**¿Qué hace en nuestro proyecto?**
- **Assertions**: Verificaciones en tests
- **Sintaxis BDD**: `expect()`, `should`, `assert`
- **Matchers**: `.to.be()`, `.to.have()`, `.to.equal()`

**Ejemplo de uso:**
```javascript
import { expect } from 'chai';

expect(response.status).to.equal(200);
expect(response.body).to.have.property('payload');
expect(users).to.be.an('array');
expect(users).to.have.lengthOf(5);
```

---

### **🔄 Nodemon - `nodemon@^3.0.3`**

**¿Qué es?**
- Herramienta que reinicia automáticamente Node.js
- Monitorea cambios en archivos

**¿Qué hace en nuestro proyecto?**
- **Auto-restart**: Reinicia servidor al cambiar código
- **Desarrollo**: Acelera el ciclo de desarrollo
- **Watch files**: Monitorea archivos .js, .json, etc.

**Configuración en package.json:**
```json
{
  "scripts": {
    "dev": "nodemon src/app.js"
  }
}
```

**Uso:**
```bash
npm run dev  # Inicia con auto-restart
```

---

## 🔧 **CONFIGURACIONES ESPECIALES**

### **📦 package.json - type: "module"**

**¿Qué significa?**
- Habilita ES6 modules en Node.js
- Permite usar `import`/`export` en lugar de `require()`

**Ejemplo:**
```javascript
// ✅ Con ES6 modules
import express from 'express';
export default router;

// ❌ CommonJS (sin "type": "module")
const express = require('express');
module.exports = router;
```

---

## 📊 **RESUMEN DE DEPENDENCIAS POR CATEGORÍA**

### **🌐 Web Framework**
- **Express**: Servidor web y routing
- **Cookie-parser**: Manejo de cookies

### **🗄️ Base de Datos**
- **Mongoose**: ODM para MongoDB

### **🔐 Seguridad**
- **bcrypt**: Hashing de passwords
- **jsonwebtoken**: Autenticación JWT

### **📁 Archivos**
- **Multer**: Upload de imágenes

### **📝 Logging & Utilidades**
- **Winston**: Sistema de logs
- **@faker-js/faker**: Datos de prueba

### **🧪 Testing**
- **Mocha**: Framework de testing
- **Chai**: Librería de assertions
- **Supertest**: Testing de APIs

### **🛠️ Desarrollo**
- **Nodemon**: Auto-restart en desarrollo

---

## ⚡ **FLUJO DE DEPENDENCIAS**

```mermaid
graph TD
    A[Express] --> B[Middleware]
    B --> C[Cookie-parser]
    B --> D[Multer]
    
    A --> E[Routes]
    E --> F[Controllers]
    F --> G[Services]
    G --> H[Repositories]
    H --> I[DAOs]
    I --> J[Mongoose]
    J --> K[MongoDB Atlas]
    
    F --> L[JWT]
    F --> M[bcrypt]
    
    N[Winston] --> O[Logs]
    P[Faker] --> Q[Mock Data]
    
    R[Mocha] --> S[Tests]
    S --> T[Chai]
    S --> U[Supertest]
```

---

## 🔒 **CONSIDERACIONES DE SEGURIDAD**

### **Dependencias con Vulnerabilidades**
Al ejecutar `npm audit`, encontramos 28 vulnerabilidades:

- **jsonwebtoken**: Versión antigua con vulnerabilidades conocidas
- **express**: Vulnerabilidades en body-parser
- **mongoose**: Vulnerabilidad en MongoDB driver

### **Recomendaciones:**
1. **Actualizar dependencias**: `npm audit fix`
2. **Revisar breaking changes** antes de actualizar
3. **Usar versiones LTS** cuando sea posible
4. **Monitorear vulnerabilidades** regularmente

---

## 📈 **OPTIMIZACIONES POSIBLES**

### **Dependencias que se podrían agregar:**
- **Helmet**: Headers de seguridad
- **Cors**: Manejo de CORS
- **Rate-limiting**: Protección contra spam
- **Compression**: Compresión de responses
- **Dotenv**: Manejo de variables de entorno

### **Alternativas a considerar:**
- **Pino** en lugar de Winston (más rápido)
- **Fastify** en lugar de Express (más performante)
- **Zod** para validaciones de esquemas

---

Este documento proporciona una comprensión completa de todas las dependencias utilizadas en el proyecto Adoptme, facilitando el mantenimiento y futuras actualizaciones.
