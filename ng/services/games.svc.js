angular.module('app')
.service('GamesSvc', function($http) {

  this.fetch = function() {
    return $http.get('/api/games')
  }

  this.create = function() {
    return $http.post('/api/games')
  }
})
