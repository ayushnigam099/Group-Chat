const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Token Generator
const generateAccessToken = (id, name) => {
    return jwt.sign({ userId : id, name: name} , process.env.TOKEN);
    }


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
            res.status(500).json({error: "Internal Server Error"});
        }
        }

const signin= async (req, res, next) => {
    function isStringValidate(string){
    
        if(string == undefined || string.length === 0)
        return true;
        else{
        return false;
        }
    }
    
    try {
        const { email, password } = req.body;
    
        // Check if email or password is missing
        if (isStringValidate(email) || isStringValidate(password)) {
            return res.status(400).json({ success: false, message: "Please fill in all the fields." });
        }

        // Find the user by email
        const user = await Users.findOne({
            where: {
            email: email
            }
        });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }
    
        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
            throw new Error('Something went wrong');
            }
    
            if (result === true) {
            return res.status(200).json({ success: true, message: "User logged in successfully", token: generateAccessToken(user.id, user.name)});
            } else {
            return res.status(400).json({ success: false, message: 'Password is incorrect' });
            }
        });
        } catch (error) {
        // Handle other errors
        res.status(500).json({ message: error.message, success: false });
        }
    }
module.exports = {
    signup,
    signin,
    generateAccessToken
}