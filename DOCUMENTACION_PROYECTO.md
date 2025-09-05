# 📋 DOCUMENTACIÓN DETALLADA DEL PROYECTO ADOPTME

## 🎯 **PROPÓSITO DEL PROYECTO**

**Adoptme** es un sistema completo de adopción de mascotas que permite:
- Registrar usuarios y mascotas
- Gestionar adopciones
- Autenticar usuarios con JWT
- Subir imágenes de mascotas
- Generar datos de prueba (mocking)

## 🏗️ **ARQUITECTURA DEL PROYECTO**

El proyecto sigue una **arquitectura por capas** con separación clara de responsabilidades:

```
📁 src/
├── 📄 app.js (Punto de entrada)
├── 📁 controllers/ (Lógica de controladores)
├── 📁 dao/ (Data Access Objects)
├── 📁 dto/ (Data Transfer Objects)
├── 📁 repository/ (Capa de repositorio)
├── 📁 routes/ (Definición de rutas)
├── 📁 services/ (Servicios de negocio)
└── 📁 utils/ (Utilidades)
```

---

## 📄 **ARCHIVO PRINCIPAL: `app.js`**

### **¿Qué hace exactamente?**
- **Función Principal**: Es el **corazón** de la aplicación, el punto de entrada
- **Conexión DB**: Se conecta a MongoDB Atlas con credenciales específicas
- **Configuración**: Configura Express con middlewares esenciales
- **Registro de Rutas**: Define los endpoints principales de la API

### **Análisis línea por línea:**
```javascript
const app = express();                    // Crea instancia de Express
const PORT = process.env.PORT||8080;      // Puerto flexible (ENV o 8080)
const connection = mongoose.connect(...); // Conexión a MongoDB Atlas
app.use(express.json());                  // Parsea JSON en requests
app.use(cookieParser());                  // Parsea cookies para JWT
app.use('/api/users',usersRouter);        // Registra rutas de usuarios
```

---

## 🗄️ **MODELOS DE DATOS (`dao/models/`)**

### **`User.js` - Modelo de Usuario**
```javascript
const schema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    pets: [{ _id: { type: mongoose.SchemaTypes.ObjectId, ref: 'Pets' }}]
})
```

**¿Qué hace específicamente?**
- **Define la estructura** de un usuario en MongoDB
- **Validaciones**: email único, campos requeridos
- **Relaciones**: Array de mascotas adoptadas (referencia)
- **Roles**: Sistema de permisos (user/admin)

### **`Pet.js` - Modelo de Mascota**
```javascript
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    specie: { type: String, required: true },
    birthDate: Date,
    adopted: { type: Boolean, default: false },
    owner: { type: mongoose.SchemaTypes.ObjectId, ref: 'Users' },
    image: String
})
```

**¿Qué hace específicamente?**
- **Estados**: `adopted` controla si la mascota ya fue adoptada
- **Propietario**: Referencia al usuario que la adoptó
- **Imagen**: Ruta del archivo de imagen subido

### **`Adoption.js` - Modelo de Adopción**
```javascript
const schema = new mongoose.Schema({
    owner: { type: mongoose.SchemaTypes.ObjectId, ref: 'Users' },
    pet: { type: mongoose.SchemaTypes.ObjectId, ref: 'Pets' }
})
```

**¿Qué hace específicamente?**
- **Registro histórico** de adopciones
- **Relación N:N** entre usuarios y mascotas
- **Auditoría**: Permite rastrear quién adoptó qué y cuándo

---

## 🔌 **CAPA DAO (Data Access Object)**

### **`Users.dao.js`**
```javascript
export default class Users {
    get = (params) => userModel.find(params);        // Buscar múltiples
    getBy = (params) => userModel.findOne(params);   // Buscar uno
    save = (doc) => userModel.create(doc);           // Crear nuevo
    update = (id,doc) => userModel.findByIdAndUpdate(id,{$set:doc}); // Actualizar
    delete = (id) => userModel.findByIdAndDelete(id); // Eliminar
}
```

**¿Qué hace específicamente?**
- **Abstrae MongoDB**: Encapsula todas las operaciones de base de datos
- **CRUD Completo**: Create, Read, Update, Delete
- **Parámetros flexibles**: Permite búsquedas con cualquier criterio
- **Sin lógica de negocio**: Solo operaciones de datos puros

