angular.module('gameApp.controllers')
.controller('MainController', function ($scope) {
    'use strict'

    $scope.isLoggedIn = false;

    $scope.login = function () {
        $scope.isLoggedIn = true;
    };

    $scope.logout = function () {
        $scope.isLoggedIn = false;
    };
});
