var app = angular.module('LunoManager', ['ngResource', 'ngSanitize']);

app.controller('LunoManagerController', function ($scope, $http, $resource, $timeout) {
    $scope.exchangePrices = [];

    refreshExchangePrices();

    function refreshExchangePrices() {
        $http.get("/crypto/exchange-prices")
            .then(function (response) {
                console.log(response);
                $scope.exchangePrices = response.data;
                setTimeout(refreshExchangePrices, 10500);
            });
    }

});