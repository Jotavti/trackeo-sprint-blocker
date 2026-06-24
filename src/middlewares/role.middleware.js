// MIDDLEWARE DE ROLES
// Se ejecuta después de authMiddleware, cuando un endpoint requiere un rol específico.
// Es una factory function: recibe uno o más roles permitidos y devuelve un middleware.
//
// Ejemplo de uso en las rutas:
//   roleMiddleware('pm')        → solo el PM puede acceder
//   roleMiddleware('dev', 'pm') → tanto devs como PMs pueden acceder
//
// Si el rol del usuario (que viene en req.user.role, puesto por authMiddleware)
// no está entre los roles permitidos → devuelve 403 Forbidden.

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tenés permiso para realizar esta acción' });
    }
    next();
  };
};

export default roleMiddleware;
