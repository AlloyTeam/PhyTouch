/* transformjs 1.0.1
 * By june01
 * Github: https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs
 */

'use strict';

import React from 'react';

var transform;
var propArr = ['translateX', 'translateY', 'translateZ', 'scaleX', 'scaleY', 'scaleZ', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'originX', 'originY', 'originZ'];
var hasOwnProperty = ({}).hasOwnProperty;

function getDiff(o, n) {
    let diff = [];

    if((!o && n) || (o && !n)) {
        diff = [].concat(propArr);
    } else if(n && o && o !== n) {
        for(let i=0,len=propArr.length; propArr.length; i++) {
            if(o[propArr[i]] !== n[propArr[i]]) {
                diff.push(propArr[i]);
            }
        }
    }

    return diff;
}

export default class Transform extends React.Component {
    constructor(props) {
        super(props);

        if(!window.Transform) {
            throw new Error('you need include transform.js')
        } else {
            transform = window.Transform;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !getDiff(this.props, nextProps).length;
    }

    componentDidMount() {
        if(this.el) this.target = transform(this.el, this.props.notPerspective);
    }

    componentWillReceiveProps(nextProps) {
        let diff = getDiff(this.props, nextProps);
        if(!diff.length) return;

        if(this.target) {
            diff.forEach((item) => {
                this.target[item] = nextProps[item];
            });
        }
    }

    render() {
        return <div 
            ref={(div) => {this.el = div;}}>
            {this.props.children}
        </div>;
    }
}