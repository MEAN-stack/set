angular.module('app')
.controller('GamesCtrl', function($scope, $location, GamesSvc) {
  
    $scope.games = []
    var path = $location.path()

  if (/newgame/.test(path)) {
    GamesSvc.create().then(function(response) {
    },
    function(error) {
      console.log('Promise error: '+ error.message)
    })
  }
  else {
    GamesSvc.fetch().then(function(response){
      $scope.games = response.data
    },
    function(error) {
      console.log('Promise error: '+ error.message)
    })
  }

  $scope.join = function(game) {
    GamesSvc.addPlayer(game).then(function(response) {
    },
    function(error) {
      console.log('Promise error: '+ error.message)
    })
  }

  $scope.userJoinedTo = function(game) {
    for (var i=0; i<game.players.length; i++) {
      if ($scope.username===game.players[i]) {
        return true
      }
    }
    return false
  }

  $scope.play = function(game) {
    GamesSvc.start(game.id).then(function(response) {
    },
    function(error) {
      console.log('Promise error: '+ error.message)
    })
  }

  $scope.userCreated = function(game) {
    return $scope.username===game.owner
  }

  $scope.$on('ws:newgame', function(_, game) {
    console.log('got ws:newgame')
    console.dir(game)
    if (!findGame($scope.games, game.id)) {
      $scope.$apply(function() {
        $scope.games.push(game)
      })
    }
  })

  $scope.$on('ws:newplayer', function(_, data) {
    console.log('got ws:newplayer')
    var game = findGame($scope.games, data.gameId)
    if (game) {
      $scope.$apply(function() {
        game.players.push(data.player)
      })
    }
  })

  $scope.$on('ws:gameon', function(_, data) {
    console.log('got ws:gameon')
     $scope.$apply(function() {
       $location.path("/play/"+data.gameId)
     })
  })

  var findGame = function(games, id) {
    if (games && games.length) {
      for (var i=0; i<games.length; i++) {
        if (games[i].id===id) {
          return games[i]
        }
      }
    }
    return null
  }
  
  var findGameIndex = function(games, id) {
    if (games && games.length) {
      for (var i=0; i<games.length; i++) {
        if (games[i].id===id) {
          return i
        }
      }
    }
    return -1
  }

  $scope.$on('ws:gameover', function(_, data) {
    console.log('games.ctrl got ws:gameover')
    var i = findGameIndex($scope.games, data.gameId)
    if (i>=0) {
      $scope.$apply(function() {
        $scope.games.splice(i, 1)
      })
    }
  })

})
