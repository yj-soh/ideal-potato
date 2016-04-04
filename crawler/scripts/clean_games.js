'use strict';

const fs = require('fs');

const FILE_GAMES = '../data/games.txt';
const FILE_GAMES_CLEANED = '../data/games_cleaned.json';

let data = fs.readFileSync(FILE_GAMES, {
  encoding: 'utf8'
});

let games = data.split('\n')
                .filter((l) => l)
                .map(JSON.parse)
                .map((g) => {
                  let eaIdx = g.tags.indexOf('Early Access');
                  if (eaIdx !== -1) {
                    let newG = Object.assign({}, g);
                    newG.tags.splice(eaIdx, 1);
                    newG.earlyAccess = true;
                    return newG
                  }
                  return g;
                })
                .sort((g1, g2) => g1.appid - g2.appid)
                .reduce((prev, curr) =>
                        prev.length === 0 || prev[prev.length - 1].appid !== curr.appid ? prev.concat(curr)
                            : prev,
                    []);

fs.writeFileSync(FILE_GAMES_CLEANED, JSON.stringify(games));