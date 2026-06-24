// MIDDLEWARE DE AUTENTICACIÓN
// Se ejecuta antes de cualquier endpoint protegido.
// Verifica que el request incluya un JWT válido en el header Authorization.
//
// Flujo:
// 1. Lee el header Authorization: Bearer <token>
// 2. Si no existe o no tiene el formato correcto → devuelve 401
// 3. Verifica la firma del token con JWT_SECRET
// 4. Si el token es válido → adjunta los datos decodificados en req.user
//    (userId, email, role) para que el controller los pueda usar
// 5. Si el token es inválido o expiró → devuelve 401

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, role } disponibles en el controller
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export default authMiddleware;
