'use strict';

const fs = require('fs');
const rfr = require('rfr');
const UserService = rfr('app/services/UserService');

const FILE_USERS = '../../crawler/data/users_clean.json';
const FILE_USERS_RANKINGS = '../data/users_rankings.txt';
const FILE_USERS_RESULTS = '../data/users_results.json';

let read = (file) => fs.readFileSync(file, {
  encoding: 'utf8'
});
const parse = (file) => JSON.parse(read(file));

let isRelevant = (item, truth) => truth.indexOf(item) > -1;
const success = (ranking, truth) =>
    ranking.filter((r) => isRelevant(r, truth)).length > 0 ? 1 : 0;
const precision = (ranking, truth) =>
    ranking.filter((r) => isRelevant(r, truth)).length / ranking.length;
const recall = (ranking, truth) =>
    ranking.filter((r) => isRelevant(r, truth)).length / truth.length;
const averagePrecision = (ranking, truth) =>
    ranking.map((r, idx) => isRelevant(r, truth) ? precision(ranking.slice(0, idx + 1), truth) : 0)
           .reduce((x, y) => x + y, 0) / Math.min(ranking.length, truth.length);

const users = parse(FILE_USERS);
const userIds = users.map((u) => u.user);
const userRecs = read(FILE_USERS_RANKINGS).split('\n')
                                          .filter((l) => l)
                                          .map(JSON.parse);
const getUserRec = (id) => userRecs.filter((u) => u.user === id)[0].recommendations;

let len = 50;
let maxK = 10;

let done = [];
let results = {};
for (let i = 0; i < len; i++) {
  let max = users.length - 1;
  let min = 0;
  let idx = Math.floor(Math.random() * (max - min) + min);

  let testUser = users[idx];
  let testUserFriends = testUser.friends ? testUser.friends.filter((f) => userIds.indexOf(f) > -1) : false;
  let testUserRec = getUserRec(testUser.user);

  while (!testUserFriends || testUserFriends.length <= 10 || !testUserRec || done.indexOf(testUser.user) > -1) {
    idx = Math.floor(Math.random() * (max - min) + min);
    testUser = users[idx];
    testUserFriends = testUser.friends ? testUser.friends.filter((f) => userIds.indexOf(f) > -1) : false;
    testUserRec = getUserRec(testUser.user);
  }

  for (let k = 1; k <= maxK; k++) {
    results[k] = results[k] || {sAtK: 0, pAtK: 0, rAtK: 0, apAtK: 0};
    results[k].sAtK += success(testUserRec.slice(0, k), testUserFriends);
    results[k].pAtK += precision(testUserRec.slice(0, k), testUserFriends);
    results[k].rAtK += recall(testUserRec.slice(0, k), testUserFriends);
    results[k].apAtK +=  averagePrecision(testUserRec.slice(0, k), testUserFriends);
  }

  done.push(testUser.user);
}

results = Object.keys(results).map((i) => {
  return {
    sAtK: results[i].sAtK / len,
    pAtK: results[i].pAtK / len,
    rAtK: results[i].rAtK / len,
    apAtK: results[i].apAtK / len
  };
});

let resultsMap = {};
for (let i = 0; i < maxK; i++) {
  resultsMap[i + 1] = results[i];
}

fs.writeFileSync(FILE_USERS_RESULTS, JSON.stringify(resultsMap));
