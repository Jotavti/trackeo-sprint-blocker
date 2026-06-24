// CONFIGURACIÓN DE EXPRESS
// Acá se configura la aplicación Express: middlewares globales, rutas y Swagger.
// Este archivo no sabe nada de la base de datos ni de la lógica de negocio.
// Solo define cómo se estructura la API y a qué router va cada prefijo de URL.

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import blockerRoutes from './routes/blocker.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Permite que Express lea el body de los requests en formato JSON
app.use(express.json());

// Monta la documentación interactiva de Swagger en /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Cada prefijo de ruta delega al router correspondiente
app.use('/api/auth', authRoutes);       // registro y login
app.use('/api/blockers', blockerRoutes); // gestión de blockers
app.use('/api/users', userRoutes);       // listado de usuarios (solo PM)

// Ruta raíz para verificar que la API está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Sprint Blocker Tracker API — funcionando', docs: '/api-docs' });
});

export default app;
