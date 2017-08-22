'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.username = "";
  $scope.password = "";
  $scope.login = function() {
    console.log("Login");
    console.log("username: "+$scope.username);
    console.log("password: "+$scope.password);
    $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/login',
      data : {"username": $scope.username, "password": $scope.password}
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("success");
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("failed");
    });
  };
}]);