'use strict';

const Promise = require('bluebird');
const http = require('http');
const rfr = require('rfr');

const config = rfr('config/SteamConfig');

const getOwnedGames = (apiKey, userId, includeInfo) =>
    `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${userId}&include_appinfo=${includeInfo ? 1 : 0}&include_played_free_games=1&format=json`;

function Crawler() {
  this.apiKey = config.apiKey;
}

const Class = Crawler.prototype;

Class.getUserOwnedGames = function (userId, includeInfo) {
  return processJsonRequest(getOwnedGames(this.apiKey, userId, includeInfo))
      .then((json) => {
        return json.response.games.map((game) => {
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
        });
      });
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