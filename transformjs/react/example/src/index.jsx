import React, { Component } from 'react';
import { render } from 'react-dom';

import Transform from '../../react-transform.js';

class Root extends Component {

  constructor(props, context) {
    super(props, context);

    this.step = 0.02;
    this.xStep = 3;
    this.skewStep = 1;

    this.state = {
      el1: {rotateZ: 0},
      el2: {rotateY: 0},
      el3: {rotateX: 0},
      el4: {rotateZ: 0},
      el5: {rotateY: 0, rotateX: 0},
      el6: {scaleX: 0, scaleY: 0},
      el7: {translateX: 0},
      el8: {rotateX: 0},
      el9: {skewX: 0},
      el10: {skewY: 0}
    };

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
      el1: {rotateZ: this.state.el1.rotateZ + 1},
      el2: {rotateY: this.state.el2.rotateY + 1},
      el3: {rotateX: this.state.el3.rotateX + 1},
      el4: {rotateZ: this.state.el4.rotateZ + 1},
      el5: {
        rotateY: this.state.el5.rotateY + 1,
        rotateX: this.state.el5.rotateX + 1
      },
      el6: {
        scaleX: this.state.el6.scaleX + this.step,
        scaleY: this.state.el6.scaleY + this.step
      },
      el7: {translateX: this.state.el7.translateX + this.xStep},
      el8: {
        rotateY: this.state.el8.rotateY + 1,
        rotateX: this.state.el8.rotateX + 1
      },
      el9: {skewX: this.state.el9.skewX + this.skewStep},
      el10: {skewY: this.state.el10.skewY + this.skewStep}
    });
  }

  componentDidMount() {
    setTimeout(this.animate, 1000);
  }

  render() {
    return (
      <div>
        <Transform rotateZ={this.state.el1.rotateZ}>
          <div className="test" style={{'backgroundColor': 'green'}}>transformjs</div>
        </Transform>

        <Transform rotateY={this.state.el2.rotateY}>
          <div className="test" style={{'backgroundColor': 'red', 'left': '200px'}}>transformjs</div>
        </Transform>

        <Transform rotateX={this.state.el3.rotateX} notPerspective={true}>
          <div className="test" style={{'backgroundColor': 'blue', 'left': '400px'}}>transformjs</div>
        </Transform>

        <Transform originX={-50} originY={-50} rotateZ={this.state.el4.rotateZ} >
          <div className="test" style={{'backgroundColor': '#ff6a00', 'left': '600px'}}>transformjs</div>
        </Transform>

        <Transform rotateY={this.state.el5.rotateY} rotateX={this.state.el5.rotateX}>
          <div className="test" style={{'backgroundColor': '#485f0f', 'left': '400px', 'top': '200px'}}>transformjs</div>
        </Transform>

        <Transform scaleX={this.state.el6.scaleX} scaleY={this.state.el6.scaleY}>
          <div className="test" style={{'backgroundColor': '#485f0f', 'left': 0, 'top': '200px'}}>transformjs</div>
        </Transform>

        <Transform translateX={this.state.el7.translateX}>
          <div className="test" style={{'backgroundColor': '#291996', 'left': '200px', 'top': '200px'}}>transformjs</div>
        </Transform>

        <Transform rotateX={this.state.el8.rotateX} rotateY={-150}>
          <div className="test" style={{'backgroundColor': '#291996', 'left': '600px', 'top': '200px'}}>transformjs</div>
        </Transform>

        <Transform skewX={this.state.el9.skewX}>
          <div className="test" style={{'backgroundColor': '#291996', 'left': '200px', 'top': '400px'}}>transformjs</div>
        </Transform>

        <Transform skewY={this.state.el10.skewY}>
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