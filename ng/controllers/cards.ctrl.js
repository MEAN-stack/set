angular.module('app')
.controller('CardsCtrl', function($scope, CardsSvc, $timeout) {
  $scope.deck = []
  $scope.cards = []
  $scope.score = 0
  $scope.set = []

  CardsSvc.fetch().success(function(deck){
    // fetch the whole deck
    $scope.deck = deck
    // deal three rows of four cards
    $scope.cards.push(deck.splice(0,4))
    $scope.cards.push(deck.splice(0,4))
    $scope.cards.push(deck.splice(0,4))
  })

  // change the css for the clicked card
  $scope.click = function(row, col) {
    $scope.cards[row][col].selected = !$scope.cards[row][col].selected
    // do we have a set of three?
    var result = checkSet()
    if (result==1) {
      // set found
      $timeout(function() {
        clearSelections()
        removeSet()
      }, 500)
    }
    else if (result==-1) {
      // not a set
      $timeout(function() {
        clearSelections()
      }, 500)
    }
  }

  $scope.deal = function() {
    if ($scope.deck.length >= 3) {
//      if (($scope.cards[0].length >=4 ) && ($scope.cards[1].length >= 4) && ($scope.cards[2].length >= 4)) {
        // deal one card in each row
        $scope.cards[0].push($scope.deck.splice(0,1)[0])
        $scope.cards[1].push($scope.deck.splice(0,1)[0])
        $scope.cards[2].push($scope.deck.splice(0,1)[0])
//      }
//      else {
//        for (var row=0; row<3; row++) {
//          while ($scope.cards[row].length < 4) {
//            $scope.cards[row].push($scope.deck.splice(0,1)[0])
//          }
//        }
//      }
    }
  }

  var checkSet = function() {
    var shape = 0
    var number = 0
    var fill = 0
    var color = 0
    var count = 0
    
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

  // clear the css .selected class for all cards
  var clearSelections = function() {
    for (var row=0; row<3; row++) {
      for (var col=0; col<$scope.cards[row].length; col++) {
        var card = $scope.cards[row][col]
        card.selected = false
      }
    }
  }

  // remove the current set and deal three more cards
  var removeSet = function() {
    // remove the set
    for (var row=0; row<3; row++) {
      for (var col=$scope.cards[row].length-1; col>=0; col--) {
        var card = $scope.cards[row][col]
        if ((card == $scope.set[0]) || (card == $scope.set[1]) || (card == $scope.set[2])) {
          $scope.cards[row].splice(col, 1)
        }
      }
    }
    var cardCount = $scope.cards[0].length + $scope.cards[1].length + $scope.cards[2].length
    if (cardCount < 12) {
      $scope.deal()
    }
  }

})
