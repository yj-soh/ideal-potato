angular.module('gameApp.controllers')
.controller('MainController', function ($scope, User, Login) {
  'use strict'

  User.getLoggedInUser().success(function (response) {
    $scope.isLoggedIn = response.success;
    Login.isLoggedIn = response.success;
    Login.userId = response.success ? response.id : '';
  });
})
.controller('ProfileController', function ($scope, $window, $anchorScroll, Game, Login, Post) {
  'use strict';

  $anchorScroll();

  if (!Login.isLoggedIn) return;

  Game.getAllGames().success(function (response) {
    $scope.gameList = response;
  });

  $scope.addPost = function () {
    Post.add($scope.newPost).success(function (response) {
      if (response.success)
        // focus on post list in profile
        $window.location.href = '#/profile#profile-post-list';
    });
  };
})
.controller('PostsController', function ($scope, Post, Login) {
  'use strict';

  if (!Login.isLoggedIn) return;

  Post.getAllPosts().success(function (response) {
    $scope.posts = response;
  });
});
