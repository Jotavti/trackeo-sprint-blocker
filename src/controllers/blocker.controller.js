// CONTROLLER DE BLOCKERS — CAPA DE LÓGICA DE NEGOCIO
// Recibe los requests ya autenticados (authMiddleware adjuntó req.user),
// aplica la lógica de negocio según el rol, y delega al repository para tocar la BD.
//
// create:       crea un blocker asignándolo al userId del token (el dev que lo reporta)
// getAll:       si es PM → trae todos; si es DEV → trae solo los suyos
// getById:      trae un blocker específico por su ID
// update:       DEV solo puede editar sus propios blockers; PM puede editar cualquiera
// updateStatus: solo PM puede cambiar el estado (open → in_progress → resolved)
// remove:       solo PM puede eliminar (el roleMiddleware ya bloqueó a los devs en la ruta)

import blockerRepository from '../repositories/blocker.repository.js';

const create = async (req, res) => {
  try {
    const { title, description, priority, sprint } = req.body;
    const blocker = await blockerRepository.create({
      title, description, priority, sprint,
      createdBy: req.user.userId // viene del JWT decodificado por authMiddleware
    });
    res.status(201).json(blocker);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear blocker', error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    // El PM ve todo el equipo; el DEV solo ve los suyos
    const blockers = req.user.role === 'pm'
      ? await blockerRepository.findAll()
      : await blockerRepository.findByUser(req.user.userId);
    res.json(blockers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener blockers', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const blocker = await blockerRepository.findById(req.params.id);
    if (!blocker) return res.status(404).json({ message: 'Blocker no encontrado' });
    res.json(blocker);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener blocker', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const blocker = await blockerRepository.findById(req.params.id);
    if (!blocker) return res.status(404).json({ message: 'Blocker no encontrado' });

    // Un DEV solo puede editar sus propios blockers
    const isOwner = blocker.createdBy._id.toString() === req.user.userId;
    if (req.user.role === 'dev' && !isOwner) {
      return res.status(403).json({ message: 'Solo podés editar tus propios blockers' });
    }

    const updated = await blockerRepository.updateById(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar blocker', error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await blockerRepository.updateById(req.params.id, { status });
    if (!updated) return res.status(404).json({ message: 'Blocker no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await blockerRepository.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Blocker no encontrado' });
    res.json({ message: 'Blocker eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar blocker', error: error.message });
  }
};

export default { create, getAll, getById, update, updateStatus, remove };
