const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function register(req, res) {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y password son requeridos' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contrasena debe tener al menos 6 caracteres' });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'cliente',
      phone
    });
    const token = generateToken(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error('[authController.register]', err.message);
    return res.status(500).json({ error: err.message || 'Error al registrar usuario' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const isValid = await User.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };
    const token = generateToken(safeUser);

    return res.status(200).json({ user: safeUser, token });
  } catch (err) {
    console.error('[authController.login]', err.message);
    return res.status(500).json({ error: 'Error al iniciar sesion' });
  }
}

async function logout(_req, res) {
  return res.status(200).json({ message: 'Sesion cerrada exitosamente' });
}

async function profile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error('[authController.profile]', err.message);
    return res.status(500).json({ error: 'Error al obtener perfil' });
  }
}

module.exports = { register, login, logout, profile };
