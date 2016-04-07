'use strict';

const rfr = require('rfr');
const openid = require('openid');
const Db = rfr('app/models/db');

const steamOpenIdUrl = 'http://steamcommunity.com/openid';

function UserController (server, options) {
  this.server = server;
  this.options = options;
  this.relyingParty = new openid.RelyingParty(
      server.info.uri + '/api/user/login/verify',
      server.info.uri, true, false, []
  );
}

const Class = UserController.prototype;

Class.registerRoutes = function () {
  this.server.route({
    method: 'GET',
    path: '/',
    handler: getUser
  });

  this.server.route({
    method: 'GET',
    path: '/login',
    handler: login
  });

  this.server.route({
    method: 'GET',
    path: '/login/verify',
    handler: verify
  });
};

const getUser = function (request, reply) {
  let r = 'test';
  reply(r);
};

const login = function (request, reply) {
  this.relyingParty.authenticate(steamOpenIdUrl, false, function (err, authUrl) {
    if (err) {
      console.log(err);
      throw err;
    }

    reply.redirect(authUrl);
  });
};

const verify = function (request, reply) {
  let claimedId = request.query['openid.claimed_id'];
  if (claimedId) {
    let id = claimedId.replace(steamOpenIdUrl + '/id/', '');

    console.log('Do something with this:', id);
  }

  reply.redirect('/');
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
