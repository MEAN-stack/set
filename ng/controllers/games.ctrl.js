angular.module('app')
.controller('GamesCtrl', function($scope, $location) {
  var path = $location.path()

  $scope.games = [
    {creator: 'Paul', players: ['Paul', 'Santhosh', 'Manasa']},
    {creator: 'David', players: ['David']},
    {creator: 'Someone', players: []}
  ]

  if (/newgame/.test(path)) {
    console.log("new game")
  }

  $scope.join = function(game) {
    console.log("Joining "+game.creator+"'s game")
  }
})
