var Cards = function() {
  var arr = []
  for (var shape = 0; shape < 3; shape++)
    for (var color = 0; color < 3; color++)
      for (var number = 0; number < 3; number++)
        for (var fill = 0; fill < 3; fill++)
          arr.push( {shape: shape, color: color, number: number, fill: fill})
  this.cards = arr
}
module.exports = Cards
