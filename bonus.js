"use strict";

(function (root) {

	var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

	var Bonus = SnakeGame.Bonus = function(snake, board) {
		this.snake = snake;
		this.board = board;
	};
  
	Bonus.prototype.speedUp = function() {
  		this.board.STEP_MS = this.board.STEP_MS / 1.5
	};
  
	Bonus.prototype.slowDown = function() {
  		this.board.STEP_MS = this.board.STEP_MS * 1.5
	};
  
	Bonus.prototype.yourChoice = function() {
  	
	};
  
})(this);