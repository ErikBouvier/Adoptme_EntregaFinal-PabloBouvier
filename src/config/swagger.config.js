import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Adoptme API",
      version: "1.0.0",
      description: "API para el sistema de adopción de mascotas",
      contact: {
        name: "API Support",
        email: "support@adoptme.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["first_name", "last_name", "email"],
          properties: {
            _id: {
              type: "string",
              description: "ID único del usuario",
            },
            first_name: {
              type: "string",
              description: "Nombre del usuario",
            },
            last_name: {
              type: "string",
              description: "Apellido del usuario",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email del usuario",
            },
            password: {
              type: "string",
              description: "Contraseña del usuario",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "Rol del usuario",
            },
            pets: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array de IDs de mascotas adoptadas",
            },
          },
        },
        UserUpdate: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              description: "Nombre del usuario",
            },
            last_name: {
              type: "string",
              description: "Apellido del usuario",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email del usuario",
            },
            password: {
              type: "string",
              description: "Contraseña del usuario",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "Rol del usuario",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            error: {
              type: "string",
              description: "Mensaje de error",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            payload: {
              type: "object",
              description: "Datos de respuesta",
            },
          },
        },
        SuccessMessage: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            message: {
              type: "string",
              description: "Mensaje de éxito",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJSDoc(swaggerOptions);

export { swaggerUi, specs };
