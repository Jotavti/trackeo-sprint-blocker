const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Sprint Blocker Tracker API',
    version: '1.0.0',
    description:
      'API para centralizar los impedimentos de sprint. Los devs cargan sus blockers y el PM los gestiona.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Desarrollo local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtenido en POST /api/auth/login',
      },
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', format: 'email', example: 'juan@ejemplo.com' },
          password: { type: 'string', format: 'password', example: 'secret123' },
          role: { type: 'string', enum: ['dev', 'pm'], example: 'dev' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'juan@ejemplo.com' },
          password: { type: 'string', format: 'password', example: 'secret123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'JWT para incluir en Authorization: Bearer <token>' },
          role: { type: 'string', enum: ['dev', 'pm'] },
          name: { type: 'string', example: 'Juan Pérez' },
        },
      },
      BlockerInput: {
        type: 'object',
        required: ['title', 'description', 'sprint'],
        properties: {
          title: { type: 'string', example: 'API de pagos caída' },
          description: {
            type: 'string',
            example: 'El endpoint de pagos responde 500 desde las 14hs',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            default: 'medium',
          },
          sprint: { type: 'string', example: 'Sprint 12' },
        },
      },
      StatusInput: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['open', 'in_progress', 'resolved'] },
        },
      },
      Blocker: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6657a1b2c3d4e5f6a7b8c9d0' },
          title: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          status: { type: 'string', enum: ['open', 'in_progress', 'resolved'] },
          sprint: { type: 'string' },
          createdBy: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['dev', 'pm'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Registro e inicio de sesión' },
    { name: 'Blockers', description: 'Gestión de impedimentos de sprint' },
    { name: 'Users', description: 'Listado de usuarios (solo PM)' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar un usuario nuevo',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } },
          },
        },
        responses: {
          201: {
            description: 'Usuario registrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    userId: { type: 'string' },
                  },
                },
              },
            },
          },
          400: { description: 'Email ya registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Error del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión y obtener JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } },
          },
        },
        responses: {
          200: {
            description: 'Login exitoso',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
          401: { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Error del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/blockers': {
      get: {
        tags: ['Blockers'],
        summary: 'Listar blockers',
        description: '**DEV**: ve solo sus propios blockers. **PM**: ve todos los del equipo.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de blockers',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Blocker' } } } },
          },
          401: { description: 'Token ausente o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        tags: ['Blockers'],
        summary: 'Crear un blocker nuevo (solo dev)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/BlockerInput' } },
          },
        },
        responses: {
          201: {
            description: 'Blocker creado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Blocker' } } },
          },
          401: { description: 'Token ausente o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Solo devs pueden crear blockers', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Error del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/blockers/{id}': {
      get: {
        tags: ['Blockers'],
        summary: 'Detalle de un blocker específico',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'ID del blocker', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Blocker encontrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Blocker' } } },
          },
          401: { description: 'Token ausente o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Blocker no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Blockers'],
        summary: 'Editar un blocker (dev: solo el propio; PM: cualquiera)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'ID del blocker', schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/BlockerInput' } },
          },
        },
        responses: {
          200: {
            description: 'Blocker actualizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Blocker' } } },
          },
          401: { description: 'Token ausente o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Sin permiso para editar este blocker', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Blocker no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Error del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Blockers'],
        summary: 'Eliminar un blocker (solo PM)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'ID del blocker', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Blocker eliminado',
            content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } },
          },
          401: { description: 'Token ausente o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Solo PM puede eliminar blockers', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Blocker no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Error del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/blockers/{id}/status': {
      patch: {
        tags: ['Blockers'],
        summary: 'Cambiar el estado de un blocker (solo PM)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'ID del blocker', schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/StatusInput' } },
          },
        },
        responses: {
          200: {
            description: 'Estado actualizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Blocker' } } },
          },
          401: { description: 'Token ausente o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Solo PM puede cambiar el estado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Blocker no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Error del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Listar todos los usuarios del equipo (solo PM)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de usuarios',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } },
          },
          401: { description: 'Token ausente o inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Solo PM puede ver los usuarios', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { description: 'Error del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
};

export default swaggerDocument;
