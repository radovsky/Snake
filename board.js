"use strict";

(function(root) {

	var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

	var Board = SnakeGame.Board = function(ctx, dimX, dimY) {
		this.STEP_MS = 60;
		this.ctx = ctx;
		ctx.canvas.setAttribute('style', 'border: 1px solid black;');
		
		var correctWidth = Math.round(window.innerWidth / 10) * 10 + 2;
		if (correctWidth > window.innerWidth) correctWidth -= 10;
		
		var correctHeight = Math.round(window.innerHeight / 10) * 10 + 2;
		if (correctHeight > window.innerHeight) correctHeight -= 10;

		if (dimX && dimY) {
			ctx.canvas.width = dimX;
			ctx.canvas.height = dimY;
		} else {
			ctx.canvas.width = correctWidth - 12;
			ctx.canvas.height = correctHeight - 12;
		}

		this.dimX = ctx.canvas.width;
		this.dimY = ctx.canvas.height;

		this.snake = new SnakeGame.Snake([10, 0]);
		this.apple = this.createApple();
		this.applesEaten = 0;
		
		this.paused = false;
		this.bindKeyHandlers();
	};

	Board.prototype.createApple = function() {
		var randomX = Math.floor(Math.random() * (this.dimX / 10)) * 10 + 5;
		var randomY = Math.floor(Math.random() * (this.dimY / 10)) * 10 + 5;

		if (this.snake.overlaps([randomX, randomY])){
			return this.createApple(); 
		}

		return [randomX, randomY];
	};
	
	// Bonus.prototype.randomBonus = function() {
	//   		var rando = Math.floor(Math.random() * 2);
	// 	if (rando === 0) {
	// 		return this.speedUp();
	// 	} else if (rando === 1) {
	// 		return this.slowDown();
	// 	}
	// };

	Board.prototype.start = function() {
		var board = this;
		this.timerId = window.setInterval(function() {
			board.step();
		}, board.STEP_MS);
	};

	Board.prototype.render = function() {
		this.ctx.clearRect(0, 0, this.dimX, this.dimY);
		var that = this;
		this.snake.segments.forEach(function(segment) {
			that.drawSegment(that.ctx, segment);
		});
		this.drawEdible(this.ctx, this.apple);
	};

	Board.prototype.drawEdible = function(ctx, pos, color) {
		// apple is default
		ctx.fillStyle = color || 'red';
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
		this.snake.move();
		if (this.appleCollide()) {
			this.apple = this.createApple();
			this.snake.grow();
		}
		if (!this.checkCollisions()) {
			this.render();
		}
	};

	Board.prototype.bindKeyHandlers = function() {
		var that = this;
		key("space", function(){
			if (that.paused) {
				that.paused = false;
				that.start();
			} else {
				that.paused = true;
				that.stop();
			}
		});
		
		key("up", function(){
			if (!(that.snake.dir[0] === 0 && that.snake.dir[1] === 10)) {
				that.snake.dir = [0, -10];
			}
		});
		
		key("down", function(){
			if (!(that.snake.dir[0] === 0 && that.snake.dir[1] === -10)) {
				that.snake.dir = [0, 10];
			}
		});
		
		key("right", function(){
			if (!(that.snake.dir[0] === -10 && that.snake.dir[1] === 0)) {
				that.snake.dir = [10, 0];
			}
		});
		
		key("left", function(){
			if (!(that.snake.dir[0] === 10 && that.snake.dir[1] === 0)) {
				that.snake.dir = [-10, 0];
			}
		});
	};

	Board.prototype.restart = function() {
		location.reload();
	};
	
	Board.prototype.snakeCollide = function(pos) {
		var head = this.snake.segments[0];
		return head[0] === pos[0] && head[1] === pos[1];
	};

	Board.prototype.appleCollide = function() {
		if (this.snakeCollide(this.apple)) {
			this.applesEaten += 1;
			return true;
		}
		return false;
	};
	
	Board.prototype.checkSelfCollisions = function() {
		var head = this.snake.segments[0];
		for (var i = 1; i < this.snake.segments.length; i++) {
			if (this.snakeCollide(this.snake.segments[i])) {
				this.stop();
				alert(
					"Stop eating yourself.\nYou ate " + 
					this.applesEaten + " apples though!\n\nPlay again?"
				);
				this.restart();
			}
		}
	};
	
	Board.prototype.checkWallCollisions = function() {
		var head = this.snake.segments[0];
		if (head[0] < 0 || head[0] > this.dimX || head[1] < 0 || head[1] > this.dimY) {
			this.stop();
		
			alert(
				"Nice faceplant.\nYou ate " + 
				this.applesEaten + " apples though!\n\nPlay again?"
			);
			this.restart();
		}
	};

	Board.prototype.checkCollisions = function() {
		this.checkSelfCollisions();
		this.checkWallCollisions();
	};

	Board.prototype.stop = function() {
		clearInterval(this.timerId);
	};

})(this);