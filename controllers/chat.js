const Chat = require('../models/chat');
const Users = require('../models/users');
const sequelize= require('../connection/database')


const chatHistory= async(req,res,next)=>
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
        { message, UserId: req.user.id });
        res.status(200).json({Success:true , dataValues})
   }
   catch(err)
   {
    res.status(500).json({error: "Internal Server Error"});
   }

}

const getHistory= async(req,res,next)=>
{
  try {
    let messages = await req.user.getChats({
      attributes: { exclude: ['UserId'] }
    });
    res.status(200).json({Success:true , messages})
  }
  catch(error)
  {
    console.log(">>>>>>>",error);
    res.status(500).json({error: "Internal Server Error"});
  }
}


module.exports = {
    chatHistory,
    getHistory,
}