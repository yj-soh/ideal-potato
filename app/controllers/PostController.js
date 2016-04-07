'use strict';

const rfr = require('rfr');
const Db = rfr('app/models/db');
const Crawler = rfr('app/Crawler');

function PostController(server, options) {
  this.server = server;
  this.options = options;
}

const Class = PostController.prototype;

Class.registerRoutes = function () {
  this.server.route([{
      method: 'GET',
      path: '/all',
      handler: getAllPosts
    }, {
      method: 'POST',
      path: '/add',
      handler: addPost
    }
  ]);
};

const getAllPosts = function (request, reply) {
  Db.models.post.findAll({order: [['createdAt', 'DESC']], include: [Db.models.game]}).then(function (posts) {
    var userIds = [];
    for (var i = 0; i < posts.length; i++) {
      userIds.push(posts[i].poster);
    }

    Crawler.getUserProfile(userIds).then(
      (user) => {
        for (var i = 0; i < posts.length; i++) {
          posts[i].dataValues.user = user[i];
        }
        console.log(posts);
        reply(posts);
      }
    );
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
