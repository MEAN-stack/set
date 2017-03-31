angular.module('app')
.controller('CardsCtrl', function($scope, $routeParams, CardsSvc, GamesSvc, $timeout) {
  $scope.deck = []
  $scope.cards = []
  $scope.score = 0
  $scope.set = []
  $scope.game = null
  $scope.players = []
  $scope.practise = false
  
  $scope.gameId = $routeParams.gameid
  if ($scope.gameId) {
    // this is a multi-player game
    // the shuffled deck is inside the game object 
    $scope.practise = false
    GamesSvc.fetchGame($scope.gameId).then(function(response){
      $scope.game = response.data
      $scope.deck = response.data.cards
      // deal three rows of four cards
      $scope.cards.push($scope.deck.splice(0,4))
      $scope.cards.push($scope.deck.splice(0,4))
      $scope.cards.push($scope.deck.splice(0,4))
      
      $scope.myGame = ($scope.game.owner===$scope.username)
      for (var i=0; i < $scope.game.players.length; i++) {
        $scope.players.push({
          username: $scope.game.players[i],
          score: 0
        })
      }
    },
    function(error) {
      console.log('Promise error: '+error.message)
    })
  }
  else {
    // this is a practise game
    // fetch the deck via the http api
    $scope.practise = true
    CardsSvc.fetch().then(function(response){
      // fetch the whole deck
      $scope.deck = response.data
      // deal three rows of four cards
      $scope.cards.push($scope.deck.splice(0,4))
      $scope.cards.push($scope.deck.splice(0,4))
      $scope.cards.push($scope.deck.splice(0,4))
    },
    function(error) {
      console.log('Promise error: '+error.message)
    })
  }
  
  // change the css for the clicked card
  $scope.click = function(row, col) {
    $scope.cards[row][col].selected = !$scope.cards[row][col].selected
    // do we have a set of three?
    var result = checkSet()
    if (result===1) {
      // set found
      if ($scope.practise) {
        $timeout(function() {
          clearSelections()
          removeSet()
        }, 500)
      }
      else {
        GamesSvc.submitSet($scope.gameId, $scope.set).then(function(response){
        },
        function(error) {
          console.log('Promise error: '+error.message)
        })
        $timeout(function() {
          clearSelections()
        }, 500)
      }
    }
    else if (result===-1) {
      // not a set
      $timeout(function() {
        clearSelections()
      }, 500)
    }
  }

  $scope.deal = function() {
    if ($scope.practise) {
      if ($scope.deck.length >= 3) {
        $scope.cards[0].push($scope.deck.splice(0,1)[0])
        $scope.cards[1].push($scope.deck.splice(0,1)[0])
        $scope.cards[2].push($scope.deck.splice(0,1)[0])
      }
    }
    else {
      GamesSvc.deal($scope.gameId).then(function(response){
      },
      function(error) {
        console.log('Promise error: '+error.message)
      })
    }
  }

  $scope.newGame = function() {
    $scope.deck = []
    $scope.cards = []
    $scope.score = 0
    $scope.set = []
 
    CardsSvc.fetch().then(function(response){
      // fetch the whole deck
      $scope.deck = response.data
      // deal three rows of four cards
      $scope.cards.push($scope.deck.splice(0,4))
      $scope.cards.push($scope.deck.splice(0,4))
      $scope.cards.push($scope.deck.splice(0,4))
    },
    function(error) {
      console.log('Promise error: '+error.message)
    })
  }

  $scope.hint = function() {
    if (hint()) {
      $timeout(function() {
        clearSelections()
      }, 1000)
    }
  }

  $scope.endGame = function() {
  }

  var hint = function() {
    var cards = []
    var row, col
    var i, j, k
    var c1, c2
    var c3 = {shape:0, number:0, fill:0, color:0}
    var len

    // get all the dealt cards into a single array
    for (row=0; row<3; row++) {
      for (col=0; col<$scope.cards[row].length; col++) {
        cards.push($scope.cards[row][col])
      }
    }
    len = cards.length

    // for each possible pair...
    // figure out what third card would make a set
    // and check whether that card is in the array
    for (i=0; i<len; i++) {
      c1 = cards[i]
      for (j=i+1; j<len; j++) {
        c2 = cards[j]

        c3.shape = 3 - (c1.shape+c2.shape)
        if (c3.shape < 0) {
          c3.shape = 2
        }
        else {
          c3.shape %= 3
        }
        c3.color = 3 - (c1.color+c2.color)
        if (c3.color < 0) {
          c3.color = 2
        }
        else {
          c3.color %= 3
        }
        c3.number = 3 - (c1.number+c2.number)
        if (c3.number < 0) {
          c3.number = 2
        }
        else {
          c3.number %= 3
        }
        c3.fill = 3 - (c1.fill+c2.fill)
        if (c3.fill < 0) {
          c3.fill = 2
        }
        else {
          c3.fill %= 3
        }
        for (k=0; k<len; k++) {
          if (equals(c3, cards[k])) {
            c1.selected = true
            c2.selected = true
            cards[k].selected = true
            return true
          }
        }
      }
    }
    return false
  }

  var equals = function(card1, card2) {
    if (card1.shape !== card2.shape) {
      return false
    }
    if (card1.number !== card2.number) {
      return false
    }
    if (card1.color !== card2.color) {
      return false
    }
    if (card1.fill !== card2.fill) {
      return false
    }
    return true
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
          if (count===3) {
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
    var row
    var col
    var card
    var cardCount = $scope.cards[0].length + $scope.cards[1].length + $scope.cards[2].length

    if ((cardCount > 12) || ($scope.deck.length < 3)) {
      // if there are more than 12 cards, or if there are
      // no more cards to deal then we can just remove the set
      for (row=0; row<3; row++) {
        for (col=$scope.cards[row].length-1; col>=0; col--) {
          card = $scope.cards[row][col]
          if (equalCard($scope.set[0], card) || equalCard($scope.set[1], card) || equalCard($scope.set[2], card)) {
            $scope.cards[row].splice(col, 1)
          }
        }
      }
    }
    else {
      // remove the set
      for (row=0; row<3; row++) {
        for (col=$scope.cards[row].length-1; col>=0; col--) {
          card = $scope.cards[row][col]
          if (equalCard($scope.set[0], card) || equalCard($scope.set[1], card) || equalCard($scope.set[2], card)) {
            $scope.cards[row][col] = $scope.deck.splice(0,1)[0]
          }
        }
      }
    }
  }

  var equalCard = function(c1, c2) {
    return (c1.color===c2.color && c1.shape===c2.shape && c1.number===c2.number && c1.fill===c2.fill)
  }


  // highlight the current set
  var highlightSet = function() {
    var row
    var col
    var card
    for (row=0; row<3; row++) {
      for (col=$scope.cards[row].length-1; col>=0; col--) {
        card = $scope.cards[row][col]
        card.selected = ((card == $scope.set[0]) || (card == $scope.set[1]) || (card == $scope.set[2]))
      }
    }
  }

  $scope.$on('ws:goodset', function(_, data) {
    console.log('got ws:goodset')
    if ($scope.game.id, data.gameId) {
      $scope.set = data.set
      highlightSet()
      $timeout(function() {
        clearSelections()
        removeSet()
      }, 500)
    }
  })

})
