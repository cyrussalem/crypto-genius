var app = angular.module('LunoManager', ['ngResource', 'ngSanitize']);

app.controller('LunoManagerController', function($scope, $resource, $timeout) {
    $scope.bitcoinPrice = "R2000000";
});