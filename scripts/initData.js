'use strict';

const rfr = require('rfr');
const Db = rfr('app/models/db');
const fs = require('fs');

const DIR_DATA = 'crawler/data/';
const FILE_TAGS = DIR_DATA + 'tags.json';
const FILE_GAMES = DIR_DATA + 'games_tagged.json';

const parse = (file) => JSON.parse(fs.readFileSync(file, {
  encoding: 'utf8'
}));

const tagRecords = parse(FILE_TAGS).map((tag) => {
  return {
    id: tag.tagid,
    name: tag.name
  }
});
const createTags = () => Db.models.tag.bulkCreate(tagRecords, {
  updateOnDuplicate: true
});

const playersMapping = {
  multiPlayer: 'multi',
  singlePlayer: 'single',
  coop: 'coop'
};
const gameRecords = parse(FILE_GAMES).map((game) => {
  return {
    id: parseInt(game.appid),
    name: game.title,
    image: null,
    players: playersMapping[game.players]
  }
});
const createGames = () => Db.models.game.bulkCreate(gameRecords, {
  updateOnDuplicate: true
});

Db.sync().then(() => Promise.all([createTags(), createGames()])).then(() =>
    Promise.all(parse(FILE_GAMES).map((game) => {
      return {
        id: parseInt(game.appid),
        tags: game.tags
      };
    }).map((game) => Db.models.game.findById(game.id).then((g) => g.setTags(game.tags))))
).then(() => {
  console.log('Finished - Data inserted.')
});
