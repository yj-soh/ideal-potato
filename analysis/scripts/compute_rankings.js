'use strict';

const fs = require('fs');
const rfr = require('rfr');
const UserService = rfr('app/services/UserService');

const FILE_USERS_CLEAN = '../../crawler/data/users_clean.json';
const FILE_USERS_RANKINGS = '../data/users_rankings.txt';

let read = (file) => fs.readFileSync(file, {
  encoding: 'utf8'
});
const parse = (file) => JSON.parse(read(file));

const getAllRecommendations = (userId) => UserService.getRecommendations(userId, Number.MAX_SAFE_INTEGER, true);

let doneUsers = read(FILE_USERS_RANKINGS).split('\n')
                                         .filter((l) => l)
                                         .map(JSON.parse)
                                         .map((ur) => ur.user);

let processUsers = (users, cb) => {
  if (users.length === 0) return cb();

  let user = users.pop();
  getAllRecommendations(user.user).then((rec) => {
    console.log(`Recommended for ${user.user}...`);
    fs.appendFile(FILE_USERS_RANKINGS, JSON.stringify({
          user: user.user,
          recommendations: rec
        }) + '\n', () => {
      processUsers(users, cb);
    });
  }).catch(console.log);
};

let undoneUsers = parse(FILE_USERS_CLEAN).filter((user) => doneUsers.indexOf(user.user) === -1);
processUsers(undoneUsers, () => {
  console.log('All done!');
});
