require("dotenv").config();
const express=  require("express")
const app =express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path')
const jwt = require("jsonwebtoken");
const server = require('http').createServer(app)
var io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const AWS = require("aws-sdk");
const cron = require('cron');
const Sequelize = require("sequelize");

const User = require("./models/users");
const Chat = require("./models/chat");
const Group = require('./models/group')
const GroupUser = require('./models/groupUser')
const Upload = require('./models/upload')
const ArchivedChat = require('./models/archivedChat')
const sequelize = require("./connection/database");
const raw = require('./connection/rawdatabse')
const bcrypt = require("bcrypt");

const userRoutes = require('./routes/users')
const mainRoutes = require('./routes/group')

const { startCronJob } = require('./controllers/cron');

app.use(cors());


app.use(bodyParser.json({ limit: '10mb' }));
app.use('/user', userRoutes);

io.on("connection", (socket) => {
  socket.on('batman', (message) => {
    socket.broadcast.emit('renderChat', 'renderchat')
  })
})
app.use(mainRoutes);

app.use((req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, `./FRONTEND/${req.url}`))
})

startCronJob();

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(ArchivedChat);
ArchivedChat.belongsTo(User);

User.hasMany(Group)
Group.belongsTo(User)

Group.hasMany(Chat)
Chat.belongsTo(Group)

Group.hasMany(ArchivedChat)
ArchivedChat.belongsTo(Group)

User.hasMany(Upload)
Upload.belongsTo(User)

// Group.hasMany(GroupUser, { foreignKey: 'GroupId' });
// GroupUser.belongsTo(Group, { foreignKey: 'GroupId' });

// GroupUser.belongsTo(User, { foreignKey: 'UserId' });
// User.hasMany(GroupUser, { foreignKey: 'UserId' });

sequelize
  .sync()
  // .sync({force: true})
  .then((result) => {
    server.listen(3000)
  })
  .catch((err) => {
    console.log(err);
  });
