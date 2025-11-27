const authRepository = require('../repository/auth.repository');

const getUserByEmail = async (email) => {
  try {
    const user = await authRepository.getUserByEmail(email);
    
    if (!user) {
      return { 
        status: 404, 
        body: { message: 'Usuario no encontrado' } 
      };
    }

    // Eliminar información sensible antes de devolver
    const { password, ...userData } = user;
    
    return {
      status: 200,
      body: userData
    };
    
  } catch (error) {
    console.error('Error en getUserByEmail service:', error);
    throw error;
  }
};


const updateUserByEmail = async (email, userData) => {
  try {
    const updated = await authRepository.updateUserByEmail(email, userData);

    if (!updated) {
      return {
        status: 404,
        body: { message: 'Usuario no encontrado' }
      };
    }

    return {
      status: 200,
      body: { message: 'Usuario actualizado con éxito' }
    };
  } catch (error) {
    console.error('Error en updateUserByEmail service:', error);
    throw error;
  }
};

module.exports = {
  getUserByEmail,
  updateUserByEmail
};
