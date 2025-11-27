const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repository/auth.repository');

const registerUser = async (data) => {
  const { email, password, nombre, apellido, telefono, direccion, dni } = data;

  if (!email || !password || !nombre || !apellido || !telefono || !direccion || !dni) {
    return { status: 400, body: { message: 'Todos los campos son requeridos' } };
  }

  const existe = await authRepository.getUserByEmail(email);
  if (existe) {
    return { status: 409, body: { message: 'El usuario ya existe' } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // Nota: Si usas esta ruta de registro, asegúrate de que cognitoSub sea null o un valor predeterminado si tu tabla lo requiere
  await authRepository.insertUser({ email, password: hashedPassword, nombre, apellido, telefono, direccion, dni, cognitoSub: null }); 

  return { status: 201, body: { message: 'Usuario registrado con éxito' } };
};

const loginUser = async ({ email, password }) => {
  const user = await authRepository.getUserByEmail(email);

  if (!user) {
    return { status: 401, body: { message: 'Credenciales incorrectas' } };
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return { status: 401, body: { message: 'Credenciales incorrectas' } };
  }

  const token = jwt.sign(
    { email: user.email, nombre: user.nombre, id: user.id },
    'secreto123',
    { expiresIn: '1h' }
  );

  return { status: 200, body: { message: 'Login exitoso', token, idUsuario: user.idUsuario } };
};

// NUEVO SERVICIO: Verificar o crear un perfil con datos mínimos después de Cognito
const checkOrCreateProfileFromCognito = async (email, cognitoSub) => {
    let user = await authRepository.getUserByEmail(email);

    if (!user) {
        // Generar una contraseña aleatoria y hasheada (no será usada, ya que la autenticación es por Cognito)
        const defaultPassword = await bcrypt.hash(Date.now().toString(), 10);
        
        // Asumiendo que insertUser en el repositorio fue modificado para aceptar cognitoSub
        await authRepository.insertUser({
            email,
            password: defaultPassword, 
            nombre: null, 
            apellido: null,
            telefono: null,
            direccion: null,
            dni: null,
            cognitoSub: cognitoSub // Guardar el Sub de Cognito
        });
        
        // Volver a obtener el usuario recién creado para devolver el objeto completo
        user = await authRepository.getUserByEmail(email);
        
        return { status: 201, body: { message: 'Perfil creado con éxito', user } };
    }
    
    // Si el usuario existe, simplemente devolverlo
    return { status: 200, body: { message: 'Perfil obtenido con éxito', user } };
};


module.exports = { 
    registerUser, 
    loginUser,
    checkOrCreateProfileFromCognito // <-- Exportar la nueva función
};