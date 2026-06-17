import User from '../models/User.model.js';

const findByEmail = (email) => User.findOne({ email });
const create = (data) => User.create(data);
const findAll = () => User.find().select('-password');

export default { findByEmail, create, findAll };
