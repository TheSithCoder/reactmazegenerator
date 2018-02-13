import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Cell from './maze/cell.js';
var generator = require('./maze/generator.js');

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      size : 20,
      value : 20
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e){
    this.setState({...this.state, value : e.target.value});
  }

  handleSubmit(e){
    this.setState({size: this.state.value}, function(){
      this.setState({maze: this.generateMazev3(this.state.size)});
    });
    e.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label>Size: </label>
          <input type="number" min="3" step="1" onChange={this.handleChange} value={this.state.value}></input>
          <input type="submit" value="Generate Maze"></input>
        </form>
        <Maze size={this.state.size} maze={this.state.maze}></Maze>
      </div>
    );
  }
}

class Maze extends Component{
  render(){
    var renderMaze = new Array(); //store the table
    //calculate the percentage size of each Cell
    var size = 80.0 / this.props.size; //the table should ideally take up 80% of the page
    if(this.props.maze !== null){
      this.props.maze.forEach(function (row, index, arr){
        var newRow = new Array();
        row.forEach(function (box, theIndex, arr){
          newRow[theIndex] = <Cell size={size} top={box.top} bottom={box.bottom} right={box.right} left={box.left} start={box.start} finish={box.finish}></Cell>;
        });
        renderMaze[index] = <tr>{newRow}</tr>;
      });
      return (<table key={generator()}>{renderMaze}</table>); //call to generator to clear the maze each time a new one is generated
    }else{
      return (<p>Generating</p>);
    }
  }
}

export default App;
