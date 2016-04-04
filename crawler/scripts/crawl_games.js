'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');
const Game = require('./game');

const FILE_PROGRESS = 'progress.txt';
const FILE_GAMES = '../data/games.txt';
const FILE_ERR = 'errors.txt';

const getGameListUrl = (page) => `http://store.steampowered.com/search/results?sort_by=Released_DESC&tags=-1&category1=998&page=${page}`;
const getGameUrl = (appid) => `http://store.steampowered.com/apphover/${appid}`;

let progress = {
  page: 1
};

const readProgress = (next) => {
  fs.readFile(FILE_PROGRESS, (err, data) => {
    if (err) throw err;
    progress = JSON.parse(data);
    if (next) next();
  });
};

const writeProgress = (next) => {
  fs.writeFile(FILE_PROGRESS, JSON.stringify(progress), (err) => {
    if (err) throw err;
    if (next) next();
  });
};

const processResponseHtml = (res, next) => {
  res.setEncoding('utf8');

  let html = '';
  res.on('data', (chunk) => {
    html += chunk;
  });
  res.on('end', () => next(html));

  return res;
};

const processGameList = () => {
  http.get(getGameListUrl(progress.page), (res) => {
    processResponseHtml(res, function getAppids(data) {
      let $ = cheerio.load(data);
      let ids = $('.search_result_row').map((i, e) => $(e).attr('data-ds-appid'))
                                       .get();

      processGames(chunk(ids, 5), () => {
        progress.page += 1;
        writeProgress(processGameList);
      });
    }).on('error', () => {
      storeError('Page: ' + progress.page);
    });
  })
};

const chunk = (arr, len) => {
  if (len === 0) return [];

  let endArr = [];
  for (let i = 0; i < arr.length; i += len) {
    endArr.push(arr.slice(i, i + len));
  }

  return endArr;
};

const processGames = (appids, next) => {
  if (appids.length === 0) return next();

  let curAppids = appids.pop();

  Promise.all(curAppids.map((id) => {
    processGame(id).then(storeGame).catch(storeError);
  })).then(() => {
    setTimeout(() => {
      processGames(appids, next)
    }, (() => 10000 + Math.random() * 20 * 1000)());
  });
};

const processGame = (appid) => new Promise((resolve, reject) => {
  console.log('page:', progress.page, '; appid:', appid);

  http.get(getGameUrl(appid), (res) => {
    processResponseHtml(res, function getGame(data) {
      let $ = cheerio.load(data);
      let title = $('h4').text();
      let playersImg = $('.category_icon').attr('src');
      if (playersImg) {
        // e.g. "http://store.akamai.steamstatic.com/public/images/v6/ico/ico_singlePlayer.png"
        let players = playersImg.substring(playersImg.lastIndexOf('ico_') + 4, playersImg.length - 4);
        let tags = $('.app_tag').map((i, e) => $(e).text()).get();

        resolve(new Game(appid, title, players, tags));
      } else {
        reject(appid);
      }
    }).on('error', () => {
      reject('Appid: ' + appid);
    });
  });
});

const storeGame = (game) => {
  fs.appendFile(FILE_GAMES, game.toString())
};
const storeError = (str) => {
  fs.appendFile(FILE_ERR, str + '\n')
};

readProgress();
processGameList();

