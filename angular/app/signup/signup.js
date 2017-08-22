'use strict';

angular.module('myApp.signup', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'signup/signup.html',
    controller: 'SignUpCtrl'
  });
}])

.controller('SignUpCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.username = "";
  $scope.password = "";
  $scope.register = function() {
    console.log("REGISTER");
    console.log("username: "+$scope.username);
    console.log("password: "+$scope.password);
    $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/register',
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