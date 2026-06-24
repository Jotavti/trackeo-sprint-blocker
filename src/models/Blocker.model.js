// MODELO DE BLOCKER
// Define la estructura de un impedimento de sprint en MongoDB.
// createdBy es una referencia (ObjectId) al usuario que creó el blocker —
// esto permite hacer populate() en el repository para traer los datos del
// usuario junto con el blocker en una sola consulta.
// timestamps: true agrega automáticamente createdAt y updatedAt.

import mongoose from 'mongoose';

const blockerSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status:      { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  sprint:      { type: String, required: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Blocker', blockerSchema);
