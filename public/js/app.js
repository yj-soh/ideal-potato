'use strict';

angular.module('gameApp.services', []);

angular.module('gameApp.controllers', ['gameApp.services']);

var gameApp = angular.module('gameApp', [
  'ngRoute',
  'gameApp.controllers',
  'monospaced.elastic',
  'angular-loading-bar',
  'angularMoment'
]);

gameApp.config(function($routeProvider) {
  'use strict';

  $routeProvider.
  when('/', {
    templateUrl: 'partials/main.html'
  }).
  when('/findfriends', {
    templateUrl: 'partials/findfriends.html'
  }).
  when('/profile', {
    templateUrl: 'partials/profile.html',
    controller: 'ProfileController'
  }).
  when('/posts', {
    templateUrl: 'partials/posts.html',
    controller: 'PostsController'
  }).
  otherwise({
    redirectTo: '/'
  });
});
