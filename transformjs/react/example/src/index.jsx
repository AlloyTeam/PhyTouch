import React, { Component } from 'react';
import { render } from 'react-dom';

import Transform from '../../react-transform.js';

class Root extends Component {

  constructor(props, context) {
    super(props, context);

    this.step = 0.02;
    this.xStep = 3;
    this.skewStep = 1;

    let state = {};
    for(let i=0; i<=10; i++) {
      state[`el${i}`] = {};
    }

    state.el4.originX = -50;
    state.el4.originY = -50;
    state.el8.originX = -150;

    this.state = state;

    this.animate = this.animate.bind(this);
  }

  animate() {
    this.state.el6.scaleX < 0.5 && (this.step *= -1);
    this.state.el6.scaleX > 1.5 && (this.step *= -1);

    this.state.el7.translateX < -50 && (this.xStep *= -1);
    this.state.el7.translateX > 50 && (this.xStep *= -1);

    this.state.el9.skewX > 30 && (this.skewStep *= -1);
    this.state.el9.skewX < -30 && (this.skewStep *= -1);

    this.setState({
      el1: {rotateZ: (this.state.el1.rotateZ || 0) + 1},
      el2: {rotateY: (this.state.el2.rotateY || 0) + 1},
      el3: {rotateX: (this.state.el3.rotateX || 0) + 1},
      el4: {rotateZ: (this.state.el4.rotateZ || 0) + 1},
      el5: {
        rotateY: (this.state.el5.rotateY || 0) + 1,
        rotateX: (this.state.el5.rotateX || 0) + 1
      },
      el6: {
        scaleX: (this.state.el6.scaleX || 0) + this.step,
        scaleY: (this.state.el6.scaleY || 0) + this.step
      },
      el7: {translateX: (this.state.el7.translateX || 0) + this.xStep},
      el8: {
        rotateY: (this.state.el8.rotateY || 0) + 1,
        rotateX: (this.state.el8.rotateX || 0) + 1
      },
      el9: {skewX: (this.state.el9.skewX || 0) + this.skewStep},
      el10: {skewY: (this.state.el10.skewY || 0) + this.skewStep}
    });
  }

  componentDidMount() {
    setTimeout(this.animate, 1000);
  }

  render() {
    return (
      <div>
        <Transform {...this.state.el1}>
          <div className="test" style={{'backgroundColor': 'green'}}>transformjs</div>
        </Transform>

        <Transform {...this.state.el2}>
          <div className="test" style={{'backgroundColor': 'red', 'left': '200px'}}>transformjs</div>
        </Transform>

        <Transform {...this.state.el3} notPerspective={true}>
          <div className="test" style={{'backgroundColor': 'blue', 'left': '400px'}}>transformjs</div>
        </Transform>

        <Transform {...this.state.el4}>
          <div className="test" style={{'backgroundColor': '#ff6a00', 'left': '600px'}}>transformjs</div>
        </Transform>

        <Transform {...this.state.el5}>
          <div className="test" style={{'backgroundColor': '#485f0f', 'left': '400px', 'top': '200px'}}>transformjs</div>
        </Transform>

        <Transform {...this.state.el6}>
          <div className="test" style={{'backgroundColor': '#485f0f', 'left': 0, 'top': '200px'}}>transformjs</div>
        </Transform>

        <Transform {...this.state.el7}>
          <div className="test" style={{'backgroundColor': '#291996', 'left': '200px', 'top': '200px'}}>transformjs</div>
        </Transform>

        <Transform {...this.state.el8}>
          <div className="test" style={{'backgroundColor': '#291996', 'left': '600px', 'top': '200px'}}>transformjs</div>
        </Transform>

        <Transform {...this.state.el9}>
          <div className="test" style={{'backgroundColor': '#291996', 'left': '200px', 'top': '400px'}}>transformjs</div>
        </Transform>

        <Transform {...this.state.el10}>
          <div className="test" style={{'backgroundColor': '#291996', 'left': '400px', 'top': '400px'}}>transformjs</div>
        </Transform>
      </div>
    );
  }
}

render(
	<Root />,
	document.getElementById('root')
);