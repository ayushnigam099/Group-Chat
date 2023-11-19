const express = require('express');

const userController = require('../controllers/chat');

const authenticatemiddleware = require('../middleware/auth');


const router = express.Router();

router.post('/message',authenticatemiddleware.authenticate, userController.chatHistory);

// router.post('/signin', userController.signin)

module.exports = router;