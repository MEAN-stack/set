angular.module('app')
.controller('GamesCtrl', function($scope, $location, GamesSvc) {
  var path = $location.path()

  if (/newgame/.test(path)) {
    GamesSvc.create().then(function(response) {
      console.log("created a game")
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
      game.players.push($scope.username)
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

  $scope.$on('ws:newgame', function(_, game) {
    console.log('New game')
    console.dir(game)
  })

  $scope.$on('ws:newplayer', function(_, data) {
    console.log('New player')
    console.dir(data)
  })

})
