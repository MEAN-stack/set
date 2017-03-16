angular.module('app')
.controller('CardsCtrl', function($scope, CardsSvc) {
  CardsSvc.fetch().success(function(cards){
    $scope.cards1 = cards.splice(0,3)
    $scope.cards2 = cards.splice(0,3)
    $scope.cards3 = cards.splice(0,3)
  })

  $scope.click = function(row, col) {
    if (row==0) {
      $scope.cards1[col].selected = !$scope.cards1[col].selected
    }
    else if (row==1) {
      $scope.cards2[col].selected = !$scope.cards2[col].selected
    }
    else if (row==2) {
      $scope.cards3[col].selected = !$scope.cards3[col].selected
    }
  }
})
