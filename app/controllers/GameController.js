'use strict';

const rfr = require('rfr');
const Db = rfr('app/models/db');

function GameController(server, options) {
  this.server = server;
  this.options = options;
}

const Class = GameController.prototype;

Class.registerRoutes = function () {
  this.server.route({
    method: 'GET',
    path: '/all',
    handler: getAllGames
  });
};

const getAllGames = function (request, reply) {
  Db.models.game.findAll({attributes: ['id', 'name'], order: [['name', 'ASC']]}).then(function (games) {
    reply(games);
  });
};

exports.register = function (server, options, next) {
  const gameController = new GameController(server, options);
  server.bind(gameController);
  gameController.registerRoutes();
  next();
};

exports.register.attributes = {
  name: 'GameController'
};
