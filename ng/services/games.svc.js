angular.module('app')
.service('GamesSvc', function($http) {

  this.fetch = function() {
    return $http.get('/api/games')
  }

  this.create = function() {
    return $http.post('/api/games')
  }

  this.fetchGame = function(gameId) {
    return $http.get('/api/games/'+gameId)
  }

  this.addPlayer = function(game) {
    return $http.post('/api/games/'+game.id+'/players')
  }

  //TODO: caller to pass gameId
  this.start = function(gameId) {
    return $http.put('/api/games/'+gameId)
    // TODO: add body to update game status
  }
})
