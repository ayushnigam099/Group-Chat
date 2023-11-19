require('dotenv').config();
const bcrypt = require('bcrypt');
const fs = require("fs");
const express= require('express');
const cors= require('cors')
const app = express();
const path= require('path')
const sequelize= require('./connection/database');

const Users = require('./models/users');
const Chat = require('./models/chat');

const userRoutes = require('./routes/users')
const chatRoutes= require('./routes/chat')

app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5000",
  })
);
app.use('/user', userRoutes);
app.use('/chat',chatRoutes);

Users.hasMany(Chat);
Chat.belongsTo(Users);



sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(4400, ()=>
{
    console.log("Server Is Started!");
})})
  .catch(err => {
    console.log(err);
});