// CONTROLLER DE USUARIOS — CAPA DE LÓGICA DE NEGOCIO
// Maneja los requests de /api/users.
// El roleMiddleware en la ruta ya garantizó que solo el PM llega acá.
// Delega al repository para obtener los datos de la base de datos.
//
// getAll: devuelve la lista de todos los usuarios del equipo (sin passwords)

import userRepository from '../repositories/user.repository.js';

const getAll = async (req, res) => {
  try {
    const users = await userRepository.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

export default { getAll };
