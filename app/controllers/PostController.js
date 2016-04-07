'use strict';

const rfr = require('rfr');
const Db = rfr('app/models/db');

function PostController(server, options) {
  this.server = server;
  this.options = options;
}

const Class = PostController.prototype;

Class.registerRoutes = function () {
  this.server.route({
    method: 'GET',
    path: '/all',
    handler: getAllPosts
  });
};

const getAllPosts = function (request, reply) {
  Db.models.post.findAll({order: [['createdAt', 'DESC']]}).then(function (posts) {
    reply(posts);
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
