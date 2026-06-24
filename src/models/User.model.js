// MODELO DE USUARIO
// Define la estructura (schema) que tiene un usuario en MongoDB.
// Mongoose usa este schema para validar los datos antes de guardarlos.
// El campo password se guarda hasheado (el hash lo hace el controller con bcrypt,
// este modelo solo define que el campo existe y es requerido).
// timestamps: true agrega automáticamente createdAt y updatedAt.

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['dev', 'pm'], default: 'dev' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
