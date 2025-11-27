const { poolPromise, sql } = require('../config/db');

const getUserByEmail = async (email) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('email', sql.VarChar, email)
    .query('SELECT * FROM Usuarios WHERE email = @email');

  return result.recordset[0];
};

const insertUser = async ({ email, password, nombre, apellido, telefono, direccion, dni, cognitoSub }) => {
  const pool = await poolPromise;
  await pool.request()
    .input('email', sql.VarChar, email)
    .input('password', sql.VarChar, password)
    .input('nombre', sql.VarChar, nombre)
    .input('apellido', sql.VarChar, apellido)
    .input('telefono', sql.VarChar, telefono)
    .input('direccion', sql.VarChar, direccion)
    .input('dni', sql.VarChar, dni)
    .input('cognitoSub', sql.VarChar, cognitoSub) 
    .query(`
      INSERT INTO Usuarios (email, password, nombre, apellido, telefono, direccion, dni, cognitoSub)
      VALUES (@email, @password, @nombre, @apellido, @telefono, @direccion, @dni, @cognitoSub) 
    `);
};

const updateUserByEmail = async (email, data) => {
  const pool = await poolPromise;
  const request = pool.request().input('email', sql.VarChar, email);

  if (data.nombre) request.input('nombre', sql.VarChar, data.nombre);
  if (data.apellido) request.input('apellido', sql.VarChar, data.apellido);
  if (data.telefono) request.input('telefono', sql.VarChar, data.telefono);
  if (data.direccion) request.input('direccion', sql.VarChar, data.direccion);
  if (data.dni) request.input('dni', sql.VarChar, data.dni);

  const result = await request.query(`
    UPDATE Usuarios
    SET
      nombre = ISNULL(@nombre, nombre),
      apellido = ISNULL(@apellido, apellido),
      telefono = ISNULL(@telefono, telefono),
      direccion = ISNULL(@direccion, direccion),
      dni = ISNULL(@dni, dni)
    WHERE email = @email
  `);

  return result.rowsAffected[0] > 0;
};

module.exports = {
  getUserByEmail,
  insertUser,
  updateUserByEmail
};
