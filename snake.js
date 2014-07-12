"use strict";

(function (root) {

	var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

	var Snake = SnakeGame.Snake = function(dir, growthRate, startingSize) {
		this.dir = dir || [10, 0];
		this.growthRate = growthRate || 3;
		this.startingSize = startingSize || 300;
		this.segments = [];
		for (var i = 0; i < this.startingSize; i++) {
			this.segments.push([155, 155]);
		}
	};

	Snake.prototype.move = function() {
		this.segments.pop();
		var head = this.segments[0];
		var move = [ head[0] + this.dir[0], head[1] + this.dir[1] ];
		this.segments.unshift(move);
	};

	Snake.prototype.grow = function() {
		var that = this;
		for (var i = 0; i < this.growthRate; i++) {
			that.segments.push(that.segments[that.segments.length-1]);
		}
	};

	Snake.prototype.overlaps = function(pos) {
		for (var i = 0; i < this.segments.length; i++) {
			if (this.segments[i][0] === pos[0] && this.segments[i][1] === pos[1]) {
				return true;
			}
		}
		return false;
	};

})(this);