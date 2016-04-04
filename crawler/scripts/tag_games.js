'use strict';

const fs = require('fs');

const FILE_GAMES_CLEANED = '../data/games_cleaned.json';
const FILE_TAGS = '../data/tags.json';
const FILE_GAMES_TAGGED = '../data/games_tagged.json';

let data = JSON.parse(fs.readFileSync(FILE_GAMES_CLEANED, {
  encoding: 'utf8'
}));

let tags = {};
JSON.parse(fs.readFileSync(FILE_TAGS, {
  encoding: 'utf8'
})).forEach((t) => tags[t.name] = t.tagid);

let games = data.map((g) => {
  g.tags = g.tags.map((t) => tags[t] ? tags[t] : t)
                 .sort((t1, t2) => t1 - t2);
  return g;
});

fs.writeFileSync(FILE_GAMES_TAGGED, JSON.stringify(games));
