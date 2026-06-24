// CONTROLLER DE AUTENTICACIÓN — CAPA DE LÓGICA DE NEGOCIO
// Recibe los requests de /api/auth, valida los datos, ejecuta la lógica
// y devuelve la respuesta HTTP. No toca MongoDB directamente — delega al repository.
//
// register:
//   1. Verifica que el email no esté registrado
//   2. Hashea la password con bcrypt (10 rounds)
//   3. Crea el usuario en la base de datos
//   4. Devuelve 201 con el ID del usuario creado
//
// login:
//   1. Busca el usuario por email
//   2. Compara la password con el hash guardado usando bcrypt
//   3. Si es válido, genera un JWT firmado con userId, email y role
//   4. Devuelve el token junto con el rol y nombre (para que el cliente sepa quién es)

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await userRepository.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'El email ya está registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: hashed, role });

    res.status(201).json({ message: 'Usuario registrado', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    // El token incluye userId, email y role — el authMiddleware los extrae en cada request
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

export default { register, login };
