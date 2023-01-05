/* PhyTouch v0.2.1
 * By AlloyTeam http://www.alloyteam.com/
 * Github: https://github.com/AlloyTeam/PhyTouch
 * MIT Licensed.
 */

if (!Date.now)
	Date.now = function () {
		return new Date().getTime();
	};

var vendors = ["webkit", "moz"];
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	var vp = vendors[i];
	window.requestAnimationFrame = window[vp + "RequestAnimationFrame"];
	window.cancelAnimationFrame = window[vp + "CancelAnimationFrame"] || window[vp + "CancelRequestAnimationFrame"];
}
if (
	/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
	!window.requestAnimationFrame ||
	!window.cancelAnimationFrame
) {
	var lastTime = 0;
	window.requestAnimationFrame = function (callback) {
		var now = Date.now();
		var nextTime = Math.max(lastTime + 16, now);
		return setTimeout(function () {
			callback((lastTime = nextTime));
		}, nextTime - now);
	};
	window.cancelAnimationFrame = clearTimeout;
}

function on(element, type, callback, option) {
	var o = option || false;
	element.addEventListener(type, callback, o);
	return function unbind() {
		element.removeEventListener(type, callback, o);
	};
}
function ease(x) {
	return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function reverseEase(y) {
	return 1 - Math.sqrt(1 - y * y);
}

function preventDefaultTest(el, exceptions) {
	for (var i in exceptions) {
		if (exceptions[i].test(el[i])) {
			return true;
		}
	}
	return false;
}

function getEvents() {
	const names = ["down", "move", "up", "cancel"];
	if ("PointerEvent" in window || (window.navigator && "msPointerEnabled" in window.navigator)) {
		return names.map((n) => "pointer" + n);
	}
	if ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
		return ["touchstart", "touchmove", "touchend", "touchcancel"];
	}
	return names.map((n) => "mouse" + n);
}
var events = getEvents();
var noop = function () {};
var G = function (obj, defaultValue) {
	return obj === void 0 ? defaultValue : obj;
};
export var PhyTouch = function (option) {
	this.reverse = G(option.reverse, false);
	this.element = typeof option.touch === "string" ? document.querySelector(option.touch) : option.touch;
	this.target = G(option.target, this.element);
	var followersArr = G(option.followers, []);
	this.followers = followersArr.map(function (follower) {
		return {
			element: typeof follower.element === "string" ? document.querySelector(follower.element) : follower.element,
			offset: follower.offset,
		};
	});
	this.vertical = G(option.vertical, true);
	this.property = option.property;
	this.tickID = 0;

	this.value = G(option.value, this.target[this.property]);
	this.target[this.property] = this.value;
	this.followers.forEach(
		function (follower) {
			follower.element[this.property] = this.value + follower.offset;
		}.bind(this)
	);
	this.fixed = G(option.fixed, false);
	this.sensitivity = G(option.sensitivity, 1);
	this.moveFactor = G(option.moveFactor, 1);
	this.factor = G(option.factor, 1);
	this.outFactor = G(option.outFactor, 0.3);
	this.min = option.min;
	this.max = option.max;
	this.deceleration = G(option.deceleration, 0.0006);
	this.maxRegion = G(option.maxRegion, 600);
	this.springMaxRegion = G(option.springMaxRegion, 60);
	this.maxSpeed = option.maxSpeed;
	this.hasMaxSpeed = !(this.maxSpeed === void 0);
	this.lockDirection = G(option.lockDirection, true);

	var alwaysTrue = function () {
		return true;
	};
	this.change = option.change || noop;
	this.touchEnd = option.touchEnd || noop;
	this.touchStart = option.touchStart || noop;
	this.touchMove = option.touchMove || noop;
	this.touchCancel = option.touchCancel || noop;
	this.reboundEnd = option.reboundEnd || noop;
	this.animationEnd = option.animationEnd || noop;
	this.correctionEnd = option.correctionEnd || noop;
	this.tap = option.tap || noop;
	this.pressMove = option.pressMove || noop;
	this.shouldRebound = option.shouldRebound || alwaysTrue;

	this.preventDefault = G(option.preventDefault, true);
	this.preventDefaultException = { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ };
	this.hasMin = !(this.min === void 0);
	this.hasMax = !(this.max === void 0);
	this.isTouchStart = false;
	this.step = option.step;
	this.inertia = G(option.inertia, true);
	this._calculateIndex();

	this.eventTarget = window;
	if (option.bindSelf) {
		this.eventTarget = this.element;
	}
	var self = this;
	function bindThis(name) {
		self[name] = self[name].bind(self);
		return bindThis;
	}
	bindThis("_start")("_end")("_cancel")("_move");
	var off1 = on(this.element, events[0], this._start);
	var off2 = on(this.eventTarget, events[1], this._move, { passive: false, capture: false });
	var off3 = on(this.eventTarget, events[2], this._end);
	var off4 = on(this.eventTarget, events[3], this._cancel);
	this.destory = function () {
		off1(), off2(), off3(), off4();
		self.followers = self.element = self.target = null;
		cancelAnimationFrame(self.tickID);
	};
	this.x1 = this.x2 = this.y1 = this.y2 = null;
};

