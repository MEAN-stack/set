angular.module('app')
.controller('GamesCtrl', function($scope, $location, GamesSvc) {
  var path = $location.path()

  if (/newgame/.test(path)) {
    GamesSvc.create().then(function(response) {
      GamesSvc.fetch().success(function(games){
        $scope.games = games
      })
    })
  }
  else {
    GamesSvc.fetch().success(function(games){
      $scope.games = games
    })
  }

  $scope.join = function(game) {
    GamesSvc.addPlayer(game).success(function(response) {
//      game.players.push($scope.username)
    })
  }

  $scope.userJoinedTo = function(game) {
    for (var i=0; i<game.players.length; i++) {
      if ($scope.username==game.players[i]) {
        return true
      }
    }
    return false
  }

  $scope.play = function(game) {
    $location.path("/play")
  }

  $scope.userCreated = function(game) {
    return $scope.username==game.creator
  }

  $scope.$on('ws:newgame', function(_, game) {
    if (!findGame($scope.games, game.id)) {
      $scope.$apply(function() {
        $scope.games.push(game)
      })
    }
  })

  $scope.$on('ws:newplayer', function(_, data) {
    var game = findGame($scope.games, data.gameId)
    if (game) {
      $scope.$apply(function() {
        game.players.push(data.player)
      })
    }
  })

  var findGame = function(games, id) {
    for (var i=0; i<games.length; i++) {
      if (games[i].id==id) {
        return games[i]
      }
    }
    return null
  }
})
