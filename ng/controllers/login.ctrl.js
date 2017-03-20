angular.module('app')
.controller('LoginCtrl', function($scope, UserSvc) {
  $scope.login = function(username) {
    UserSvc.login(username)
    .then(function(response) {
      $scope.$emit('login', response.data)
    })
  }
})
