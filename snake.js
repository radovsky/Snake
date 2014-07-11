(function (root) {

  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var Snake = SnakeGame.Snake = function(dir, growthRate) {
    this.dir = dir;
    this.segments = [[55, 55], [55, 55], [55, 55]];
  };
  
  Snake.prototype.move = function() {
    this.segments.pop();
    var head = this.segments[0];
    var move = [ head[0] + this.dir[0], head[1] + this.dir[1] ];
    this.segments.unshift(move);
  };
  
  Snake.prototype.grow = function() {
    var that = this;
    for (var i = 0; i < 3; i++) {
      that.segments.push(that.segments[that.segments.length-1]);
    }
  };
  
})(this);