'use strict';

const rfr = require('rfr');
const Db = rfr('app/models/db');
const fs = require('fs');

const DIR_DATA = 'crawler/data/';
const FILE_USERS = DIR_DATA + 'users_clean.json';

const parse = (file) => JSON.parse(fs.readFileSync(file, {
  encoding: 'utf8'
}));

const userRecords = parse(FILE_USERS).map((user) => {
  return {
    id: user.user,
    public: true
  }
});
const createUsers = () => Db.models.user.bulkCreate(userRecords, {
  updateOnDuplicate: true
});

// logs and does nothing about non-existing "games" (e.g. mods)
Db.sync().then(createUsers).then(() =>
    Promise.all(parse(FILE_USERS).map((user) => Db.models.user.findById(user.user).then((u) => Promise.all(
      user.games.map((game) => u.addGame(game.id, {
        owned: true,
        minutesPlayed: game.playtime.total
      })).concat(u.setFriends(user.friends))
    ))))
).catch(console.log).then(() => {
  console.log('Finished - Data inserted.')
}).catch(console.log);
