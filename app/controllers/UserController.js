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
    path: '/{userId}/profile',
    handler: getUserProfile
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

const getUserProfile = function (request, reply) {
  Promise.all([
    Crawler.getUserProfile(request.params.userId),
    Crawler.getUserOwnedGames(request.params.userId, true)
  ]).then(function (data) {
    let users = data[0];
    if (users.length < 1) {
      return reply({success: false, error: 'User does not exist.'});
    }
    let user = users[0];
    let games = data[1];
    user.games = games;
    Db.models.post.findAll({where: {poster: request.params.userId}, order: [['createdAt', 'DESC']], include: [Db.models.game]}).then(function (posts) {
      user.posts = posts;
      reply({success: true, data: user});
    });
  });
};

const getOwnGames = function (request, reply) {
  request.params.userId = request.auth.credentials.userId;
  getUserGames(request, reply);
};

const getUserGames = function (request, reply) {
  Promise.all([
    Crawler.getUserOwnedGames(request.params.userId, false),
    Crawler.getUserFollowedGames(request.params.userId),
    Crawler.getUserWishlistGames(request.params.userId),
    Crawler.getUserReviewedGames(request.params.userId)
  ]).then((games) => {
    return games[0] ? {
      owned: games[0] || [],
      folllowed: games[1] || [],
      wishlist: games[2] || [],
      reviewed: games[3] || []
    } : {private: true}
  }).then((gameCategories) => {
    if (gameCategories.private) {
      return reply(gameCategories);
    }

    reply(gameCategories);

    let user = Db.models.user.findById(request.params.userId);

    Object.keys(gameCategories).forEach((category) => {
      gameCategories[category].forEach((game) => {
        let options = {};
        options[category] = true;
        options.minutesPlayed = game.playtime ? game.playtime.total : 0;

        user.then((u) => {
          if (u) {
            u.addGame(game.id, options);
          }
        });
      });
    });
  }).catch(console.log);
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

exports.register = function (server, options, next) {
  const userController = new UserController(server, options);
  server.bind(userController);
  userController.registerRoutes();
  next();
};

exports.register.attributes = {
  name: 'UserController'
};
