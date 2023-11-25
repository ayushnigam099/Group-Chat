const express = require('express');

const userController = require('../controllers/chat');

const authenticatemiddleware = require('../middleware/auth');


const router = express.Router();

router.post('/message',authenticatemiddleware.authenticate, userController.chatHistory);
router.get('/get-messages',authenticatemiddleware.authenticate, userController.getHistory);

// router.post('/signin', userController.signin)

module.exports = router;