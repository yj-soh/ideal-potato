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
});
