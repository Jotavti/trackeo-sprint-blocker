import express from 'express';
import authRoutes from './routes/auth.routes.js';
import blockerRoutes from './routes/blocker.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blockers', blockerRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Sprint Blocker Tracker API — funcionando' });
});

export default app;
