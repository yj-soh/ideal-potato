'use strict';

function UserController (server, options) {
  this.server = server;
  this.options = options;
}

const Class = UserController.prototype;

Class.registerRoutes = function () {
  this.server.route({
    method: 'GET',
    path: '/',
    handler: getUser
  })
};

const getUser = function (request, reply) {
  let r = 'test';
  reply(r); 
};

exports.register = function (server, options, next) {
  const userController = new UserController(server, options);
  server.bind(userController);
  userController.registerRoutes();
  next();
};

exports.register.attributes = {
  name: 'UserController'
};
