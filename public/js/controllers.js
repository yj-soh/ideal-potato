angular.module('gameApp.controllers')
.controller('MainController', function ($scope, User, Login) {
  'use strict'

  User.getLoggedInUser().success(function (response) {
    $scope.isLoggedIn = response.success;
    $scope.loggedInUser = response.id;
    Login.isLoggedIn = response.success;
    Login.userId = response.success ? response.id : '';
  });
})
.controller('ProfileController', function ($scope, $routeParams, $window, $anchorScroll, Game, User, Login, Post) {
  'use strict';

  $scope.hasError = true;
  $scope.isOwnProfile = false;

  $anchorScroll();

  if (!Login.isLoggedIn) return;

  User.getProfile($routeParams.user).success(function (response) {
    if (response.success) {
      $scope.user = response.data;
      $scope.hasError = false;

      if (Login.userId === $routeParams.user) {
        $scope.isOwnProfile =  true;
      }
    } else {
      $scope.errorMessage = response.error;
    }
  });

  $scope.addPost = function () {
    Post.add($scope.newPost).success(function (response) {
      if (response.success) {
        // focus on post list in profile
        $window.location.href = '#/profile/' + Login.userId + '#profile-post-list';
      } else {
        $scope.newPost.error = response.error;
      }
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
