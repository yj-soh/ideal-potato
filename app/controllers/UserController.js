'use strict';

const rfr = require('rfr');
const openid = require('openid');
const Db = rfr('app/models/db');
const Crawler = rfr('app/Crawler');

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
    config: {
      auth: {
        mode: 'try'
      }
    },
    handler: getUser
  });

  this.server.route({
    method: 'GET',
    path: '/games',
    handler: getOwnGames
  });

  this.server.route({
    method: 'GET',
    path: '/{userId}/games',
    handler: getUserGames
  });

  this.server.route({
    method: 'GET',
    path: '/friends',
    handler: getOwnFriends
  });

  this.server.route({
    method: 'GET',
    path: '/{userId}/friends',
    handler: getUserFriends
  });

  this.server.route({
    method: 'GET',
    path: '/login',
    config: {
      auth: {
        mode: 'try'
      }
    },
    handler: login
  });

  this.server.route({
    method: 'GET',
    path: '/login/verify',
    config: {
      auth: {
        mode: 'try'
      }
    },
    handler: verify
  });

  this.server.route({
    method: 'GET',
    path: '/logout',
    handler: logout
  });
};

const getUser = function (request, reply) {
  if (!request.auth.isAuthenticated) {
    return reply({success: false});
  }
  let user = request.auth.credentials.userId;
  reply({success: true, id: user});
};

const getOwnGames = function (request, reply) {
  request.params.userId = request.auth.credentials.userId;
  getUserGames(request, reply);
};

const getUserGames = function (request, reply) {
  Promise.all([
    Crawler.getUserOwnedGames(request.params.userId, false),
    Crawler.getUserWishlistGames(request.params.userId)
  ]).then(
      (games) => games[0] ? reply({
        owned: games[0],
        wishlist: games[1]
      }) : reply({private: true}),
      (err) => reply(err)
  );
};

const getOwnFriends = function (request, reply) {
  request.params.userId = request.auth.credentials.userId;
  getUserFriends(request, reply);
};

const getUserFriends = function (request, reply) {
  Crawler.getUserFriends(request.params.userId).then(
      (friends) => reply(friends || {private: true}),
      (err) => reply(err)
  );
};

const login = function (request, reply) {
  if (request.auth.isAuthenticated) {
    return reply.redirect('/');
  }

  this.relyingParty.authenticate(steamOpenIdUrl, false, function (err, authUrl) {
    if (err) {
      console.log(err);
      throw err;
    }

    reply.redirect(authUrl);
  });
};

const verify = function (request, reply) {
  if (request.auth.isAuthenticated) {
    return reply.redirect('/');
  }

  let claimedId = request.query['openid.claimed_id'];
  if (claimedId) {
    let id = claimedId.replace(steamOpenIdUrl + '/id/', '');
    request.cookieAuth.set({
      userId: id
    });

    // create new user if one doesn't exist
    Db.models.user.upsert({id: id});
  }

  reply.redirect('/');
};

const logout = function (request, reply) {
  request.cookieAuth.clear();
  reply.redirect('/');
};

const getUserFromSteam = function (userId) {

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
