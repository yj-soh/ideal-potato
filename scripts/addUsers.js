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



// Do nothing about non-existing "games" (e.g. mods)
Db.sync().then(createUsers).then(() => {
  return Db.models.game.findAll().then((allGames) => allGames.map((g) => g.id)).then((allGames) =>
      Promise.all(parse(FILE_USERS).map((user) => {
        if (!user.games.owned) {
          return;
        }

        let games = {};

        user.games.owned.forEach((game) => {
          games[game.id] = games[game.id] || {};
          games[game.id].owned = true;
          games[game.id].minutesPlayed = game.playtime.total
        });
        user.games.followed.forEach((game) => {
          games[game.id] = games[game.id] || {};
          games[game.id].followed = true;
        });
        user.games.wishlist.forEach((game) => {
          games[game.id] = games[game.id] || {};
          games[game.id].wishlist = true;
        });
        user.games.reviewed.forEach((game) => {
          games[game.id] = games[game.id] || {};
          games[game.id].reviewed = game.isPositive ? 'pos' : 'neg';
        });

        let userGameRecords = Object.keys(games).map((id) => {
          return {
            userId: user.user,
            gameId: parseInt(id),
            owned: games[id].owned,
            followed: games[id].followed,
            wishlist: games[id].wishlist,
            reviewed: games[id].reviewed,
            minutesPlayed: games[id].minutesPlayed
          };
        }).filter((r) => allGames.indexOf(r.gameId) > -1);

        return Db.models.userGames.bulkCreate(userGameRecords, {
          updateOnDuplicate: true
        });
      }))
  );
}).catch(console.log);
