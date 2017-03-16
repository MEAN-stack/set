angular.module('app')
.controller('CardsCtrl', function($scope, CardsSvc, $timeout) {
  $scope.cards = []
  $scope.score = 0
  $scope.set = []

  CardsSvc.fetch().success(function(cards){
    $scope.cards.push(cards.splice(0,4))
    $scope.cards.push(cards.splice(0,4))
    $scope.cards.push(cards.splice(0,4))
  })

  $scope.click = function(row, col) {
    $scope.cards[row][col].selected = !$scope.cards[row][col].selected
    var result = checkSet()
    if (result==1) {
      $timeout(function(){clearSelections(true)}, 1000)
    }
    else if (result==-1) {
      $timeout(function(){clearSelections(false)}, 1000)
    }
  }

  var checkSet = function() {
    var shape = 0;
    var number = 0;
    var fill = 0;
    var color = 0;
    var count = 0;
    
    $scope.set = []

    for (var row=0; row<3; row++) {
      for (var col=0; col<$scope.cards[row].length; col++) {
        var card = $scope.cards[row][col]
        if (card.selected) {
          $scope.set.push(card)
          count++
          shape += card.shape
          number += card.number
          fill += card.fill
          color += card.color
          if (count==3) {
            shape %= 3
            number %= 3
            fill %= 3
            color %= 3
            if (shape===0 && number===0 && fill===0 && color===0) {
              $scope.score++
              return 1
            }
            else {
              $scope.score--
            }
            return -1
          }
        }
      }
    }
    return 0
  }

  var clearSelections = function(hide) {
    for (var row=0; row<3; row++) {
      for (var col=0; col<$scope.cards[row].length; col++) {
        var card = $scope.cards[row][col]
        card.selected = false
      }
    }
    if (hide) {
      hideImages()
    }
  }

  var hideImages = function() {
    for (var i=0; i<$scope.set.length; i++) {
      $scope.set[i].image = '/blank.png'
    }
  }

})
