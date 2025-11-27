const checkoutRepository = require('../repository/checkout.repository');

const saveCard = async (data) => {
  const { nroTarjeta, fechaVencimiento, clave, idUsuario, importe } = data;

  if (!nroTarjeta || !fechaVencimiento || !clave || !idUsuario || !importe) {
    console.log("falta algun campo");
    return { status: 400, body: { message: 'Todos los campos son requeridos' } };
  }

  await checkoutRepository.insertCard({ nroTarjeta, fechaVencimiento, clave, idUsuario, importe });

  return { status: 201, body: { message: 'Tarjeta guardada con éxito' } };
};

const removeCard = async (idTarjeta, idUsuario) => {
  const success = await checkoutRepository.deleteCard(idTarjeta, idUsuario);

  if (!success) {
    return { status: 404, body: { message: 'Tarjeta no encontrada o no pertenece al usuario' } };
  }

  return { status: 200, body: { message: 'Tarjeta eliminada correctamente' } };
};

const getCardByUserId = async (userId) => {
  const card = await checkoutRepository.getCardByUserId(userId);
  if (card) {
    return { status: 200, body: card };
  } else {
    return { status: 404, body: { message: 'No se encontró la tarjeta' } };
  }
};


module.exports = { saveCard, removeCard, getCardByUserId };
