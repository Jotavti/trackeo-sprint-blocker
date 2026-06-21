import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import blockerRoutes from './routes/blocker.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/blockers', blockerRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Sprint Blocker Tracker API — funcionando', docs: '/api-docs' });
});

export default app;
