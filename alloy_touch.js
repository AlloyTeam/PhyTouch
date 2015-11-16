/* AlloyTouch
 * By AlloyTeam http://www.alloyteam.com/
 * Github: https://github.com/AlloyTeam/AlloyTouch
 * MIT Licensed.
 */
﻿; (function () {
    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
              window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());

    //many thanks to http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
    function KeySpline(mX1, mY1, mX2, mY2) {

        this.get = function (aX) {
            if (mX1 == mY1 && mX2 == mY2) return aX; // linear
            return CalcBezier(GetTForX(aX), mY1, mY2);
        }

        function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
        function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
        function C(aA1) { return 3.0 * aA1; }

        // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
        function CalcBezier(aT, aA1, aA2) {
            return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
        }

        // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
        function GetSlope(aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }

        function GetTForX(aX) {
            // Newton raphson iteration
            var aGuessT = aX;
            for (var i = 0; i < 4; ++i) {
                var currentSlope = GetSlope(aGuessT, mX1, mX2);
                if (currentSlope == 0.0) return aGuessT;
                var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }
            return aGuessT;
        }
    }


    function bind(element, type, callback) {
        element.addEventListener(type, callback, false);
    }

    //http://kmdjs.github.io/dnt/demo43/index.html
    function iosEase(x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }

    function preventDefaultTest (el, exceptions) {
        for (var i in exceptions) {
            if (exceptions[i].test(el[i])) {
                return true;
            }
        }
        return false;
    }

    window.AlloyTouch = function (option) {
        var scroller = option.target,
            element = typeof option.touch==="string"?document.querySelector(option.touch):option.touch,
            vertical = option.vertical === undefined ? true : option.vertical,
            property = option.property,
            tickID = 0,
            preX,
            preY,
            sensitivity = option.sensitivity === undefined ? 1 : option.sensitivity,   
            factor = option.factor === undefined ? 1 : option.factor,
            sMf = sensitivity*factor,
            //拖动时候的摩擦因子
            factor1 = 1,
            min = option.min,
            max = option.max,
            startTime,
            start,
            easing = new KeySpline(0.1, 0.57, 0.1, 1),
            recording = false,
            deceleration = 0.0006,
            change = option.change || function () { },
            touchEnd = option.touchEnd || function () { },
            touchMove = option.touchMove || function () { },
            reboundEnd = option.reboundEnd || function () { },
            preventDefaultException= { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },
            hasMin = !(min === undefined),
            hasMax = !(max === undefined),
            isTouchStart=false,
            step=option.step, 
            spring = option.spring === undefined ? true : false;
            
        bind(element, "touchstart", function (evt) {
            isTouchStart = true;
            cancelAnimationFrame(tickID);        
            startTime = new Date().getTime();
            preX = evt.touches[0].pageX;
            preY = evt.touches[0].pageY;
            start = vertical ? preY : preX;
            if (!preventDefaultTest(evt.target, preventDefaultException)) {
                evt.preventDefault();
            }
        })

        bind(window, "touchmove", function (evt) {
            if (isTouchStart) {
                var d = (vertical ? evt.touches[0].pageY - preY : evt.touches[0].pageX - preX) * sMf;
                if (hasMax && scroller[property] > max && d > 0) {
                    factor1 = 0.3;
                } else if (hasMin && scroller[property] < min && d < 0) {
                    factor1 = 0.3;
                } else {
                    factor1 = 1;
                }
                d *= factor1;
                preX = evt.touches[0].pageX;
                preY = evt.touches[0].pageY;
                scroller[property] += d;
                change(scroller[property]);
                var timestamp = new Date().getTime();
                if (timestamp - startTime > 300) {
                    startTime = timestamp;
                    start = vertical ? preY : preX;
                }
                touchMove(scroller[property]);
                evt.preventDefault();
            }
        })

        bind(window, "touchend", function (evt) {
            if (isTouchStart) {
                touchEnd(scroller[property]);
                if (hasMax && scroller[property] > max) {
                    to(scroller, property, max, 200, iosEase,change,reboundEnd);
                } else if (hasMin && scroller[property] < min) {
                    to(scroller, property, min, 200, iosEase, change, reboundEnd);
                } else {
                    //var y = evt.changedTouches[0].pageY;
                    var duration = new Date().getTime() - startTime;
                    if (duration < 300) {
                        var distance = ((vertical ? evt.changedTouches[0].pageY : evt.changedTouches[0].pageX) - start) * sensitivity,
                            speed = Math.abs(distance) / duration,
                            speed2 = factor * speed,
                            destination = scroller[property] + (speed2 * speed2) / (2 * deceleration) * (distance < 0 ? -1 : 1);
                        to(scroller, property, Math.round(destination), Math.round(speed / deceleration), easing.get, function (value) {
                            
                            if (spring) {
                                if (hasMax && scroller[property] > max) {
                                    setTimeout(function () {
                                        cancelAnimationFrame(tickID);
                                        to(scroller, property, max, 200, iosEase, change);
                                    }, 50);
                                } else if (hasMin && scroller[property] < min) {
                                    setTimeout(function () {
                                        cancelAnimationFrame(tickID);
                                        to(scroller, property, min, 200, iosEase, change);
                                    }, 50);
                                }
                            } else {
                                
                                if (hasMax && scroller[property] > max) {
                                    cancelAnimationFrame(tickID);
                                    scroller[property] = max;
                               
                                } else if (hasMin && scroller[property] < min) {
                                    cancelAnimationFrame(tickID);
                                    scroller[property] = min;
                                      
                                }
                            }
                            change(scroller[property]);
                        }, function () {
                            if (step) {
                                correction(scroller, property);
                            }
                        });
                    } else {
                        if (step) {
                            correction(scroller, property);
                        }
                    }
                }
                if (!preventDefaultTest(evt.target, preventDefaultException)) {
                    evt.preventDefault();
                }
                isTouchStart = false;
            }
        })

        function to(el, property, value, time, ease,onChange,onEnd ) {
            
            var current = el[property];
            var dv = value - current;
            var beginTime = new Date();
            var toTick = function () {
               
                var dt = new Date() - beginTime;
                if (dt >= time) {
                    el[property] = value;
                    onChange && onChange(value);
                    onEnd&&onEnd(value);
                    return;
                }
                el[property] = Math.round(dv * ease(dt / time) + current);
                tickID = requestAnimationFrame(toTick);
                //cancelAnimationFrame必须在 tickID = requestAnimationFrame(toTick);的后面
                onChange && onChange(el[property]);
            }
            toTick();
        }

        function correction(el, property) {
            var value=el[property];
            var rpt = Math.floor(Math.abs(value / step));
            var dy = value % step;
            if (Math.abs(dy) > step / 2) {
                to(el, property, (value < 0 ? -1 : 1) * (rpt + 1) * step, 400, iosEase,change);
            } else {
                to(el, property, (value < 0 ? -1 : 1) * rpt * step, 400, iosEase,change);
            }
        }
    }
})();
