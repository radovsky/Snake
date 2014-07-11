"use strict";

(function(root) {

	var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

	var Board = SnakeGame.Board = function(ctx, dimX, dimY) {
		this.FPS = 50;
		this.ctx = ctx;

		if (dimX && dimY) {
			ctx.canvas.setAttribute('style', 'border: 1px solid black;');
			ctx.canvas.width = dimX;
			ctx.canvas.height = dimY;
		} else {
			ctx.canvas.width = window.innerWidth;
			ctx.canvas.height = window.innerHeight;
		}

		this.dimX = ctx.canvas.width;
		this.dimY = ctx.canvas.height;
		console.log('x: ' + ctx.canvas.width);
		console.log('y: ' + ctx.canvas.height);

		this.snake = new SnakeGame.Snake([10, 0]);
		this.apple = this.createApple();
	};

	Board.prototype.createApple = function() {

		var randomX = Math.floor(Math.random() * (this.dimX / 10)) * 10 + 5;
		var randomY = Math.floor(Math.random() * (this.dimY / 10)) * 10 + 5;



		return [randomX, randomY];
	};

	Board.prototype.start = function() {
		var board = this;
		this.timerId = window.setInterval(function() {
			board.step();
		}, board.FPS);
	};

	Board.prototype.render = function() {
		this.ctx.clearRect(0, 0, this.dimX, this.dimY);
		var that = this;
		this.snake.segments.forEach(function(segment) {
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
		if (!this.checkCollisions()) {
			this.render();
		}
	};

	Board.prototype.turn = function() {
		if (key.isPressed("up")) this.snake.dir = [0, -10];
		if (key.isPressed("down")) this.snake.dir = [0, 10];
		if (key.isPressed("right")) this.snake.dir = [10, 0];
		if (key.isPressed("left")) this.snake.dir = [-10, 0];
	};
	
	Board.prototype.restart = function() {
		this.stop();
		var canvas = document.getElementsByTagName('canvas')[0];
		var g = new SnakeGame.Board(canvas.getContext('2d'));
		g.start();
	};

	Board.prototype.appleCollide = function() {
		if (this.snake.segments[0][0] === this.apple[0] &&
			this.snake.segments[0][1] === this.apple[1]) {
			return true;
		}
		return false;
	};
	
	Board.prototype.checkSelfCollisions = function() {
		var head = this.snake.segments[0];
		for (var i = 1; i < this.snake.segments.length; i++) {
			if (this.snake.segments[i][0] === head[0] &&
				this.snake.segments[i][1] === head[1]) {
				this.stop();
				
				if (confirm("stop eating yourself\n\nplay again?")) {
					this.restart();
				}
			}
		}
	};
	
	Board.prototype.checkWallCollisions = function() {
		var head = this.snake.segments[0];
		if (head[0] < 0 || head[0] > this.dimX || head[1] < 0 || head[1] > this.dimY) {
			this.stop();
		
			if (confirm("nice faceplant\n\nplay again?")) {
				this.restart();
			}
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
