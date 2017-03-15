angular.module('app')
.controller('CardsCtrl', function($scope, CardsSvc) {
  CardsSvc.fetch().success(function(cards){
    $scope.cards1 = cards.splice(0,3)
    $scope.cards2 = cards.splice(0,3)
    $scope.cards3 = cards.splice(0,3)
  })
})

