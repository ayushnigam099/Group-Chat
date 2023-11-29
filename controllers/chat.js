const Chat = require('../models/chat');
const UserGroup = require("../models/userGroup");
const Group = require("../models/groupModel");
const Users = require('../models/users');
const sequelize= require('../connection/database')
const { Op } = require("sequelize");

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:4400",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("getMessages", async (groupName) => {
    try {
      const group = await Group.findOne({ where: { name: groupName } });
      const messages = await Chat.findAll({
        where: { groupId: group.dataValues.id },
      });
      console.log("Request Made");
      io.emit("messages", messages);
    } catch (error) {
      console.log(error);
    }
  });
});

const sendMessage= async(req,res,next)=>
{
    function isStringValidate(string) {
        return string === undefined || string.length === 0;
      }
      try{
        const group = await Group.findOne({
          where: { name: req.body.groupName },
        });
       const {message} = req.body;
       if (isStringValidate(message)) {
        return res.status(400).json({Success: false, message: 'Type your message' });
      }
      const dataValues = await Chat.create(
        { name: req.user.name, message, UserId: req.user.id, groupId: group.dataValues.id });
        res.status(200).json({Success:true})
   }
   catch(err)
   {
    console.log(err);
    res.status(500).json({error: "Internal Server Error"});
   }

}

// const getMessages= async(req,res,next)=>
// {
//   try {
//     const param = req.params.param;
//     const group = await Group.findOne({
//       where: { name: req.query.groupName },
//     });
//     let messages = await Chat.findAll({
//       attributes: { exclude: ['UserId'] , order: [['date_time', 'ASC']], where: {
//         [Op.and]: {
//           id: {
//             [Op.gt]: param,
//           },
//           groupId: group.dataValues.id,
//         },
//       },
//     }});
//     res.status(200).json({Success:true , messages})
//   }
//   catch(err)
//   {
//     res.status(500).json({error: "Internal Server Error"});
//   }
// }


module.exports = {
    sendMessage,
}