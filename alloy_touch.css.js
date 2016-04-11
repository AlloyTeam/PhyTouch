/* AlloyTouch
 * By AlloyTeam http://www.alloyteam.com/
 * Github: https://github.com/AlloyTeam/AlloyTouch
 * MIT Licensed.
 */
; (function () {

    
    var lastTime = 0;
    var ticker = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    var clearTicker = window.clearTimeout;

    var _elementStyle = document.createElement('div').style,
        endTransitionEventName,
        transitionDuration,
        transitionTimingFunction,
        transform;

    if ('transform' in _elementStyle) {
        transform = 'transform';
            endTransitionEventName = 'transitionend';
            transitionDuration = 'transitionDuration';
            transitionTimingFunction = 'transitionTimingFunction';
    } else if ('webkitTransform' in _elementStyle) {
        transform = 'webkitTransform';
            endTransitionEventName = 'webkitTransitionEnd';
            transitionDuration = 'webkitTransitionDuration';
            transitionTimingFunction = 'webkitTransitionTimingFunction';
        } else {
            throw 'please use a modern browser'
        }
    
    var ease = 'cubic-bezier(0.1, 0.57, 0.1, 1)';

    function reverseEase(y) {
        return 1 - Math.sqrt(1 - y * y);
    }

    function bind(element, type, callback) {
        element.addEventListener(type, callback, false);
    }

    function unbind(element, type, callback) {
        element.removeEventListener(type, callback);
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
        this.scroller = option.target;
        this.element = typeof option.touch === "string" ? document.querySelector(option.touch) : option.touch;
        this.vertical = option.vertical;
        this.vertical === undefined && (this.vertical = true);
        this.property = option.property;

        this.preX;
        this.preY;
        this.sensitivity = option.sensitivity === undefined ? 1 : option.sensitivity;
        this.factor = option.factor === undefined ? 1 : option.factor;
        this.sMf = this.sensitivity * this.factor;
        //拖动时候的摩擦因子
        this.factor1 = 1;
        this.min = option.min;
        this.max = option.max;
        this.startTime;
        this.start;
        this.recording = false;
        this.deceleration = 0.0006;
        this.change = option.change || function () { };
        this.touchEnd = option.touchEnd || function () { };
        this.touchStart = option.touchStart || function () { };
        this.touchMove = option.touchMove || function () { };
        this.reboundEnd = option.reboundEnd || function () { };
        this.preventDefaultException = { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ };
        this.hasMin = !(this.min === undefined);
        this.hasMax = !(this.max === undefined);
        this.isTouchStart = false;
        this.step = option.step;
        this.spring = option.spring;
        this.spring === undefined && (this.spring = true);
        this.inertia = option.inertia;
        this.inertia === undefined && (this.inertia = true);
        this.correctionEnd = option.correctionEnd || function () { };
        this.animationEnd = option.animationEnd || function () { };
        this.intelligentCorrection = option.intelligentCorrection;
        if (this.hasMax && this.hasMin) {
            this.currentPage = Math.round((this.max - this.scroller[this.property]) / this.step);
        }

        this._startHandler = this._start.bind(this);
        this._moveHandler = this._move.bind(this);
        this._transitionEndHandler = this._transitionEnd.bind(this);
        this._endHandler = this._end.bind(this);

        bind(this.element, "touchstart", this._startHandler);
        bind(this.element, endTransitionEventName, this._transitionEndHandler);
        bind(window, "touchmove", this._moveHandler);
        bind(window, "touchend", this._endHandler);
    }

    AlloyTouch.prototype = {
        _transitionEnd: function () {
            this.animationEnd(this.getComputedPosition());
        },
        _cancelAnimation: function () {
         
            //console.log(window.getComputedStyle(this.scroller)[transform])
            this.scroller.style[transitionDuration] = '0ms';
            this.scroller.style[transform] = window.getComputedStyle(this.scroller)[transform];
           
        },
        getComputedPosition: function () {
            var matrix = window.getComputedStyle(this.scroller, null),
                x, y;
                matrix = matrix[transform].split(')')[0].split(', ');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            

            return { x: x, y: y };
        },
        _start: function (evt) {
            this.isTouchStart = true;
            this._firstTouchMove = true;
            this._preventMoveDefault = true;
            this.touchStart(this.scroller[this.property]);
            this._cancelAnimation();
            this.correctionEnd(this.scroller[this.property]);
            if (this.hasMax && this.hasMin) {
                this.currentPage = Math.round((this.max - this.scroller[this.property]) / this.step);
            }
            this.startTime = new Date().getTime();
            this._startX = this.preX = evt.touches[0].pageX;
            this._startY = this.preY = evt.touches[0].pageY;
            this.start = this.vertical ? this.preY : this.preX;
        },
        _move: function (evt) {
            if (this.isTouchStart) {
                if (this._firstTouchMove) {
                    var dDis=Math.abs(evt.touches[0].pageX - this._startX) - Math.abs(evt.touches[0].pageY - this._startY);
                    if (dDis > 0 && this.vertical) {
                        this._preventMoveDefault = false;
                    } else if (dDis < 0 && !this.vertical) {
                        this._preventMoveDefault = false;
                    }
                    this._firstTouchMove = false;
                }
                if (this._preventMoveDefault) {
                    var d = (this.vertical ? evt.touches[0].pageY - this.preY : evt.touches[0].pageX - this.preX) * this.sMf;
                    if (this.hasMax && this.scroller[this.property] > this.max && d > 0) {
                        this.factor1 = 0.3;
                    } else if (this.hasMin && this.scroller[this.property] < this.min && d < 0) {
                        this.factor1 = 0.3;
                    } else {
                        this.factor1 = 1;
                    }
                    d *= this.factor1;
                    this.preX = evt.touches[0].pageX;
                    this.preY = evt.touches[0].pageY;
                    this.scroller[this.property] += d;
                    this.change(this.scroller[this.property]);
                    var timestamp = new Date().getTime();
                    if (timestamp - this.startTime > 300) {
                        this.startTime = timestamp;
                        this.start = this.vertical ? this.preY : this.preX;
                    }
                    this.touchMove(this.scroller[this.property]);

                    evt.preventDefault();
                }
            }
        },
        _end: function (evt) {
            if (this.isTouchStart && this._preventMoveDefault) {
                var self = this;
                this.touchEnd(this.scroller[this.property]);
                if (this.hasMax && this.scroller[this.property] > this.max) {
                    this.to(this.scroller, this.property, this.max, 200, ease, this.change, this.reboundEnd);
                } else if (this.hasMin && this.scroller[this.property] < this.min) {
                    this.to(this.scroller, this.property, this.min, 200, ease, this.change, this.reboundEnd);
                } else if (this.inertia) {
                    //var y = evt.changedTouches[0].pageY;
                    var duration = new Date().getTime() - this.startTime;
                    if (duration < 300) {

                        var distance = ((this.vertical ? evt.changedTouches[0].pageY : evt.changedTouches[0].pageX) - this.start) * this.sensitivity,
                            speed = Math.abs(distance) / duration,
                            speed2 = this.factor * speed,
                            destination = this.scroller[this.property] + (speed2 * speed2) / (2 * this.deceleration) * (distance < 0 ? -1 : 1);
                        var tRatio = 1;
                        if (destination < this.min) {
                            tRatio = reverseEase((this.scroller[this.property] - this.min) / (this.scroller[this.property] - destination));
                            destination = this.min;

                        } else if (destination > this.max) {
                            tRatio = reverseEase((this.max - this.scroller[this.property]) / (destination - this.scroller[this.property]));
                            destination = this.max;
                        }
                        var duration = Math.round(speed / self.deceleration) * tRatio;
                        if (duration < 200) duration = 200;
                        self.to(this.scroller, this.property, Math.round(destination), duration, ease, function (value) {

                            //if (self.spring) {
                            //    if (self.hasMax && self.scroller[self.property] > self.max) {
                            //        setTimeout(function () {
                            //            this._cancelAnimation();
                            //            self.to(self.scroller, self.property, self.max, 200, ease, self.change);
                            //        }, 50);
                            //    } else if (self.hasMin && self.scroller[self.property] < self.min) {
                            //        setTimeout(function () {
                            //            this._cancelAnimation();
                            //            self.to(self.scroller, self.property, self.min, 200, ease, self.change);
                            //        }, 50);
                            //    }
                            //} else {

                            //    if (self.hasMax && self.scroller[self.property] > self.max) {
                            //        this._cancelAnimation();
                            //        self.scroller[self.property] = self.max;

                            //    } else if (self.hasMin && self.scroller[self.property] < self.min) {
                            //        this._cancelAnimation();
                            //        self.scroller[self.property] = self.min;

                            //    }
                            //}
                            //self.change(self.scroller[self.property]);
                        }, function () {
                            //if (self.step) {
                            //    self.correction(self.scroller, self.property);
                            //}
                        });
                    } else {
                        //if (self.step) {
                        //    self.correction(self.scroller, self.property);
                        //}
                    }
                } else {
                    //if (self.step) {
                    //    self.correction(self.scroller, self.property);
                    //}
                }
                if (!preventDefaultTest(evt.target, this.preventDefaultException)) {
                    evt.preventDefault();
                }
                this.isTouchStart = false;
            }
        },
        to: function (el, property, value, time, ease, onChange, onEnd) {
                var current = el[property];
                el.style[transitionDuration] = time + 'ms';
                el.style[transitionTimingFunction] = ease;
                //if (this.hasMax && value > this.max) {
                   
                //    time = time * (this.max - current) / (value - current);
                //    console.log((this.max - current) / (value - current))
                //    value = this.max;
                //} else if (this.hasMin && value < this.min) {
                //    time = time * (this.min - current) / (value - current);
                //    value = this.min;
                //}
                el[property] = value;        
            
        },
        correction: function (el, property) {
            var value = el[property];
            if (this.intelligentCorrection&&this.hasMax && this.hasMin) {              
                var prevPage = this.currentPage;
                var d = this.scroller[this.property] - (this.max - prevPage * this.step);
                if (Math.abs(d) > this.step / 20) {
                    if (d > 0) {
                        this.to(el, property, (value < 0 ? -1 : 1) * (prevPage - 1) * this.step, 400, ease, this.change, function (value) {
                            this.correctionEnd(value);
                            this.currentPage = prevPage - 1;
                        }.bind(this));
                       
                    } else {
                        this.to(el, property, (value < 0 ? -1 : 1) * (prevPage + 1) * this.step, 400, ease, this.change, function (value) {
                            this.correctionEnd(value);
                            this.currentPage = prevPage + 1;
                        }.bind(this));
                    }
                    
                } else {
                    this.to(el, property, (value < 0 ? -1 : 1) * prevPage * this.step, 400, ease, this.change, this.correctionEnd);
                }
            } else {              
                var rpt = Math.floor(Math.abs(value / this.step));
                var dy = value % this.step;
                if (Math.abs(dy) > this.step / 2) {
                    this.to(el, property, (value < 0 ? -1 : 1) * (rpt + 1) * this.step, 400, ease, this.change, this.correctionEnd);
                } else {
                    this.to(el, property, (value < 0 ? -1 : 1) * rpt * this.step, 400, ease, this.change, this.correctionEnd);
                }
            }
        },
        destory: function () {
            unbind(this.element, "touchstart", this._startHandler);
            unbind(this.element, endTransitionEventName, this._transitionEndHandler)
            unbind(window, "touchmove", this._moveHandler);
            unbind(window, "touchend", this._endHandler);
        }
    }

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = AlloyTouch;
    } else {
        window.AlloyTouch = AlloyTouch;
    }

})();