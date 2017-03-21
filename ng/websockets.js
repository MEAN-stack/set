angular.module('app')
.service('WebSocketSvc', function($rootScope, $timeout) {
  function websocketHost() {
    // if the HTTP connection is over SSL then the WebSocket connection must also be
    if (window.location.protocol === "https:") {
      return "wss://" + window.location.host
    }
    else {
      return "ws://" + window.location.host
    }
  }

  var connection

  function connect() {
    connection = new WebSocket(websocketHost())
    // if the connection drops then wait a while and try to reconnect
    connection.onclose = function(e) {
      console.log('WebSocket closed. Reconnecting...')
      $timeout(connect, 5000)
    }
    // publish any incoming messages to the root scope
    // services and controllers can listen for these events
    connection.onmessage = function(e) {
      var payload = JSON.parse(e.data)
      $rootScope.$broadcast('ws:' + payload.title, payload.data)
    }
  }

  this.connect = function(){
    connect()
  }

  // send a message to the server
  // not currently used  
  this.send = function(title, data) {
    var json = JSON.stringify({title: title, data: data})
    connection.send(json)
  }
})
.run(function(WebSocketSvc) {
  // Angular run components get executed late in initialization
  // This is where we connect to the WebSocket server
  WebSocketSvc.connect()
})

