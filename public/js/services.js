angular.module('gameApp.services')
.factory('Game', function ($http) {
  'use strict';

  function Game() {}

  Game.getAllGames = function () {
    return $http({
      method: 'GET',
      url: '/api/game/all'
    });
  };

  return Game;
})
.factory('User', function ($http) {
  'use strict';

  function User() {}

  User.getLoggedInUser = function () {
    return $http({
      method: 'GET',
      url: '/api/user'
    });
  };

  return User;
});