PhyTouch.prototype = {
	_events: getEvents(),
	isAtMax: function () {
		return this.hasMax && this.target[this.property] >= this.max;
	},
	isAtMin: function () {
		return this.hasMin && this.target[this.property] <= this.min;
	},
	stop: function () {
		cancelAnimationFrame(this.tickID);
		this._calculateIndex();
	},
	_start: function (evt) {
		var point = evt.touches ? evt.touches[0] : evt;
		this.isTouchStart = true;
		this.touchStart.call(this, evt, this.target[this.property]);
		cancelAnimationFrame(this.tickID);
		this._calculateIndex();
		this.startTime = new Date().getTime();
		this.x1 = this.preX = point.pageX;
		this.y1 = this.preY = point.pageY;
		this.start = this.vertical ? this.preY : this.preX;
		this._firstTouchMove = true;
		this._preventMove = false;
	},
	_move: function (evt) {
		if (this.isTouchStart) {
			var point = evt.touches ? evt.touches[0] : evt;
			var len = evt.touches ? evt.touches.length : 1,
				currentX = point.pageX,
				currentY = point.pageY;

			if (this._firstTouchMove && this.lockDirection) {
				var dDis = Math.abs(currentX - this.x1) - Math.abs(currentY - this.y1);
				if (dDis > 0 && this.vertical) {
					this._preventMove = true;
				} else if (dDis < 0 && !this.vertical) {
					this._preventMove = true;
				}
				this._firstTouchMove = false;
			}
			if (!this._preventMove) {
				var d = (this.vertical ? currentY - this.preY : currentX - this.preX) * this.sensitivity;
				var f = this.moveFactor;
				if (this.isAtMax() && (this.reverse ? -d : d) > 0) {
					f = this.outFactor;
				} else if (this.isAtMin() && (this.reverse ? -d : d) < 0) {
					f = this.outFactor;
				}
				d *= f;
				this.preX = currentX;
				this.preY = currentY;
				if (!this.fixed) {
					var detalD = this.reverse ? -d : d;
					this.target[this.property] += detalD;
					this.followers.forEach(
						function (follower) {
							follower.element[this.property] += detalD;
						}.bind(this)
					);
				}
				this.change.call(this, this.target[this.property]);
				var timestamp = new Date().getTime();
				if (timestamp - this.startTime > 300) {
					this.startTime = timestamp;
					this.start = this.vertical ? this.preY : this.preX;
				}
				this.touchMove.call(this, evt, this.target[this.property]);
			}

			if (this.preventDefault && !preventDefaultTest(evt.target, this.preventDefaultException)) {
				evt.preventDefault();
			}

			if (len === 1) {
				if (this.x2 !== null) {
					evt.deltaX = currentX - this.x2;
					evt.deltaY = currentY - this.y2;
				} else {
					evt.deltaX = 0;
					evt.deltaY = 0;
				}
				this.pressMove.call(this, evt, this.target[this.property]);
			}
			this.x2 = currentX;
			this.y2 = currentY;
		}
	},
	_cancel: function (evt) {
		var current = this.target[this.property];
		this.touchCancel.call(this, evt, current);
		this._end(evt);
	},
	to: function (v, time, user_ease, callback) {
		this._to(
			v,
			G(time, 600),
			user_ease || ease,
			this.change,
			function (value) {
				this._calculateIndex();
				this.reboundEnd.call(this, value);
				this.animationEnd.call(this, value);
				callback && callback.call(this, value);
			}.bind(this)
		);
	},
	_calculateIndex: function () {
		if (this.hasMax && this.hasMin) {
			this.currentPage = Math.round((this.max - this.target[this.property]) / this.step);
		}
	},
	_end: function (evt) {
		var point = evt.changedTouches ? evt.changedTouches[0] : evt;
		if (this.isTouchStart) {
			this.isTouchStart = false;

			var pageX = point.pageX,
				pageY = point.pageY,
				self = this,
				current = this.target[this.property],
				triggerTap = Math.abs(pageX - this.x1) < 30 && Math.abs(pageY - this.y1) < 30;
			if (triggerTap) {
				this.tap.call(this, evt, current);
			}
			if (this.touchEnd.call(this, evt, current, this.currentPage) === false) return;
			if (this.hasMax && current > this.max) {
				if (!this.shouldRebound(current)) {
					return;
				}
				this._to(
					this.max,
					200,
					ease,
					this.change,
					function (value) {
						this.reboundEnd.call(this, value);
						this.animationEnd.call(this, value);
					}.bind(this)
				);
			} else if (this.hasMin && current < this.min) {
				if (!this.shouldRebound(current)) {
					return;
				}
				this._to(
					this.min,
					200,
					ease,
					this.change,
					function (value) {
						this.reboundEnd.call(this, value);
						this.animationEnd.call(this, value);
					}.bind(this)
				);
			} else if (this.inertia && !triggerTap && !this._preventMove && !this.fixed) {
				var dt = new Date().getTime() - this.startTime;
				if (dt < 300) {
					var distance = ((this.vertical ? pageY : pageX) - this.start) * this.sensitivity,
						speed = Math.abs(distance) / dt,
						actualSpeed = this.factor * speed;
					if (this.hasMaxSpeed && actualSpeed > this.maxSpeed) {
						actualSpeed = this.maxSpeed;
					}
					var direction = distance < 0 ? -1 : 1;
					if (this.reverse) {
						direction = -direction;
					}
					var destination = current + ((actualSpeed * actualSpeed) / (2 * this.deceleration)) * direction;

					var tRatio = 1;
					if (destination < this.min) {
						if (destination < this.min - this.maxRegion) {
							tRatio = reverseEase((current - this.min + this.springMaxRegion) / (current - destination));
							destination = this.min - this.springMaxRegion;
						} else {
							tRatio = reverseEase(
								(current -
									this.min +
									(this.springMaxRegion * (this.min - destination)) / this.maxRegion) /
									(current - destination)
							);
							destination = this.min - (this.springMaxRegion * (this.min - destination)) / this.maxRegion;
						}
					} else if (destination > this.max) {
						if (destination > this.max + this.maxRegion) {
							tRatio = reverseEase((this.max + this.springMaxRegion - current) / (destination - current));
							destination = this.max + this.springMaxRegion;
						} else {
							tRatio = reverseEase(
								(this.max +
									(this.springMaxRegion * (destination - this.max)) / this.maxRegion -
									current) /
									(destination - current)
							);
							destination = this.max + (this.springMaxRegion * (destination - this.max)) / this.maxRegion;
						}
					}
					var duration = Math.round(speed / self.deceleration) * tRatio;
					if (!isNaN(destination)) {
						self._to(Math.round(destination), duration, ease, self.change, function (value) {
							if (self.hasMax && self.target[self.property] > self.max) {
								if (!this.shouldRebound(self.target[self.property])) {
									return;
								}
								cancelAnimationFrame(self.tickID);
								self._to(self.max, 600, ease, self.change, self.animationEnd);
							} else if (self.hasMin && self.target[self.property] < self.min) {
								if (!this.shouldRebound(self.target[self.property])) {
									return;
								}
								cancelAnimationFrame(self.tickID);
								self._to(self.min, 600, ease, self.change, self.animationEnd);
							} else {
								if (self.step) {
									self._correction();
								} else {
									self.animationEnd.call(self, value);
								}
							}

							self.change.call(this, value);
						});
					}
				} else {
					self._correction();
				}
			} else {
				self._correction();
			}
		}
		this.x1 = this.x2 = this.y1 = this.y2 = null;
	},
	_to: function (value, time, ease, onChange, onEnd) {
		var el = this.target,
			property = this.property;
		var followers = this.followers;
		var current = el[property];
		var dv = value - current;
		var beginTime = +new Date();
		var self = this;
		var toTick = function () {
			var dt = +new Date() - beginTime;
			if (dt >= time) {
				el[property] = value;
				onChange && onChange.call(self, value);
				onEnd && onEnd.call(self, value);
				return;
			}
			var nextPosition = dv * ease(dt / time) + current;
			el[property] = nextPosition;
			followers.forEach(function (follower) {
				follower.element[property] = nextPosition + follower.offset;
			});
			self.tickID = requestAnimationFrame(toTick);
			onChange && onChange.call(self, el[property]);
		};
		toTick();
	},
	_correction: function () {
		if (this.step === void 0) return;
		var el = this.target,
			property = this.property;
		var value = el[property];
		var rpt = Math.floor(Math.abs(value / this.step));
		var dy = value % this.step;
		if (Math.abs(dy) > this.step / 2) {
			this._to(
				(value < 0 ? -1 : 1) * (rpt + 1) * this.step,
				400,
				ease,
				this.change,
				function (value) {
					this._calculateIndex();
					this.correctionEnd.call(this, value);
					this.animationEnd.call(this, value);
				}.bind(this)
			);
		} else {
			this._to(
				(value < 0 ? -1 : 1) * rpt * this.step,
				400,
				ease,
				this.change,
				function (value) {
					this._calculateIndex();
					this.correctionEnd.call(this, value);
					this.animationEnd.call(this, value);
				}.bind(this)
			);
		}
	},
	destory: noop,
};

export default PhyTouch;
