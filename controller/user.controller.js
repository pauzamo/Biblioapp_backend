const userService = require('../service/user.service');

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const response = await userService.getUserByEmail(email);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en getUserByEmail controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const userData = req.body;

    const response = await userService.updateUserByEmail(email, userData);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error en updateUser controller:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getUserByEmail,
  updateUser
};
