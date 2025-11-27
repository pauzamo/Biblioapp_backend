// blejj/proyectobackfront/.../backend/controller/auth.controllers.js

const authService = require('../service/auth.service');

const register = async (req, res) => {
  try {
    const response = await authService.registerUser(req.body);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en register controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const response = await authService.loginUser(req.body);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en login controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ✅ CORRECCIÓN: Esta función debe estar definida al nivel superior del archivo
const handleCognitoProfile = async (req, res) => {
  try {
    const { email, cognitoSub } = req.body;

    if (!email || !cognitoSub) {
      return res.status(400).json({ message: 'Email y Cognito Sub son requeridos' });
    }

    // Llama al servicio para verificar/crear el perfil en la DB local
    const response = await authService.checkOrCreateProfileFromCognito(email, cognitoSub);

    res.status(response.status).json(response.body);

  } catch (error) {
    console.error('Error en handleCognitoProfile controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


module.exports = {
  register,
  login,
  handleCognitoProfile 
};