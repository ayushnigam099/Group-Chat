const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group");
const Authentication = require("../middleware/auth");

router.post("/createGroup", Authentication.authenticate, groupController.createGroup);

router.post("/addToGroup", Authentication.authenticate, groupController.addToGroup);

router.get("/getGroups", Authentication.authenticate, groupController.getGroups);

module.exports = router;