### **`Pets.dao.js` y `Adoption.js`**
**¿Qué hacen específicamente?**
- **Misma estructura** que Users.dao.js
- **Especializados** en sus respectivos modelos
- **Operaciones atómicas** de base de datos

---

## 🎯 **CAPA DTO (Data Transfer Object)**

### **`User.dto.js`**
```javascript
static getUserTokenFrom = (user) => {
    return {
        name: `${user.first_name} ${user.last_name}`,  // Nombre completo
        role: user.role,                               // Rol para autorización
        email: user.email                              // Email para identificación
        // ❌ NO incluye password por SEGURIDAD
    }
}
```

**¿Qué hace específicamente?**
- **Filtra datos sensibles**: NUNCA expone passwords
- **Formatea datos**: Combina first_name + last_name
- **Para JWT**: Estructura específica para tokens de autenticación
- **Seguridad**: Principio de menor privilegio

### **`Pet.dto.js`**
```javascript
static getPetInputFrom = (pet) => {
    return {
        name: pet.name || '',                    // Valor por defecto
        specie: pet.specie || '',               // Valor por defecto
        image: pet.image || '',                 // Valor por defecto
        birthDate: pet.birthDate || '12-30-2000', // Fecha por defecto
        adopted: false                          // SIEMPRE false al crear
    }
}
```

**¿Qué hace específicamente?**
- **Valores por defecto**: Evita errores por campos vacíos
- **Estado inicial**: `adopted: false` siempre al crear
- **Sanitización**: Garantiza formato correcto de datos

---

## 🏗️ **CAPA REPOSITORY**

### **`GenericRepository.js`**
```javascript
export default class GenericRepository {
    constructor(dao) {
        this.dao = dao;  // Inyección de dependencia
    }
    
    getAll = (params) => this.dao.get(params);    // Delega al DAO
    getBy = (params) => this.dao.getBy(params);   // Delega al DAO
    create = (doc) => this.dao.save(doc);         // Delega al DAO
    update = (id,doc) => this.dao.update(id,doc); // Delega al DAO
    delete = (id) => this.dao.delete(id);         // Delega al DAO
}
```

**¿Qué hace específicamente?**
- **Patrón Repository**: Abstrae la persistencia de datos
- **Inyección de dependencias**: Recibe DAO en constructor
- **Métodos genéricos**: Funciona para cualquier entidad
- **Base para especialización**: Otros repositorios heredan de este

### **`UserRepository.js`**
```javascript
export default class UserRepository extends GenericRepository {
    getUserByEmail = (email) => this.getBy({email});      // Búsqueda específica
    getUserById = (id) => this.getBy({_id:id});           // Búsqueda específica
}
```

**¿Qué hace específicamente?**
- **Hereda funcionalidad**: Extiende GenericRepository
- **Métodos específicos**: Búsquedas comunes para usuarios
- **Abstracción**: El controlador no sabe cómo se buscan los datos

---

## 🎮 **CONTROLADORES**

### **`sessions.controller.js`**

#### **Función `register`**
```javascript
const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) 
        return res.status(400).send({ status: "error", error: "Incomplete values" });
    
    const exists = await usersService.getUserByEmail(email);  // Verifica duplicados
    if (exists) 
        return res.status(400).send({ status: "error", error: "User already exists" });
    
    const hashedPassword = await createHash(password);        // Encripta password
    const user = { first_name, last_name, email, password: hashedPassword }
    let result = await usersService.create(user);            // Guarda en DB
    res.send({ status: "success", payload: result._id });
}
```

**¿Qué hace específicamente?**
1. **Valida datos requeridos**: No permite campos vacíos
2. **Previene duplicados**: Verifica si el email ya existe
3. **Seguridad**: Encripta la contraseña con bcrypt
4. **Respuesta consistente**: Formato estándar {status, payload/error}

#### **Función `login`**
```javascript
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await usersService.getUserByEmail(email);    // Busca usuario
    const isValidPassword = await passwordValidation(user,password); // Verifica password
    const userDto = UserDTO.getUserTokenFrom(user);          // Filtra datos
    const token = jwt.sign(userDto,'tokenSecretJWT',{expiresIn:"1h"}); // Crea JWT
    res.cookie('coderCookie',token,{maxAge:3600000}).send(...); // Set cookie
}
```

