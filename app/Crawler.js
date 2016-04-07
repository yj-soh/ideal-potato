'use strict';

const Promise = require('bluebird');
const http = require('http');
const rfr = require('rfr');

const config = rfr('config/SteamConfig');

const getProfile = (apiKey, userIds) =>
    `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${userIds}`;
const getOwnedGames = (apiKey, userId, includeInfo) =>
    `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${userId}&include_appinfo=${includeInfo ? 1 : 0}&include_played_free_games=1&format=json`;
const getFriends = (apiKey, userId) =>
    `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${apiKey}&steamid=${userId}&relationship=friend`;

function Crawler() {
  this.apiKey = config.apiKey;
}

const Class = Crawler.prototype;

Class.getUserProfile = function (userIds) {
  return processJsonRequest(getProfile(this.apiKey, Array.isArray(userIds) ? userIds.join(',') : userIds))
      .then((json) => json.response.players.map((user) => {
        return {
          id: user.steamid,
          name: user.personaname,
          url: user.profileurl,
          image: user.avatarfull,
          lastOnline: new Date(user.lastlogoff * 1000),
          isOnline: user.personastate !== 0,
          isPrivate: user.communityvisibilitystate === 1
        };
      }));
};

Class.getUserOwnedGames = function (userId, includeInfo) {
  return processJsonRequest(getOwnedGames(this.apiKey, userId, includeInfo))
      .then((json) => json.response.hasOwnProperty('game_count') ?
          json.response.games.map((game) => {
            let gameData = {
              id: game.appid,
              playtime: {
                total: game.playtime_forever,
                recent: game.playtime_2weeks || 0
              }
            };
            if (includeInfo) {
              gameData.img = {
                icon: game.img_icon_url,
                logo: game.img_icon_url
              };
            }
            return gameData;
          }) : false);
};

Class.getUserFriends = function (userId) {
  return processJsonRequest(getFriends(this.apiKey, userId))
      .then((json) => json.friendslist ?
          json.friendslist.friends.map((friend) => friend.steamid) :
          false);
};

const processJsonRequest = (url) =>
    new Promise((resolve, reject) => {
      http.get(url, (res) => {
        res.setEncoding('utf8');

        let json = '';
        res.on('data', (chunk) => {
          json += chunk;
        });
        res.on('end', () => resolve(JSON.parse(json)));
      }, (err) => {
        reject(err)
      });
    });

module.exports = new Crawler();
