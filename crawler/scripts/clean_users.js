'use strict';

const fs = require('fs');
const rfr = require('rfr');
const Db = rfr('app/models/db');

const FILE_USERS = ['../data/usersanime.txt',
  '../data/usersborderlands.txt',
  '../data/userscounterstrike.txt',
  '../data/userseurotruck.txt',
  '../data/userstf2.txt',
  '../data/usersdota.txt'];
const FILE_USERS_CLEAN = '../data/users_clean.json';

function getTags(gameId) {
  for (var i = 0; i < games.length; i++) {
    if (games[i].appid == gameId) {
      return games[i].tags;
    }
  }
  return [];
}

var allUsers = [];
var userIds = [];

function inArray(array, element) {
  return array.indexOf(element) !== -1;
}

FILE_USERS.forEach(function (file) {
  let users = fs.readFileSync(file, {
    encoding: 'utf8'
  });
  users = '[' + users.replace(/,\s*$/, '') + ']';
  users = JSON.parse(users);

  for (var i = 0; i < users.length; i++) {
    if (inArray(userIds, users[i].user)) {
      continue;
    }
    userIds.push(users[i].user);
    allUsers.push(users[i]);
  }
});

fs.writeFileSync(FILE_USERS_CLEAN, JSON.stringify(allUsers));
