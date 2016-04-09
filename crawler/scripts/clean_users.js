'use strict';

const fs = require('fs');
const rfr = require('rfr');
const Db = rfr('app/models/db');

const FILE_GAMES = '../data/games_tagged.json';
const FILE_USERS = ['../data/usersanime.json',
  '../data/usersborderlands.json',
  '../data/userscounterstrike.json',
  '../data/userseurotruck.json',
  '../data/usersdota.json',
  '../data/userstf2.json'];
const FILE_USERS_CLEAN = '../data/users_clean.json';

let games = fs.readFileSync(FILE_GAMES, {
  encoding: 'utf8'
});
games = JSON.parse(games);

function getTags(gameId) {
  for (var i = 0; i < games.length; i++) {
    if (games[i].appid == gameId) {
      return games[i].tags;
    }
  }
  return [];
}

var allUsers = [];

FILE_USERS.forEach(function (file) {
  let users = fs.readFileSync(file, {
    encoding: 'utf8'
  });
  users = JSON.parse(users);

  for (var i = 0; i < users.length; i++) {
    for (var j = 0; j < users[i].games.length; j++) {
      users[i].games[j].tags = getTags(users[i].games[j].id);
    }
  }

  allUsers = allUsers.concat(users);
});

fs.writeFileSync(FILE_USERS_CLEAN, JSON.stringify(allUsers));
