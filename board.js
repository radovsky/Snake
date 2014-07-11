"use strict";

(function (root) {

  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var Board = SnakeGame.Board = function(ctx, dimX, dimY) {
    this.FPS = 50;
    this.ctx = ctx;
    this.dimX = dimX;
    this.dimY = dimY;
    this.snake = new SnakeGame.Snake([0, -10], 5);
    this.apple = this.createApple();
  };
  
  Board.prototype.createApple = function() {
    
    var randomX = Math.floor(Math.random()*(this.dimX/10))*10 + 5;
    var randomY = Math.floor(Math.random()*(this.dimY/10))*10 + 5;
    
    
    
    return [randomX, randomY];
  };
  
  Board.prototype.start = function() {
    var board = this;
    this.timerId = window.setInterval(function() {board.step();}, board.FPS);
  };
  
  Board.prototype.render = function() {
    this.ctx.clearRect(0, 0, this.dimX, this.dimY);
    var that = this;
    this.snake.segments.forEach( function(segment) {
      that.drawSegment(that.ctx, segment);
    });
    this.drawApple(this.ctx, this.apple);
  };
  
  Board.prototype.drawApple = function(ctx, pos) {
    ctx.fillStyle = 'red';
    ctx.beginPath();

    ctx.arc(
      pos[0],
      pos[1],
      5,
      0,
      2 * Math.PI,
      false
    );
  
    ctx.fill();
  };
  
  Board.prototype.drawSegment = function(ctx, pos) {
    ctx.fillStyle = 'green';
    ctx.beginPath();

    ctx.arc(
      pos[0],
      pos[1],
      5,
      0,
      2 * Math.PI,
      false
    );
  
    ctx.fill();
  };
  
  Board.prototype.step = function() {
    this.turn();
    this.snake.move();
    if (this.appleCollide()) {
      this.apple = this.createApple();
      this.snake.grow();
    }
    if(this.checkCollisions()) {
      alert("You've been SNAKED");
    } else{
     this.render();
    }
  };
  
  Board.prototype.turn = function() {
    if(key.isPressed("up")) this.snake.dir=[0, -10] ; 
    if(key.isPressed("down")) this.snake.dir=[0, 10] ; 
    if(key.isPressed("right")) this.snake.dir=[10, 0] ;
    if(key.isPressed("left")) this.snake.dir=[-10, 0] ;
  };
  
  Board.prototype.appleCollide = function() {
    if (this.snake.segments[0][0] === this.apple[0] &&
        this.snake.segments[0][1] === this.apple[1]) {
        return true;
    }
    return false;
  };
  
  Board.prototype.checkCollisions = function() {
    var head = this.snake.segments[0];
    for (var i = 1; i < this.snake.segments.length; i++) {
      if (this.snake.segments[i][0] === head[0] &&
        this.snake.segments[i][1] === head[1]) {
          alert("YOUR SNAKE IS EATING ITSELF");
          this.stop();
        } else if (head[0] < 0 || head[0] > this.dimX || head[1] < 0 || head[1] > this.dimY ) {
          alert("YOUR SNAKE JUST GOT WALL FUCKED")
          this.stop();
		  break;
        }
    }
  };
  
  Board.prototype.stop = function() {
    clearInterval(this.timerId);
	
  };
  
})(this);