**¿Qué hace específicamente?**
1. **Autenticación**: Verifica email y password
2. **Seguridad**: No expone password en token
3. **JWT**: Crea token con expiración de 1 hora
4. **Cookie**: Almacena token en cookie httpOnly

### **`pets.controller.js`**

#### **Función `createPetWithImage`**
```javascript
const createPetWithImage = async(req,res) => {
    const file = req.file;                               // Multer proporciona esto
    const {name,specie,birthDate} = req.body;
    const pet = PetDTO.getPetInputFrom({
        name, specie, birthDate,
        image: `${__dirname}/../public/img/${file.filename}` // Ruta completa
    });
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}
```

**¿Qué hace específicamente?**
1. **Manejo de archivos**: Recibe imagen subida por multer
2. **Ruta de imagen**: Construye path completo del archivo
3. **DTO**: Sanitiza datos antes de guardar
4. **Persistencia**: Guarda mascota con referencia a imagen

### **`adoptions.controller.js`**

#### **Función `createAdoption`**
```javascript
const createAdoption = async(req,res) => {
    const {uid,pid} = req.params;                         // IDs desde URL
    const user = await usersService.getUserById(uid);     // Valida usuario
    const pet = await petsService.getBy({_id:pid});       // Valida mascota
    if(pet.adopted) return res.status(400).send(...);     // Verifica disponibilidad
    
    user.pets.push(pet._id);                              // Agrega mascota al usuario
    await usersService.update(user._id,{pets:user.pets}); // Actualiza usuario
    await petsService.update(pet._id,{adopted:true,owner:user._id}); // Actualiza mascota
    await adoptionsService.create({owner:user._id,pet:pet._id}); // Registra adopción
}
```

**¿Qué hace específicamente?**
1. **Validaciones múltiples**: Usuario existe, mascota existe, mascota disponible
2. **Transacción completa**: Actualiza 3 entidades en secuencia
3. **Estado consistente**: Marca mascota como adoptada y asigna propietario
4. **Registro histórico**: Crea entrada en tabla de adopciones

---

## 🛤️ **RUTAS**

### **`sessions.router.js`**
```javascript
router.post('/register', sessionsController.register);    // POST /api/sessions/register
router.post('/login', sessionsController.login);          // POST /api/sessions/login
router.get('/current', sessionsController.current);       // GET /api/sessions/current
```

**¿Qué hace específicamente?**
- **Define endpoints**: Mapea URLs a funciones de controlador
- **Métodos HTTP**: POST para operaciones que modifican, GET para consultas
- **Autorización**: `/current` requiere cookie JWT

### **`adoption.router.js`**
```javascript
router.post('/:uid/:pid', adoptionsController.createAdoption); // POST /api/adoptions/123/456
```

**¿Qué hace específicamente?**
- **Parámetros en URL**: uid (usuario) y pid (mascota)
- **Operación compleja**: Una URL, múltiples operaciones de DB

---

## 🛠️ **UTILIDADES**

### **`uploader.js`**
```javascript
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, `${__dirname}/../public/img`)  // Carpeta destino
    },
    filename: function(req,file,cb) {
        cb(null, `${Date.now()}-${file.originalname}`) // Nombre único
    }
})
```

**¿Qué hace específicamente?**
- **Almacenamiento local**: Guarda archivos en filesystem
- **Nombres únicos**: Timestamp + nombre original evita colisiones
- **Configuración multer**: Middleware para manejar multipart/form-data

### **`index.js`**
```javascript
export const createHash = async(password) => {
    const salts = await bcrypt.genSalt(10);      // Genera salt único
    return bcrypt.hash(password, salts);         // Hash con salt
}

export const passwordValidation = async(user,password) => 
    bcrypt.compare(password, user.password);     // Compara hash
```

**¿Qué hace específicamente?**
- **Seguridad de passwords**: bcrypt con salt dinámico
- **Hashing asíncrono**: No bloquea el event loop
- **Validación segura**: Compara hashes, no passwords en texto plano

### **`logger.js`**
```javascript
const transports = [
    new winston.transports.Console({level: 'debug', format: consoleFormat}),
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'})
];
```

