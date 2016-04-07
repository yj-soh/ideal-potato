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
.factory('Post', function ($http) {
  'use strict';

  function Post() {}

  Post.add = function (postData) {
    return $http({
      method: 'POST',
      url: '/api/post/add',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: $.param(postData)
    });
  };

  return Post;
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
})
.factory('Login', function () {
  var loggedInUser = {
    isLoggedIn: false,
    userId: ''
  };
  return loggedInUser;
});
