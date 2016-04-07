angular.module('gameApp.controllers')
.controller('MainController', function ($scope, User) {
  'use strict'

  User.getLoggedInUser().success(function (response) {
    $scope.isLoggedIn = response.success;
  });
})
.controller('ProfileController', function ($scope, Game) {
  'use strict';

  Game.getAllGames().success(function (response) {
    $scope.gameList = response;
  });
});
