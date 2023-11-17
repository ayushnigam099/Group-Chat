require('dotenv').config();
const bcrypt = require('bcrypt');
const fs = require("fs");
const express= require('express');
const cors= require('cors')
const app = express();
const path= require('path')
const sequelize= require('./connection/database');
const bodyParser = require('body-parser');

const Users = require('./models/users');
const userRoutes = require('./routes/users')

app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);



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