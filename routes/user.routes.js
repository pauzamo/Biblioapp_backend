const express = require('express');
const router = express.Router();
const { getUserByEmail, updateUser } = require('../controller/user.controller');

router.get('/:email', getUserByEmail);
router.put('/:email', updateUser);

module.exports = router;
