// PUNTO DE ENTRADA DE LA APLICACIÓN
// Este es el primer archivo que se ejecuta cuando arranca el servidor.
// Su único trabajo es: cargar las variables de entorno, conectar a MongoDB
// y levantar el servidor Express en el puerto configurado.
// No tiene lógica de negocio — solo inicializa todo.

import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
