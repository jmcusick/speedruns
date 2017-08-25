'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.username = "";
  $scope.password = "";
  //$scope.alertBox = "hello"; // can't do this otherwise NO UPDATE in the view
  $scope.login = function() {
    console.log("Login");
    console.log("username: "+$scope.username);
    console.log("password: "+$scope.password);
    console.log("alertbox 1: "+$scope.alertBox);
    $scope.alertBox = "";
    console.log("alertbox 2: "+$scope.alertBox);
    
    $http({
      method: 'POST',
      url: 'http://ec2-13-59-191-87.us-east-2.compute.amazonaws.com:3000/login',
      data : {"username": $scope.username, "password": $scope.password}
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("success");
      $scope.username = "";
      $scope.password = "";
      $scope.alertBox = "Log in successful.";
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("failed");
      $scope.username = "";
      $scope.password = "";
      $scope.alertBox = "Username or password incorrect.";
      console.log("alertbox 3: "+$scope.alertBox);
    });
  };
}]);
