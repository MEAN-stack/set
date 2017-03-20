angular.module('app')
.controller('ApplicationCtrl', function($scope, $location) {
  $scope.username = ""

  $scope.practise = function() {
    $location.path( "/practise" )
  }
})
