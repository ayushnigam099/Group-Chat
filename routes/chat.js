const express = require('express');

const userController = require('../controllers/chat');

const authenticatemiddleware = require('../middleware/auth');


const router = express.Router();

router.post('/sendMessage',authenticatemiddleware.authenticate, userController.sendMessage);
router.get("/getMessages/:param",authenticatemiddleware.authenticate, userController.getMessages);


module.exports = router;