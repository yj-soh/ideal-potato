'use strict';

angular.module('gameApp.services', []);

angular.module('gameApp.controllers', ['gameApp.services']);

var gameApp = angular.module('gameApp', [
    'ngRoute',
    'gameApp.controllers'
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
        otherwise({
            redirectTo: '/'
        });
});
