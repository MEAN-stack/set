angular.module('app')
.controller('ApplicationCtrl', function($scope, $location) {
  $scope.username = ""

  $scope.$on('login', function(_, user) {
    $scope.username = user.username
  })

  $scope.practise = function() {
    $location.path( "/practise" )
  }
})
