const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const signup= async(req,res,next)=>
{
   const saltrounds=10; //Saltrounds for encrypting password
   function isStringValidate(string){

    if(string == undefined || string.length === 0)
     return true;
    else{
      return false;
    }
   }
    try{
        const {name, email,number, password}= req.body;
         if (isStringValidate(name) || isStringValidate(email) || isStringValidate(password) || isStringValidate(number) || number.length != 10) {
          return res.status(400).json({ err: "Please Fill All The Entries / Enter a correct mobile number" });
      }
  
          const hash =  await bcrypt.hash(password, saltrounds);
          await Users.create({name,email,number, password: hash});
          return res.status(200).json({Success: "User Successfully Created"}); 
       }
        catch(err)
        {
            res.status(500).json(err);
        }
        }

module.exports = {
    signup,
}