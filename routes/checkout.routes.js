const express = require('express');
const { addCard, deleteCard, getCardByUserId } = require('../controller/checkout.controller');

const router = express.Router();

router.post('/', addCard);
//router.delete('/:id', deleteCard);
router.delete('/:id', deleteCard);
router.get('/:idUsuario', getCardByUserId); 


module.exports = router;
