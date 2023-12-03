const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sequelize = require("sequelize");
const { Op } = require('sequelize');
const raw = require('../connection/rawdatabse')
const sequelize = require("../connection/database");
const User = require("../models/users");
const Chat = require("../models/chat");
const Group = require('../models/group')
const GroupUser = require('../models/groupUser')
const Upload = require('../models/upload')
var io = require('socket.io')(5000, {
  cors: {
    origin: '*',
  }
});
io.on("connection", (socket) => {
  socket.on('batman', (message) => {
    socket.broadcast.emit('renderChat', 'renderchat')
  })
})


const groupName= async(req, res, next) => {
    Group.create({
      name: req.params.groupName,
      UserId: req.user.id
    }).then((result) => {
      GroupUser.create({
        UserId: req.user.id,
        GroupId: result.id
      })
      res.json(result)
    }).catch((err) => {
      console.log(err);
    });
}

const removeMember= async(req, res) => {
  if (!req.query.memberId) {
    return res.status(400).send('Invalid request. Member ID is undefined.');
  }
    GroupUser.destroy({ where: { UserId: req.query.memberId, GroupId: req.query.groupId } })
    res.status(200).json({Success: "true"})
  }
  

const getGroup= async(req, res) => {
  if (!req.user.id) {
    return res.status(400).send('Invalid request. User ID is undefined.');
  }
    raw.execute(`SELECT *
                FROM chatgroups cg
                JOIN GroupUsers gu
                ON cg.id=gu.GroupId
                WHERE gu.UserId=${req.user.id}`)
      .then((result) => {
        res.json(result[0])
      }).catch((err) => {
        res.status(500).send('Internal Server Error');
        console.log(err);
      });
  }


const groupInfo= async(req, res) => {
    raw.execute(`SELECT cg.id AS groupid, cg.UserId AS admin, gu.UserId AS member
      FROM chatgroups cg
      JOIN GroupUsers gu
      ON cg.id=gu.GroupId
      WHERE cg.id=${req.params.groupId}`).then((result) => {
      if (req.user.id == result[0][0].admin) {
        result[0].push(true)
      } else {
        result[0].push(false)
      }
      res.status(200).json(result[0])
  
    }).catch((err) => {
      console.log(err);
    });
  }


const deleteGroup= async(req, res) => {
    Group.findByPk(req.params.groupId).then((result) => {
      if (result.UserId == req.user.id) {
        Chat.destroy({ where: { chatgroupId: req.params.groupId } })
        GroupUser.destroy({ where: { GroupId: req.params.groupId } })
        Group.destroy({ where: { id: req.params.groupId } })
        res.status(201).send('Group Deleted')
      } else {
        res.status(401).send('Not the admin.')
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  const getUser= async(req, res) => {
    User.findByPk(req.params.UserId)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const inviteLink= async(req, res) => {
    try {
      const result = await raw.execute(`SELECT * FROM GroupUsers WHERE GroupId=${req.query.grpId} AND UserId=${req.user.id}`);
      
      if (!result[0][0]) {
        await GroupUser.create({
          UserId: req.user.id,
          GroupId: parseInt(req.query.grpId)
        });
      return res.status(200).json({Success: "true"});
      } else {
        res.status(401).send('Already a member.');
      }
    } catch (err) {
      console.log(err);
    }
    
  }

  const postChat= async(req, res, next) => {
                                                    // 
    Chat.create({
      chat: req.body.chat,
      UserId: req.user.id,
      chatgroupId: parseInt(req.body.chatgroupid)
    })
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getChat = async (req, res, next) => {
    try {
      if (req.query.MessageId === 'undefined') {
        const result = await raw.execute(`
          SELECT *
          FROM Chats c
          WHERE chatgroupId=${req.query.GroupId}
        `);
        res.json(result[0]);
      } else {
        const result = await Chat.findAll({ where: { chatgroupId: req.query.GroupId } });
  
        if (result) {
          lastLSId = req.query.MessageId;
          lastId = result.slice(-1)[0].id;
  
          if (lastLSId < lastId) {
            res.json(result.slice(lastLSId, lastId));
          }
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


  const upload= async (req, res, next) => {
    fileData = JSON.stringify(req.body);
    let s3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: process.env.IAM_USER_KEY,
      secretAccessKey: process.env.IAM_USER_SECRET,
    });
    s3.upload({
      Bucket: "group-chat-ss-s3",
      Key: `${req.user.name}Chat ${new Date()}.txt`,
      Body: fileData,
      ACL: "public-read",
    }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        Upload.create({
          link: data.Location,
          UserId: req.user.id,
        });
        res.send(data);
      }
    });
  }

const fetchBase= async (req, res) => {
    const s3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  
    const params = {
      Bucket: "group-chat-ss-s3",
      Key: req.params.txt,
    };
  
    s3.getObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send(Buffer.from(data.Body, 'base64').toString());
      }
    });
  }


module.exports = {
    groupName,
    removeMember,
    getGroup,
    groupInfo,
    deleteGroup,
    getUser,
    inviteLink,
    postChat,
    getChat,
    upload,
    fetchBase,
   
}