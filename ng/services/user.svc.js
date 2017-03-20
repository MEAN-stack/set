angular.module('app')
.service('UserSvc', function($http) {
  var svc = this
  svc.getUser = function() {
    return $http.get('/api/users', {
      headers: {'X-Auth': this.token}
    })
  }
  svc.login = function(username, password) {
    return $http.post('/api/sessions', {
      username: username
    }).then(function(val) {
      svc.token = val.data
      return svc.getUser()
    })
  }

  // register a new user
//  svc.createUser = function(username, fullName, email, password) {
//    return $http.post('/api/users', { username: username, fullName: fullName, email: email, password: password })
//  }
})