**¿Qué hace específicamente?**
- **Múltiples destinos**: Consola + archivos
- **Niveles**: debug, info, warn, error
- **Formato específico**: JSON para archivos, coloreado para consola
- **Rotación implícita**: Winston maneja archivos grandes

### **`mocking.js`**
```javascript
export const generateMockUser = async () => {
    return {
        first_name: faker.person.firstName(),
        password: await createHash('coder123'), // ← Encriptada
        role: randomRole
    };
};
```

**¿Qué hace específicamente?**
- **Genera datos de prueba** con Faker.js
- **Passwords reales**: Usa bcrypt para encriptar "coder123"
- **Datos realistas**: Nombres, emails, especies aleatorias pero coherentes

---

## 🔄 **FLUJO COMPLETO DE UNA OPERACIÓN**

**Ejemplo: Usuario adopta una mascota**

1. **Cliente** → `POST /api/adoptions/user123/pet456`
2. **app.js** → Enruta a `adoptionsRouter`
3. **adoption.router.js** → Llama `adoptionsController.createAdoption`
4. **adoptions.controller.js** → 
   - Usa `usersService.getUserById(uid)`
   - Usa `petsService.getBy({_id:pid})`
   - Valida que mascota no esté adoptada
5. **UserRepository/PetRepository** → Llama respectivos DAOs
6. **Users.dao.js/Pets.dao.js** → Ejecuta queries MongoDB
7. **Controlador** → Actualiza 3 entidades:
   - Usuario: agrega mascota a array `pets`
   - Mascota: marca `adopted:true` y asigna `owner`
   - Adopción: crea registro histórico
8. **Respuesta** → `{status: "success", message: "Pet adopted"}`

---

## 🚀 **ENDPOINTS DISPONIBLES**

```javascript
// Usuarios
GET    /api/users          // Todos los usuarios
GET    /api/users/:id      // Usuario específico
PUT    /api/users/:id      // Actualizar usuario
DELETE /api/users/:id      // Eliminar usuario

// Mascotas
GET    /api/pets           // Todas las mascotas
POST   /api/pets           // Crear mascota
POST   /api/pets/withimage // Crear mascota con imagen
PUT    /api/pets/:id       // Actualizar mascota
DELETE /api/pets/:id       // Eliminar mascota

// Adopciones
GET    /api/adoptions      // Todas las adopciones
POST   /api/adoptions/:uid/:pid // Crear adopción
GET    /api/adoptions/:id  // Adopción específica

// Autenticación
POST   /api/sessions/register // Registro
POST   /api/sessions/login    // Login
POST   /api/sessions/logout   // Logout
GET    /api/sessions/current  // Usuario actual

// Mocking (datos de prueba)
GET    /api/mocks/mockingusers     // 50 usuarios fake
GET    /api/mocks/mockingpets/:count // N mascotas fake
```

---

## 🎯 **PATRONES DE DISEÑO IMPLEMENTADOS**

1. **Repository Pattern**: Abstrae el acceso a datos
2. **DTO Pattern**: Filtra datos sensibles
3. **Dependency Injection**: En services/index.js
4. **Middleware Pattern**: Express middlewares
5. **Factory Pattern**: En mocking.js

---

## 📊 **RESUMEN DE RESPONSABILIDADES**

| Capa | Responsabilidad | Ejemplo |
|------|----------------|---------|
| **Rutas** | Definir endpoints | `POST /api/users` |
| **Controladores** | Validar requests | Verificar campos requeridos |
| **Servicios** | Lógica de negocio | Verificar email único |
| **Repositorios** | Abstracción de datos | `getUserByEmail()` |
| **DAOs** | Operaciones DB | `userModel.findOne()` |
| **Modelos** | Estructura de datos | Schema de MongoDB |
| **DTOs** | Filtrar datos | Quitar password de respuesta |
| **Utilidades** | Funciones auxiliares | Encriptar passwords |

---

## ⚡ **CARACTERÍSTICAS DESTACADAS**

- ✅ **Arquitectura limpia** con separación de responsabilidades
- ✅ **Seguridad robusta** con bcrypt + JWT
- ✅ **Subida de archivos** con Multer
- ✅ **Logging profesional** con Winston
- ✅ **Datos de prueba** con Faker.js
- ✅ **Base de datos** MongoDB con Mongoose
- ✅ **Validaciones** en múltiples capas
- ✅ **Manejo de errores** consistente
