const express = require('express');
const { chatWithAI } = require('../controller/aiGemini.controllers');
const router = express.Router();

router.post('/chat', chatWithAI);

module.exports = router;