const express = require('express');

const mainController = require('../controllers/group');
const authorization = require("../middleware/auth");
const router = express.Router();

router.get('/groupParams/:groupName', authorization.authenticate, mainController.groupName)

router.get(`/removeMember/`, authorization.authenticate, mainController.removeMember)

router.get('/group/getGroup', authorization.authenticate, mainController.getGroup)

router.get(`/groupInfo/:groupId`, authorization.authenticate, mainController.groupInfo)

router.get(`/deleteGroup/:groupId`, authorization.authenticate, mainController.deleteGroup)

router.get("/getUser/:UserId", authorization.authenticate, mainController.getUser)

router.get(`/copyLink`, authorization.authenticate, mainController.inviteLink)

router.post("/postChat", authorization.authenticate, mainController.postChat)

router.get("/getChat/", authorization.authenticate, mainController.getChat)

router.post("/file/upload", authorization.authenticate, mainController.upload)

router.get('/fetchbase64/:txt',authorization.authenticate,mainController.fetchBase)


module.exports = router;