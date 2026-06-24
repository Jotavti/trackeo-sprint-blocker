// REPOSITORIO DE BLOCKERS — CAPA DE ACCESO A DATOS
// Toda la interacción con MongoDB para la colección de blockers pasa por acá.
// Los controllers nunca usan Mongoose directamente — delegan acá.
//
// populate('createdBy', 'name email role') reemplaza el ObjectId del campo createdBy
// con los datos reales del usuario (nombre, email y rol), evitando una segunda consulta.
//
// findAll:    usada por el PM para ver todos los blockers del equipo
// findByUser: usada por el DEV para ver solo sus propios blockers
// findById:   usada para obtener el detalle de un blocker específico
// updateById: usada para editar título/descripción/prioridad/sprint o cambiar estado
// deleteById: usada por el PM para eliminar un blocker

import Blocker from '../models/Blocker.model.js';

const create     = (data) => Blocker.create(data);
const findAll    = () => Blocker.find().populate('createdBy', 'name email role');
const findByUser = (userId) => Blocker.find({ createdBy: userId }).populate('createdBy', 'name email role');
const findById   = (id) => Blocker.findById(id).populate('createdBy', 'name email role');
const updateById = (id, data) => Blocker.findByIdAndUpdate(id, data, { new: true });
const deleteById = (id) => Blocker.findByIdAndDelete(id);

export default { create, findAll, findByUser, findById, updateById, deleteById };
