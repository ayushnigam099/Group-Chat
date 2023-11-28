require('dotenv').config();
const bcrypt = require('bcrypt');
const fs = require("fs");
const express= require('express');
const cors= require('cors')
const app = express();
const path= require('path')
const sequelize= require('./connection/database');

const User = require('./models/users');
const Chat = require('./models/chat');
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroup");

const userRoutes = require('./routes/users')
const chatRoutes= require('./routes/chat')
const groupRoutes = require("./routes/group");

app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5000",
  })
);
app.use('/user', userRoutes);
app.use('/chat',chatRoutes);
app.use("/group", groupRoutes);

User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
Chat.belongsTo(User);
Chat.belongsTo(Group);

User.hasMany(UserGroup);

Group.hasMany(Chat);
Group.hasMany(UserGroup);

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);


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