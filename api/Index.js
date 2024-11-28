const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Configuración
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Base de datos simulada (en memoria)
const users = [{email: "chiu@gmail.com", password: bcrypt.hashSync("hola")}];

// Middleware
app.use(express.json());
app.use(cors());

// Registro de Usuario
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario ya existe
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'El usuario ya está registrado.' });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar el nuevo usuario en la base de datos simulada
  const newUser = { email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'Usuario registrado exitosamente.' });
});

// Login de usuario
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Verificar si el usuario existe
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas.' });
    }
  
    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales incorrectas.' });
    }
  
    // Generar Token JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  
    res.status(200).json({ message: 'Login exitoso.', token, success: true });
  });
  app.get('/auth/token', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Se espera el token en el header Authorization: Bearer <token>
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token no proporcionado'
        });
    }

    try {
        // Verificar el token y extraer la información
        const decoded = jwt.verify(token, JWT_SECRET);

        // Verificar si el token tiene la propiedad email (o lo que sea necesario en tu payload)
        if (decoded.email) {
            return res.status(200).json({
                success: true,
                message: 'Token validado',
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar el token'
        });
    }
});
  
// Middleware de autenticación para proteger rutas
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });

  try {
    const verified = jwt.verify(token.split(' ')[1], JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token no válido.' });
  }
};

// Ruta protegida (ejemplo)
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Acceso autorizado a ruta protegida.', user: req.user });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
