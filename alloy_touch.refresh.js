/* AlloyTouch Refresh v0.1.0
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

    var PullToRefresh = function (element,option) {

        this.refreshPoint = option.refreshPoint;
        this.refreshingPoint = option.refreshingPoint;

        this.element = typeof element === "string" ? document.querySelector(element) : element;
        this.refreshTip = typeof option.refreshTip === "string" ? document.querySelector(option.refreshTip) : option.refreshTip;
        Transform(this.refreshTip,true);
        this.target = this.element;
        Transform(this.element,true);
        this.vertical = this._getValue(option.vertical, true);
        this.property = "translateY";
        this.tickID = 0;

        this.sensitivity = this._getValue(option.sensitivity, 1);
        this.moveFactor = this._getValue(option.moveFactor, 1);
        this.factor = this._getValue(option.factor, 1);

        this.outFactor = this._getValue(option.outFactor, 0.3);
        this.min = option.min;
        this.max = 0;
        this.deceleration = 0.0006;
        this.maxRegion = this._getValue(option.maxRegion, 60);

        var noop = function () { };
        this.change = option.change || noop;
        this.touchEnd = option.touchEnd || noop;
        this.touchStart = option.touchStart || noop;
        this.touchMove = option.touchMove || noop;
        this.touchCancel = option.touchCancel || noop;
        this.reboundEnd = option.reboundEnd || noop;
        this.animationEnd = option.animationEnd || noop;
        this.correctionEnd = option.correctionEnd || noop;
        this.refresh = option.refresh || noop;
        this.reachRefreshPoint = option.reachRefreshPoint || noop;
        this.notReachRefreshPoint = option.notReachRefreshPoint || noop;


        this.preventDefault = this._getValue(option.preventDefault, true);
        this.preventDefaultException = { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ };
        this.hasMin = !(this.min === undefined);
        this.hasMax = !(this.max === undefined);
        if (this.hasMin && this.hasMax && this.min > this.max) {
            throw "the min value can't be greater than the max value."
        }
        this.isTouchStart = false;

        bind(this.element, "touchstart", this._start.bind(this));
        bind(window, "touchmove", this._move.bind(this));
        bind(window, "touchend", this._end.bind(this));
        bind(window, "touchcancel", this._cancel.bind(this));

        this.refreshState ={
            PTR:"PTR",
            RTR:"RTR",
            RING:"RING"
        };
        this.currentState =  this.refreshState.PTR;
    };

    PullToRefresh.prototype = {
        _getValue: function (obj, defaultValue) {
            return obj === undefined ? defaultValue : obj;
        },
        _start: function (evt) {
            if(this._isInViewPort(this.element)){
                this.isTouchStart = true;
                this._firstTouchMove = true;
                this._preventMoveDefault = true;
                this.touchStart.call(this, evt, this.target[this.property]);
                cancelAnimationFrame(this.tickID);

                this._startX = this.preX = evt.touches[0].pageX;
                this._startY = this.preY = evt.touches[0].pageY;

            }
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
                    var d = (this.vertical ? evt.touches[0].pageY - this.preY : evt.touches[0].pageX - this.preX) * this.sensitivity;
                    var f = this.moveFactor;
                    if (this.hasMax && this.target[this.property] > this.max && d > 0) {
                        f = this.outFactor;
                    } else if (this.hasMin && this.target[this.property] < this.min && d < 0) {
                        f = this.outFactor;
                    }
                    d *= f;
                    this.preX = evt.touches[0].pageX;
                    this.preY = evt.touches[0].pageY;

                    if(this.target[this.property]+d>=0) {
                        this.target[this.property] += d;
                        evt.preventDefault();
                    }
                    this.change.call(this, this.target[this.property]);
                    this.refreshTip[this.property] =    this.target[this.property];
                    this.touchMove.call(this, evt, this.target[this.property]);
                    if(this.currentState!==this.refreshState.RING) {
                        if (this.target[this.property] > this.refreshPoint && this.currentState===this.refreshState.PTR) {
                            this.currentState=this.refreshState.RTR;
                            this.reachRefreshPoint.call(this);
                        }

                        if (this.target[this.property] < this.refreshPoint &&this.currentState===this.refreshState.RTR) {
                            this.currentState=this.refreshState.PTR;
                            this.notReachRefreshPoint.call(this);
                        }
                    }
                }
            }
        },
        _cancel: function (evt) {
            this.touchCancel.call(this, evt, this.target[this.property]);
            if (this.hasMax && this.target[this.property] > this.max) {
                this._to(this.max, 600, ease, this.change, function (value) {
                    this.reboundEnd.call(this, value);
                    this.animationEnd.call(this, value);
                }.bind(this));
            } else if (this.hasMin && this.target[this.property] < this.min) {
                this._to(this.min, 600, ease, this.change, function (value) {
                    this.reboundEnd.call(this, value);
                    this.animationEnd.call(this, value);
                }.bind(this));
            }
        },
        to: function (v, time, user_ease) {

            this._to(v, this._getValue(time, 600), user_ease || ease, this.change, function (value) {
                this._calculateIndex();
                this.reboundEnd.call(this, value);
                this.animationEnd.call(this, value);
            }.bind(this));

        },
        _end: function (evt) {
            if (this.isTouchStart && this._preventMoveDefault) {
                this.isTouchStart = false;
                var current = this.target[this.property];
                this.touchEnd.call(this, evt, current, this.currentPage);

                if(current>this.refreshPoint) {
                    if( this.currentState!== this.refreshState.RING) {
                        this.refresh();
                        this.currentState = this.refreshState.RING;
                    }
                    this._to(this.refreshingPoint, 600, ease, this.change, function (value) {

                    }.bind(this));
                }else if (this.hasMax && this.target[this.property] > this.max) {
                    this._to(this.max, 600, ease, this.change, function (value) {
                        this.reboundEnd.call(this, value);
                        this.animationEnd.call(this, value);
                    }.bind(this));
                } else if (this.hasMin && this.target[this.property] < this.min) {
                    this._to(this.min, 600, ease, this.change, function (value) {
                        this.reboundEnd.call(this, value);
                        this.animationEnd.call(this, value);
                    }.bind(this));
                }
                if (this.preventDefault && !preventDefaultTest(evt.target, this.preventDefaultException)) {
                    evt.preventDefault();
                }


            }
        },
        end:function () {
            this.currentState = this.refreshState.PTR;
            this._to(this.max, 600, ease, this.change, function (value) {

            }.bind(this));
        },
        _to: function (value, time, ease, onChange, onEnd) {
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

                    onChange && onChange.call(self, value);
                    self.refreshTip[self.property] =    self.target[self.property];
                    onEnd && onEnd.call(self, value);
                    return;
                }
                el[property] = dv * ease(dt / time) + current;
                self.tickID = requestAnimationFrame(toTick);
                onChange && onChange.call(self, el[property]);
                self.refreshTip[self.property] =    self.target[self.property];
            };
            toTick();
        },
        _isInViewPort:function (element){
            var d = document.documentElement,
                b = document.body,
                w = window,
                div = document.createElement("div");
            div.innerHTML = "  <div></div>";
            var lt = !(div.firstChild.nodeType === 3) ?
                { left: b.scrollLeft || d.scrollLeft, top: b.scrollTop || d.scrollTop } :
                { left: w.pageXOffset, top: w.pageYOffset };


            var elBox = element.getBoundingClientRect();

            return lt.left<=elBox.left&&lt.top<=elBox.top;

        }
    };



    window.AlloyTouch = window.AlloyTouch||{};
    AlloyTouch.PullToRefresh = PullToRefresh;

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = AlloyTouch;
    }

})();