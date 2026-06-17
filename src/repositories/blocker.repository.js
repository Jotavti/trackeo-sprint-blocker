import Blocker from '../models/Blocker.model.js';

const create = (data) => Blocker.create(data);
const findAll = () => Blocker.find().populate('createdBy', 'name email role');
const findByUser = (userId) => Blocker.find({ createdBy: userId }).populate('createdBy', 'name email role');
const findById = (id) => Blocker.findById(id).populate('createdBy', 'name email role');
const updateById = (id, data) => Blocker.findByIdAndUpdate(id, data, { new: true });
const deleteById = (id) => Blocker.findByIdAndDelete(id);

export default { create, findAll, findByUser, findById, updateById, deleteById };
