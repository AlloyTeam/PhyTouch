; (function () {

    var matrix3D = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

        this.elements = Float32Array ? new Float32Array(16) : [];

        // TODO: if n11 is undefined, then just set to identity, otherwise copy all other values into matrix
        //   we should not support semi specification of Matrix4, it is just weird.

        var te = this.elements;

        te[0] = (n11 !== undefined) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
        te[1] = n21 || 0; te[5] = (n22 !== undefined) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
        te[2] = n31 || 0; te[6] = n32 || 0; te[10] = (n33 !== undefined) ? n33 : 1; te[14] = n34 || 0;
        te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = (n44 !== undefined) ? n44 : 1;
    }


    matrix3D.DEG_TO_RAD = Math.PI / 180;

    matrix3D.prototype = {
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
        appendTransform: function (perspective, x, y, z, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ, originX, originY, originZ) {

            var rx = rotateX * matrix3D.DEG_TO_RAD;
            var cosx = Math.cos(rx);
            var sinx = Math.sin(rx);

            var ry = rotateY * matrix3D.DEG_TO_RAD;
            var cosy = Math.cos(ry);
            var siny = Math.sin(ry);
            var rz = rotateZ * matrix3D.DEG_TO_RAD;
            var cosz = Math.cos(rz * -1);
            var sinz = Math.sin(rz * -1);

            this.multiplyMatrices(this,new matrix3D(
                cosy, 0, siny, x,
                0, 1, 0, y,
                -siny, 0, cosy, z,
                siny / perspective, 0, -cosy / perspective, (perspective - z) / perspective
            ));

            this.multiplyMatrices(this, new matrix3D(
                1, 0, 0, 0,
                0, cosx, sinx, 0,
                0, -sinx, cosx, 0,
                0, sinx / perspective, -cosx / perspective, 1
            ));

            this.multiplyMatrices(this, new matrix3D(
                cosz * scaleX, sinz * scaleY, 0, 0,
               -sinz * scaleX, cosz * scaleY, 0, 0,
                0, 0, 1 * scaleZ, 0,
               0, 0, -1 / perspective, 1
            ));


            if (originX || originY || originZ) {

                this.elements[12] -= originX * this.elements[0] + originY * this.elements[4] + originZ * this.elements[8];
                this.elements[13] -= originX * this.elements[1] + originY * this.elements[5] + originZ * this.elements[9];
                this.elements[14] -= originX * this.elements[2] + originY * this.elements[6] + originZ * this.elements[10];
            }
            return this;
        }

    }

    function observe(target, props, callback) {
        for (var i = 0, len = props.length; i < len; i++) {
            var prop = props[i];
            watch(target, prop, callback);
        }
    }

    function watch(target, prop, callback) {
        Object.defineProperty(target, prop, {
            get: function () {
                return this["__" + prop];
            },
            set: function (value) {
                if (value !== this["__" + prop]) {
                    this["__" + prop] = value;
                    callback(value);
                }

            }
        });
    }

    window.Transform = function (element) {

        observe(
            element,
            ["translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "perspective", "rotateX", "rotateY", "rotateZ", "originX", "originY", "originZ"],
            function () {
                var mtx = element.matrix3D.identity().appendTransform(element.perspective, element.translateX, element.translateY, element.translateZ, element.scaleX, element.scaleY, element.scaleZ, element.rotateX, element.rotateY, element.rotateZ, element.originX, element.originY, element.originZ);
                element.style.transform = element.style.msTransform = element.style.OTransform = element.style.MozTransform = element.style.webkitTransform = "matrix3d(" + Array.prototype.slice.call(mtx.elements).join(",") + ")";
            });

        //由于image自带了x\y\z，所有加上translate前缀
        element.matrix3D = new matrix3D();
        element.perspective = 400;
        element.scaleX = element.scaleY = element.scaleZ = 1;
        element.translateX = element.translateY = element.translateZ = element.rotateX = element.rotateY = element.rotateZ = element.originX = element.originY = element.originZ = 0;


    }

})();
