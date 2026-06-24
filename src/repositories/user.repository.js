// REPOSITORIO DE USUARIOS — CAPA DE ACCESO A DATOS
// Toda la interacción con MongoDB para la colección de usuarios pasa por acá.
// Los controllers nunca tocan Mongoose directamente — siempre llaman a este repositorio.
// Esto separa la lógica de negocio del acceso a datos, haciendo el código más mantenible.
//
// findByEmail: usada en login (verificar credenciales) y register (evitar duplicados)
// create: usada en register para persistir el nuevo usuario
// findAll: usada por el PM para ver todos los usuarios del equipo (excluye el password)

import User from '../models/User.model.js';

const findByEmail = (email) => User.findOne({ email });
const create = (data) => User.create(data);
const findAll = () => User.find().select('-password'); // nunca exponemos el password

export default { findByEmail, create, findAll };
