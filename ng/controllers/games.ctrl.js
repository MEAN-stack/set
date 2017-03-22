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
      console.log("Joined "+game.creator+"'s game")
    })
  }
})
