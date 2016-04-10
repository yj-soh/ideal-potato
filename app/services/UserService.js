'use strict';

const rfr = require('rfr');
const Db = rfr('app/models/db');
const Crawler = rfr('app/Crawler');
const Recommender = rfr('app/recommender/recommender');

function UserService () {}

const Class = UserService.prototype;

Class.getRecommendations = function (userId, numRecommendation) {
  let userGameIncludes = [{
    model: Db.models.game,
    through: {attributes: ['playtime']}
  }];

  let userGames = Db.models.user.findById(userId, {
    include: userGameIncludes
  });

  let usersGames = Db.models.user.findAll({
    where: {id: {ne: userId}},
    include: userGameIncludes
  });

  return Promise.all([userGames, usersGames]).then((userGames) => {
    let user = {
      userId: userGames[0].id,
      games: userGames[0].games
    };

    let users = userGames[1].map((u) => {
      return {
        userId: u.id,
        games: u.games
      };
    });

    // construct an array of unique game ids obtained from all users (incl. requested user)
    let allGames = Array.from(new Set(userGames[1].concat(userGames[0]).map((u) => u.games.map((g) => g.id)).reduce((x, y) => x.concat(y))));

    return Db.models.gameTags.findAll({
      where: {gameId: allGames}
    }).then((gameTags) => {

      let gameTagMap = {};
      gameTags.forEach((gameTag) => {
        gameTagMap[gameTag.gameId] = gameTagMap[gameTag.gameId] || [];
        gameTagMap[gameTag.gameId].push(gameTag.tagId);
      });

      // format into something usable by Recommender.buildTopicsVector
      let formatUserGames = (u) => u.games.map((g) => {
        return {
          playtime: g.userGames.playtime,
          tags: gameTagMap[g.id] || []
        };
      });

      let recommendations = Recommender.recommend(
          Recommender.buildTopicsVector(formatUserGames(user)),
          users.map(formatUserGames).map((g) => Recommender.buildTopicsVector(g))
      );

      return recommendations.slice(0, numRecommendation).map((r) => users[r.index].userId);
    });
  }).catch(console.log);
};

Class.getProfile = function (userId) {
  return Promise.all([
    Crawler.getUserProfile(userId),
    Crawler.getUserOwnedGames(userId, true)
  ]).then(function (data) {
    let users = data[0];
    if (users.length < 1) {
      return {success: false, error: 'User does not exist.'};
    }
    let user = users[0];
    let games = data[1];
    user.games = games;

    return Db.models.post.findAll({
      where: {poster: userId},
      order: [['createdAt', 'DESC']],
      include: [Db.models.game]
    }).then(function (posts) {
      user.posts = posts;
    }).then(() => {
      return {success: true, data: user};
    });
  });
};

Class.getGames = function (userId) {
  return Promise.all([
    Crawler.getUserOwnedGames(userId, false),
    Crawler.getUserFollowedGames(userId),
    Crawler.getUserWishlistGames(userId),
    Crawler.getUserReviewedGames(userId)
  ]).then((games) => {
    return games[0] ? {
      owned: games[0] || [],
      followed: games[1] || [],
      wishlist: games[2] || [],
      reviewed: games[3] || []
    } : {private: true}
  }).then((gameCategories) => {
    if (gameCategories.private) {
      return gameCategories;
    }

    return Db.models.game.findAll().then((allGames) => allGames.map((g) => g.id)).then((allGames) => {
      let games = {};

      gameCategories.owned.forEach((game) => {
        games[game.id] = games[game.id] || {};
        games[game.id].owned = true;
        games[game.id].playtime = game.playtime.total
      });
      gameCategories.followed.forEach((game) => {
        games[game.id] = games[game.id] || {};
        games[game.id].followed = true;
      });
      gameCategories.wishlist.forEach((game) => {
        games[game.id] = games[game.id] || {};
        games[game.id].wishlist = true;
      });
      gameCategories.reviewed.forEach((game) => {
        games[game.id] = games[game.id] || {};
        games[game.id].reviewed = game.isPositive ? 'pos' : 'neg';
      });

      let userGameRecords = Object.keys(games).map((id) => {
        return {
          userId: userId,
          gameId: parseInt(id),
          owned: games[id].owned,
          followed: games[id].followed,
          wishlist: games[id].wishlist,
          reviewed: games[id].reviewed,
          playtime: games[id].playtime
        };
      }).filter((r) => allGames.indexOf(r.gameId) > -1);

      return Db.models.userGames.bulkCreate(userGameRecords, {
        updateOnDuplicate: true
      }).then(() => gameCategories);
    });
  }).catch(console.log);
};

Class.getFriends = function (userId) {
  return Crawler.getUserFriends(userId).then(
      (friends) => friends || {private: true},
      (err) => err
  );
};

module.exports = new UserService();
