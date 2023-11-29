const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group");
const Authentication = require("../middleware/auth");


router.post("/createGroup", Authentication.authenticate, groupController.createGroup);

router.post("/addToGroup", Authentication.authenticate, groupController.addToGroup);

router.get("/getGroups", Authentication.authenticate, groupController.getGroups);

router.post(
  "/deleteFromGroup",
  Authentication.authenticate,
  groupController.deleteFromGroup
);

router.get(
  "/groupMembers/:groupName",
  Authentication.authenticate,
  groupController.groupMembers
);
module.exports = router;