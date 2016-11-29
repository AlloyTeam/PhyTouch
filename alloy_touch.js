/* AlloyTouch v0.1.1
 * By AlloyTeam http://www.alloyteam.com/
 * Github: https://github.com/AlloyTeam/AlloyTouch
 * MIT Licensed.
 */

;(function () {
    'use strict';

    if (!Date.now)
        Date.now = function () { return new Date().getTime(); };

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame']
                                   || window[vp + 'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function (callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

(function () {

    function bind(element, type, callback) {
        element.addEventListener(type, callback, false);
    }

    function ease(x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }

    function preventDefaultTest(el, exceptions) {
        for (var i in exceptions) {
            if (exceptions[i].test(el[i])) {
                return true;
            }
        }
        return false;
    }

    var AlloyTouch = function (option) {
        this.target = option.target;
        this.element = typeof option.touch === "string" ? document.querySelector(option.touch) : option.touch;
        this.vertical = this._getValue(option.vertical, true);
        this.property = option.property;
        this.tickID = 0;

        this.sensitivity = this._getValue(option.sensitivity, 1);
        this.factor = this._getValue(option.factor, 1);
        this.sf = this.sensitivity * this.factor;
        this.dragFactor = 1;
        this.min = option.min;
        this.max = option.max;
        this.deceleration = 0.0006;

        var noop = function () { };
        this.change = option.change || noop;
        this.touchEnd = option.touchEnd || noop;
        this.touchStart = option.touchStart || noop;
        this.touchMove = option.touchMove || noop;
        this.reboundEnd = option.reboundEnd || noop;
        this.animationEnd = option.animationEnd || noop;
        this.correctionEnd = option.correctionEnd || noop;

        this.preventDefault = this._getValue(option.preventDefault, true);
        this.preventDefaultException = { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ };
        this.hasMin = !(this.min === undefined);
        this.hasMax = !(this.max === undefined);
        this.isTouchStart = false;
        this.step = option.step;
        this.inertia = this._getValue(option.inertia, true);

        this._calculateIndex();

        bind(this.element, "touchstart", this._start.bind(this));
        bind(window, "touchmove", this._move.bind(this));
        bind(window, "touchend", this._end.bind(this));
        bind(window, "touchcancel", this._cancel.bind(this));
    };

    AlloyTouch.prototype = {
        _getValue: function (obj, defaultValue) {
            return obj === undefined ? defaultValue : obj;
        },
        _start: function (evt) {
            this.isTouchStart = true;
            this._firstTouchMove = true;
            this._preventMoveDefault = true;
            this.touchStart(this.target[this.property]);
            cancelAnimationFrame(this.tickID);
            this._calculateIndex();
            this.startTime = new Date().getTime();
            this._startX = this.preX = evt.touches[0].pageX;
            this._startY = this.preY = evt.touches[0].pageY;
            this.start = this.vertical ? this.preY : this.preX;
        },
        _move: function (evt) {
            if (this.isTouchStart) {
                if (this._firstTouchMove) {
                    var dDis = Math.abs(evt.touches[0].pageX - this._startX) - Math.abs(evt.touches[0].pageY - this._startY);
                    if (dDis > 0 && this.vertical) {
                        this._preventMoveDefault = false;
                    } else if (dDis < 0 && !this.vertical) {
                        this._preventMoveDefault = false;
                    }
                    this._firstTouchMove = false;
                }
                if (this._preventMoveDefault) {
                    var d = (this.vertical ? evt.touches[0].pageY - this.preY : evt.touches[0].pageX - this.preX) * this.sf;
                    if (this.hasMax && this.target[this.property] > this.max && d > 0) {
                        this.dragFactor = 0.3;
                    } else if (this.hasMin && this.target[this.property] < this.min && d < 0) {
                        this.dragFactor = 0.3;
                    } else {
                        this.dragFactor = 1;
                    }
                    d *= this.dragFactor;
                    this.preX = evt.touches[0].pageX;
                    this.preY = evt.touches[0].pageY;
                    this.target[this.property] += d;
                    this.change(this.target[this.property]);
                    var timestamp = new Date().getTime();
                    if (timestamp - this.startTime > 300) {
                        this.startTime = timestamp;
                        this.start = this.vertical ? this.preY : this.preX;
                    }
                    this.touchMove(this.target[this.property]);

                    evt.preventDefault();
                }
            }
        },
        go: function (v) {
            if (v > this.max) {
                v = this.max;
            } else if (v < this.min) {
                v = this.min;
            }

            this.to(v, 400, ease, this.change, function (value) {
                this._calculateIndex();
                this.reboundEnd(value, this.currentPage);
                this.animationEnd(value, this.currentPage);

            }.bind(this));

        },
        _calculateIndex: function () {
            if (this.hasMax && this.hasMin) {
                this.currentPage = Math.round((this.max - this.target[this.property]) / this.step);
            }
        },
        _end: function (evt) {
            if (this.isTouchStart && this._preventMoveDefault) {
                this.isTouchStart = false;
                var self = this;
                if (this.touchEnd.call(this, this.target[this.property], this.currentPage) === false) return;
                if (this.hasMax && this.target[this.property] > this.max) {
                    this.to(this.max, 200, ease, this.change, function (value) {
                        this.reboundEnd(value);
                        this.animationEnd(value);
                    }.bind(this));
                } else if (this.hasMin && this.target[this.property] < this.min) {
                    this.to(this.min, 200, ease, this.change, function (value) {
                        this.reboundEnd(value);
                        this.animationEnd(value);
                    }.bind(this));
                } else if (this.inertia) {
                    //var y = evt.changedTouches[0].pageY;
                    var duration = new Date().getTime() - this.startTime;
                    if (duration < 300) {
                        var distance = ((this.vertical ? evt.changedTouches[0].pageY : evt.changedTouches[0].pageX) - this.start) * this.sensitivity,
                            speed = Math.abs(distance) / duration,
                            speed2 = this.factor * speed,
                            destination = this.target[this.property] + (speed2 * speed2) / (2 * this.deceleration) * (distance < 0 ? -1 : 1);

                        self.to(Math.round(destination), Math.round(speed / self.deceleration), ease, function (value) {

                            if (self.hasMax && self.target[self.property] > self.max) {
                                setTimeout(function () {
                                    cancelAnimationFrame(self.tickID);
                                    self.to(self.max, 200, ease, self.change, self.animationEnd);
                                }, 50);
                            } else if (self.hasMin && self.target[self.property] < self.min) {
                                setTimeout(function () {
                                    cancelAnimationFrame(self.tickID);
                                    self.to(self.min, 200, ease, self.change, self.animationEnd);
                                }, 50);
                            }

                            self.change(value);
                        }, function () {
                            if (self.step) {
                                self.correction();
                            } else {
                                self.animationEnd(self.target[self.property]);
                            }
                        });
                    } else {
                        self.correction();
                    }
                } else {
                    self.correction();
                }
                if (this.preventDefault && !preventDefaultTest(evt.target, this.preventDefaultException)) {
                    evt.preventDefault();
                }

            }
        },
        _cancel: function () {
            if (this.hasMax && this.target[this.property] > this.max) {
                this.to(this.max, 200, ease, this.change, function (value) {
                    this.reboundEnd(value);
                    this.animationEnd(value);
                }.bind(this));
            } else if (this.hasMin && this.target[this.property] < this.min) {
                this.to(this.min, 200, ease, this.change, function (value) {
                    this.reboundEnd(value);
                    this.animationEnd(value);
                }.bind(this));
            } else {
                this.correction();
            }
        },
        to: function (value, time, ease, onChange, onEnd) {
            var el = this.target,
                property = this.property;
            var current = el[property];
            var dv = value - current;
            var beginTime = new Date();
            var self = this;
            var toTick = function () {

                var dt = new Date() - beginTime;
                if (dt >= time) {
                    el[property] = value;
                    onChange && onChange(value);
                    onEnd && onEnd(value);
                    return;
                }
                el[property] = dv * ease(dt / time) + current;
                self.tickID = requestAnimationFrame(toTick);
                //cancelAnimationFrame必须在 tickID = requestAnimationFrame(toTick);的后面
                onChange && onChange(el[property]);
            };
            toTick();
        },
        correction: function () {
            if (this.step === undefined)return;
            var el = this.target,
                property = this.property;
            var value = el[property];
            var rpt = Math.floor(Math.abs(value / this.step));
            var dy = value % this.step;
            if (Math.abs(dy) > this.step / 2) {
                this.to((value < 0 ? -1 : 1) * (rpt + 1) * this.step, 400, ease, this.change, function (value) {
                    this._calculateIndex();
                    this.correctionEnd(value, this.currentPage);
                    this.animationEnd(value, this.currentPage);
                }.bind(this));
            } else {
                this.to((value < 0 ? -1 : 1) * rpt * this.step, 400, ease, this.change, function (value) {
                    this._calculateIndex();
                    this.correctionEnd(value, this.currentPage);
                    this.animationEnd(value, this.currentPage);
                }.bind(this));
            }
        }
    };

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = AlloyTouch;
    } else {
        window.AlloyTouch = AlloyTouch;
    }

})();