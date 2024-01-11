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
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require("aws-sdk");
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


const groupName = async (req, res, next) => {
  try {
    const group = await Group.create({
      name: req.params.groupName,
      UserId: req.user.id
    });
    await GroupUser.create({
      UserId: req.user.id,
      GroupId: group.id
    });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const removeMember = async (req, res) => {
  try {
    if (!req.query.memberId) {
      return res.status(400).send('Invalid request. Member ID is undefined.');
    }

    await GroupUser.destroy({
      where: { UserId: req.query.memberId, GroupId: req.query.groupId }
    });

    res.status(200).json({ Success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Success: false, error: 'Internal Server Error' });
  }
};

  

const getGroup = async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(400).send('Invalid request. User ID is undefined.');
    }

    const result = await raw.execute(`
      SELECT *
      FROM chatgroups cg
      JOIN GroupUsers gu ON cg.id = gu.GroupId
      WHERE gu.UserId = ${req.user.id}
    `);
  
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



const groupInfo = async (req, res) => {
  try {
    const result = await raw.execute(`
      SELECT cg.id AS groupid, cg.UserId AS admin, gu.UserId AS member
      FROM chatgroups cg
      JOIN GroupUsers gu ON cg.id = gu.GroupId
      WHERE cg.id = ${req.params.groupId}
    `);

    if (req.user.id == result[0][0].admin) {
      result[0].push(true);
    } else {
      result[0].push(false);
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) {
      return res.status(404).send('Group not found');
    }

    if (group.UserId === req.user.id) {
      await Chat.destroy({ where: { chatgroupId: req.params.groupId } });
      await GroupUser.destroy({ where: { GroupId: req.params.groupId } });
      await Group.destroy({ where: { id: req.params.groupId } });

      res.status(201).send('Group Deleted');
    } else {
      res.status(401).send('Not the admin.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

  const getUser = async (req, res) => {
    try {
      const result = await User.findByPk(req.params.UserId);
  
      if (!result) {
        return res.status(404).send('User not found');
      }
  
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  const inviteLink = async (req, res) => {
    try {
      const result = await raw.execute(`SELECT * FROM GroupUsers WHERE GroupId=${req.query.grpId} AND UserId=${req.user.id}`);
  
      if (!result[0][0]) {
        await GroupUser.create({
          UserId: req.user.id,
          GroupId: parseInt(req.query.grpId)
        });
        return res.status(200).json({ Success: "true" });
      } else {
        res.status(401).send('Already a member.');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  const postChat = async (req, res, next) => {
    try {
      const response = await Chat.create({
        chat: req.body.chat,
        UserId: req.user.id,
        chatgroupId: parseInt(req.body.chatgroupid)
      });
  
      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
  

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
  
AWS.config.update({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
    region: "ap-south-1",
});
const s3 = new AWS.S3();

  // const upload= async (req, res, next) => {
  //   fileData = JSON.stringify(req.body);
  //   let s3 = new AWS.S3({
  //     region: "ap-south-1",
  //     accessKeyId: process.env.IAM_USER_KEY,
  //     secretAccessKey: process.env.IAM_USER_SECRET,
  //   });
  //   s3.upload({
  //     Bucket: 'bucketexpensetracker',
  //     Key: `${req.user.name}Chat ${new Date()}.jpg`,
  //     Body: fileData,
  //     ACL: "public-read",
  //   }, (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       Upload.create({
  //         link: data.Location,
  //         UserId: req.user.id,
  //       });
  //       res.send(data);
  //     }
  //   });
  // }
   
//   const upload = multer({
//     limits: {
//       fileSize: 1024 * 1024 * 15, // 15 MB limit, adjust as needed
//   },
//     storage: multerS3({
//         s3: s3,
//         bucket: 'bucketexpensetracker',
//         acl: 'public-read',
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString() + '-' + file.originalname);
//         },
//     }),
// });
// const uploadImage = (req, res) => {
//   console.log(req.file); 
//   upload.single('image')(req, res, (err) => {
//       if (err) {
//           return res.status(500).json({ error: err.message });
//       }
//       const imageUrl = req.file.location;
//       Upload.create({
//                 link: req.file.location,
//                 UserId: req.user.id,
//               });

//       res.json({ imageUrl });
//   });
// };
const uploadImage = async (req, res) => {
  console.log(req.file)
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
      }

      // Upload file to S3
      const params = {
          Bucket: 'bucketexpensetracker',
          Key: `${Date.now()}-${req.file.originalname}`,
          Body: req.file.buffer,
          ACL: 'public-read',
      };

      const uploadResult = await s3.upload(params).promise();

      // Return the S3 URL
      const s3Url = uploadResult.Location;
      console.log("meaow", s3Url);
     await Upload.create({
      link: s3Url,
      UserId: req.user.id,
    });
      res.json({ imageUrl: s3Url });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const fetchBase= async (req, res) => {
    const s3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: process.env.IAM_USER_KEY,
      secretAccessKey: process.env.IAM_USER_SECRET,
    });
  
    const params = {
      Bucket: 'bucketexpensetracker',
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
    uploadImage,
    fetchBase,
   
}