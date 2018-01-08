import React, { Component } from 'react';

class Cell extends Component{
  constructor(props){
    super(props);
//calculate the width & height of each table Cell
    this.state = {
      filled: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.setState({filled : !this.state.filled});
  }

  render(){ //render the walls
    var style = {};
    style.width = "20px";
    style.height = "20px";
    if(this.props.start)style.backgroundColor = "#00ff00";
    if(this.props.finish)style.backgroundColor = "#ff0000";
    if(this.props.top){
      style.borderTop = "1px solid #000000";
    }

    if(this.props.bottom){
      style.borderBottom =  "1px solid #000000";
    }

    if(this.props.right){
      style.borderRight = "1px solid #000000";
    }

    if(this.props.left){
      style.borderLeft = "1px solid #000000";
    }
    return (
      <td onClick={this.handleClick} style={style}>{this.state.filled? 'X' : null}</td>
    );
  }
}

export default Cell;
