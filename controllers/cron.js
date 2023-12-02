const Sequelize = require("sequelize");
const raw = require('../connection/rawdatabse')
const sequelize = require("../connection/database");
const ArchivedChat= require("../models/archivedChat");
const cron = require('cron');

const runCronJob = async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const date = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${date}`;

  console.log(formattedDate);
  console.log('Cron Job executed');

  try {
    const result = await raw.execute(`SELECT * FROM Chats WHERE createdAt<'${formattedDate}'`);
    
    if (result[0][0]) {
      result[0].forEach(element => {
        ArchivedChat.create({
          id: element.id,
          chat: element.chat,
          UserId: element.UserId,
          chatgroupId: element.chatgroupId
        });
      });
    }

    await raw.execute(`DELETE FROM Chats WHERE createdAt<'${formattedDate}'`);
  } catch (err) {
    console.log(err);
  }
};

const startCronJob = () => {
  const cronJob = new cron.CronJob('* * * * *', runCronJob);
  cronJob.start();
};

module.exports = {
  startCronJob,
};
