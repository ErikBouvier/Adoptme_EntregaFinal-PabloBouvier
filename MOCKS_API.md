# 📋 API de Mocks - Documentación

## Endpoints Disponibles

### 1. GET /api/mocks/mockingusers
**Descripción:** Genera 50 usuarios mock sin insertarlos en la base de datos.

**Respuesta Exitosa (200):**
```json
{
  "status": "success",
  "message": "50 usuarios mock generados exitosamente",
  "payload": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "password": "$2b$10$...", // contraseña "coder123" encriptada
      "role": "user", // o "admin"
      "pets": []
    }
  ],
  "count": 50
}
```

### 2. GET /api/mocks/mockingpets/:count?
**Descripción:** Genera mascotas mock. El parámetro count es opcional (por defecto 10, máximo 100).

**Parámetros:**
- `count` (opcional): Número de mascotas a generar (1-100)

**Ejemplo:** `/api/mocks/mockingpets/25`

**Respuesta Exitosa (200):**
```json
{
  "status": "success",
  "message": "25 mascotas mock generadas exitosamente",
  "payload": [
    {
      "name": "Max",
      "specie": "dog",
      "birthDate": "2020-03-15T10:30:00.000Z",
      "adopted": false,
      "image": "https://loremflickr.com/640/480/animals"
    }
  ],
  "count": 25
}
```

### 3. POST /api/mocks/generateData
**Descripción:** Genera e inserta usuarios y mascotas en la base de datos.

**Body (JSON):**
```json
{
  "users": 10,    // Número de usuarios a generar e insertar
  "pets": 20      // Número de mascotas a generar e insertar
}
```

**Respuesta Exitosa (201):**
```json
{
  "status": "success",
  "message": "Datos generados e insertados exitosamente",
  "payload": {
    "users": {
      "requested": 10,
      "created": 10,
      "data": [/* usuarios creados */]
    },
    "pets": {
      "requested": 20,
      "created": 20,
      "data": [/* mascotas creadas */]
    }
  }
}
```

## Validaciones y Límites

- **Usuarios mock:** Máximo 1000 por generación
- **Mascotas mock:** Máximo 100 por endpoint GET, 1000 por POST
- Todos los usuarios tienen la contraseña "coder123" encriptada
- Los roles son aleatorios entre "user" y "admin"
- Todas las mascotas empiezan como no adoptadas

## Códigos de Error

- **400:** Parámetros inválidos o límites excedidos
- **500:** Error interno del servidor

## Ejemplos de Uso con curl

```bash
# Generar 50 usuarios mock
curl -X GET http://localhost:8080/api/mocks/mockingusers

# Generar 30 mascotas mock
curl -X GET http://localhost:8080/api/mocks/mockingpets/30

# Insertar 5 usuarios y 10 mascotas en la BD
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 5, "pets": 10}'
```
