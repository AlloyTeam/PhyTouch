; (function () {
    var initializing = !1, fnTest = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/, __class = function () { }; __class.export = []; __class.extend = function (n) { __class.export.push(n); function i() { !initializing && this.ctor && this.ctor.apply(this, arguments) } var f = this.prototype, u, r, t; initializing = !0, u = new this, initializing = !1; for (t in n) t != "statics" && (u[t] = typeof n[t] == "function" && typeof f[t] == "function" && fnTest.test(n[t]) ? function (n, t) { return function () { var r = this._super, i; return this._super = f[n], i = t.apply(this, arguments), this._super = r, i } }(t, n[t]) : n[t]); for (r in this) this.hasOwnProperty(r) && r != "extend" && (i[r] = this[r]); if (i.prototype = u, n.statics) for (t in n.statics) n.statics.hasOwnProperty(t) && (i[t] = n.statics[t], t == "ctor" && i[t]()); return i.prototype.constructor = i, i.extend = arguments.callee, i.implement = function (n) { for (var t in n) u[t] = n[t] }, i };

    var observable = __class.extend({
        "statics": {
            "ctor": function () {
                this.methods = ["concat", "every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "reverse", "shift", "slice", "some", "sort", "splice", "unshift", "valueOf"],
                this.triggerStr = ["concat", "pop", "push", "reverse", "shift", "sort", "splice", "unshift"].join(",");
            },
            "type": function (obj) {
                var typeStr = Object.prototype.toString.call(obj).split(" ")[1];
                return typeStr.substr(0, typeStr.length - 1).toLowerCase();
            },
            "isArray": function (obj) {
                return this.type(obj) == "array";
            },
            "isInArray": function (arr, item) {
                for (var i = arr.length; --i > -1;) {
                    if (item === arr[i]) return true;
                }
                return false;
            },
            "isFunction": function (obj) {
                return this.type(obj) == "function";
            },
            "watch": function (target, arr) {
                return new this(target, arr);
            }
        },
        "ctor": function (target, arr) {
            for (var prop in target) {
                if (target.hasOwnProperty(prop)) {
                    if ((arr && observable.isInArray(arr, prop)) || !arr) {
                        this.watch(target, prop);
                    }
                }
            }
            if (target.change) throw "naming conflicts！observable will extend 'change' method to your object ."
            var self = this;
            target.change = function (fn) {
                self.propertyChangedHandler = fn;
            }
        },
        "onPropertyChanged": function (prop, value) {
            this.propertyChangedHandler && this.propertyChangedHandler(prop, value);
        },
        "mock": function (target) {
            var self = this;
            observable.methods.forEach(function (item) {
                target[item] = function () {
                    var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                    for (var cprop in this) {
                        if (this.hasOwnProperty(cprop) && cprop != "_super" && !observable.isFunction(this[cprop])) {
                            self.watch(this, cprop);
                        }
                    }
                    if (new RegExp("\\b" + item + "\\b").test(observable.triggerStr)) {
                        self.onPropertyChanged("array", item);
                    }
                    return result;
                };
            });
        },
        "watch": function (target, prop) {
            if (prop.substr(0, 2) == "__") return;
            var self = this;
            if (observable.isFunction(target[prop])) return;

            var currentValue = target["__" + prop] = target[prop];
            Object.defineProperty(target, prop, {
                get: function () {
                    return this["__" + prop];
                },
                set: function (value) {
                    this["__" + prop] = value;
                    self.onPropertyChanged(prop, value);
                }
            });

            if (observable.isArray(target)) {
                this.mock(target);
            }
            if (typeof currentValue == "object") {
                if (observable.isArray(currentValue)) {
                    this.mock(currentValue);
                }
                for (var cprop in currentValue) {
                    if (currentValue.hasOwnProperty(cprop) && cprop != "_super") {
                        this.watch(currentValue, cprop);
                    }
                }
            }
        }
    });


    var matrix3D = __class.extend({

        statics: {
            DEG_TO_RAD: Math.PI / 180
        },
        ctor: function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

            this.elements = Float32Array ? new Float32Array(16) : [];

            // TODO: if n11 is undefined, then just set to identity, otherwise copy all other values into matrix
            //   we should not support semi specification of Matrix4, it is just weird.

            var te = this.elements;

            te[0] = (n11 !== undefined) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
            te[1] = n21 || 0; te[5] = (n22 !== undefined) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
            te[2] = n31 || 0; te[6] = n32 || 0; te[10] = (n33 !== undefined) ? n33 : 1; te[14] = n34 || 0;
            te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = (n44 !== undefined) ? n44 : 1;
        },
        set: function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

            var te = this.elements;

            te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
            te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
            te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
            te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

            return this;

        },
        identity: function () {
            this.set(

               1, 0, 0, 0,
               0, 1, 0, 0,
               0, 0, 1, 0,
               0, 0, 0, 1

           );

            return this;
        },
        append: function (m) {
            return this.multiplyMatrices(this, m);

        },
        multiplyMatrices: function (a, b) {

            var ae = a.elements;
            var be = b.elements;
            var te = this.elements;

            var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
            var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
            var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
            var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

            var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
            var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
            var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
            var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

            te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

            te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

            te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

            te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

            return this;

        },
        appendTransform: function (perspective, x, y, z, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ, regX, regY, regZ) {

            var rx = rotateX * matrix3D.DEG_TO_RAD;
            var cosx = Math.cos(rx);
            var sinx = Math.sin(rx);

            var ry = rotateY * matrix3D.DEG_TO_RAD;
            var cosy = Math.cos(ry);
            var siny = Math.sin(ry);
            var rz = rotateZ * matrix3D.DEG_TO_RAD;
            var cosz = Math.cos(rz*-1);
            var sinz = Math.sin(rz*-1);

            this.append(new matrix3D(
                cosy, 0, siny, x,
                0, 1, 0, y,
                -siny, 0, cosy, z,
                siny / perspective, 0, -cosy / perspective, (perspective - z) / perspective
            ));

            this.append(new matrix3D(
                1, 0, 0, 0,
                0, cosx, sinx, 0,
                0, -sinx, cosx, 0,
                0, sinx / perspective, -cosx / perspective, 1
            ));
           
                this.append(new matrix3D(
                    cosz * scaleX, sinz * scaleY, 0, 0,
                   -sinz * scaleX, cosz * scaleY, 0, 0,
                    0, 0, 1 * scaleZ, 0,
                   0, 0, -1 / perspective, 1
                ));
            

            if (regX || regY || regZ) {

                this.elements[12] -= regX * this.elements[0] + regY * this.elements[4] + regZ * this.elements[8];
                this.elements[13] -= regX * this.elements[1] + regY * this.elements[5] + regZ * this.elements[9];
                this.elements[14] -= regX * this.elements[2] + regY * this.elements[6] + regZ * this.elements[10];
            }
            return this;
        }

    });

    window.Transform = function (element) {
        return new _Transform(element);
    }

    function _Transform(element) {
        element.perspective = 400;
        element.scaleX = element.scaleY = element.scaleZ = 1;
        element.x = element.y = element.z = element.rotateX = element.rotateY = element.rotateZ = element.regX = element.regY = element.skewX = element.skewY = element.regX = element.regY = element.regZ = 0;
        element.matrix3D = new matrix3D();
        var observer = observable.watch(element, ["x", "y", "z", "scaleX", "scaleY", "scaleZ", "perspective", "rotateX", "rotateY", "rotateZ", "regX", "regY", "regZ"]);

        this.element = element;
        var self = this;
        observer.propertyChangedHandler = function () {
            var mtx = self.element.matrix3D.identity().appendTransform(self.element.perspective, self.element.x, self.element.y, self.element.z, self.element.scaleX, self.element.scaleY, self.element.scaleZ, self.element.rotateX, self.element.rotateY, self.element.rotateZ, self.element.regX, self.element.regY, self.element.regZ);

            self.element.style.transform = self.element.style.msTransform = self.element.style.OTransform = self.element.style.MozTransform = self.element.style.webkitTransform = "matrix3d(" + Array.prototype.slice.call(mtx.elements).join(",") + ")";
        }
    }

})();