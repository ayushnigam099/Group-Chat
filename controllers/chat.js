const Chat = require('../models/chat');
const Users = require('../models/users');
const sequelize= require('../connection/database')
const { Op } = require("sequelize");


const sendMessage= async(req,res,next)=>
{
    function isStringValidate(string) {
        return string === undefined || string.length === 0;
      }
      try{
       const {message} = req.body;
       if (isStringValidate(message)) {
        return res.status(400).json({Success: false, message: 'Type your message' });
      }
      const dataValues = await Chat.create(
        { name: req.user.name, message, UserId: req.user.id });
        res.status(200).json({Success:true})
   }
   catch(err)
   {
    res.status(500).json({error: "Internal Server Error"});
   }

}

const getMessages= async(req,res,next)=>
{
  try {
    const param = req.params.param;
    let messages = await Chat.findAll({
      attributes: { exclude: ['UserId'] , order: [['date_time', 'ASC']], where: {
        id: {
          [Op.gt]: param,
        }}
    }});
    res.status(200).json({Success:true , messages})
  }
  catch(err)
  {
    res.status(500).json({error: "Internal Server Error"});
  }
}


module.exports = {
    sendMessage,
    getMessages,
}