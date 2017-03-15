var Cards = function() {
  var cards = []
    for (var shape = 0; shape < 3; shape++)
      for (var color = 0; color < 3; color++)
        for (var number = 0; number < 3; number++)
          for (var fill = 0; fill < 3; fill++)
            cards.push( {shape: shape, color: color, number: number, fill: fill})
}
module.exports = Cards
