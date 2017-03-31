var Card = function(shape, color, number, fill) {
  this.shape = shape
  this.color = color
  this.number = number
  this.fill = fill
  this.image = '/'+shape+'_'+color+'_'+number+'_'+fill+'.png'
}

var Deck = function() {
  var arr = []
  for (var shape = 0; shape < 3; shape++)
    for (var color = 0; color < 3; color++)
      for (var number = 0; number < 3; number++)
        for (var fill = 0; fill < 3; fill++)
          arr.push(new Card(shape, color, number, fill))
  this.cards = arr
}
module.exports = Deck
