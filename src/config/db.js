// CONEXIÓN A MONGODB
// Función que establece la conexión con MongoDB Atlas usando Mongoose.
// Se llama una sola vez al arrancar el servidor (desde server.js).
// Si la conexión falla, el proceso termina con error — no tiene sentido
// levantar el servidor si no hay base de datos disponible.

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
