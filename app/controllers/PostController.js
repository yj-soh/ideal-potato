'use strict';

const rfr = require('rfr');
const Db = rfr('app/models/db');

function PostController(server, options) {
  this.server = server;
  this.options = options;
}

const Class = PostController.prototype;

Class.registerRoutes = function () {
  this.server.route([{
      method: 'GET',
      path: '/',
      handler: getAllPosts
    }, {
      method: 'POST',
      path: '/add',
      handler: addPost
    }
  ]);
};

const getAllPosts = function (request, reply) {
  Db.models.post.findAll({order: [['createdAt', 'DESC']], include: [Db.models.user]}).then(function (posts) {
    reply(posts);
  });
};

const addPost = function (request, reply) {
  // find game id using name
  Db.models.game.findAll({where: {
    name: request.payload.gameName
  }}).then(function (games) {
    if (games.length < 1) {
      return reply({success: false, error: 'Game does not exist'});
    }
    Db.models.post.create({
      poster: request.auth.credentials.userId,
      relatedGame: games[0].id,
      content: request.payload.content
    }).then(function () {
      return reply({success: true});
    });
  });
};

exports.register = function (server, options, next) {
  const postController = new PostController(server, options);
  server.bind(postController);
  postController.registerRoutes();
  next();
};

exports.register.attributes = {
  name: 'PostController'
};
