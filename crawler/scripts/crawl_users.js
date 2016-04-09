'use strict';

const FILE_USERS = '../data/users.json';
const rfr = require('rfr');
const config = rfr('config/SteamConfig');
const util = require('util');
const request = require('sync-request');
const Db = rfr('app/models/db');
const fs = require('fs');

// anime, borderlands, counter strike, euro truck, dota, tf2
var users = ['76561198102534398', '76561198198104519', '76561198254871104', '76561198086728625', '76561198126924860', '76561198060934132'];
const numUsersToCrawl = 500;
var numUsersCrawled = 0;
var crawledData = [];
var crawledUsers = [];

function inArray(array, element) {
  return array.indexOf(element) !== -1;
}

function getUserData(userId) {
  var profileUrl = util.format('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=%s&steamids=%s', config.apiKey, userId);
  var friendListUrl = util.format('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=%s&steamid=%s&relationship=friend', config.apiKey, userId);
  var gameListUrl = util.format('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=%s&steamid=%s&include_played_free_games=1&format=json', config.apiKey, userId);

  var profile = JSON.parse(request('GET', profileUrl).getBody());
  if (profile.response.players[0].communityvisibilitystate === 1) { // private profile
    return false;
  }

  try {
    var friends = JSON.parse(request('GET', friendListUrl).getBody());
    friends = friends.friendslist.friends.map((friend) => friend.steamid);
    var games = JSON.parse(request('GET', gameListUrl).getBody());
    games = games.response.games.map((game) => {
      let gameData = {
        id: game.appid,
        playtime: {
          total: game.playtime_forever,
          recent: game.playtime_2weeks || 0
        }
      };
      return gameData;
    });

    return {user: userId, games: games, friends: friends};
  } catch (err) {
    console.log(err);
    console.log(friendListUrl);
    console.log(gameListUrl);
    return false;
  }
}

while (users.length > 0 && numUsersCrawled < numUsersToCrawl) {
  var userId = users.shift();

  if (inArray(crawledUsers, userId)) {
    continue;
  }

  console.log('Crawling: ' + userId);
  var userData = getUserData(userId);

  if (!userData) continue;

  crawledData.push(userData);
  crawledUsers.push(userId);
  users = users.concat(userData.friends);
  numUsersCrawled++;
}

fs.writeFile(FILE_USERS, JSON.stringify(crawledData));
