import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      size : 20,
      value : 20,
      maze : this.generateMazev2(20)
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateMazev2 = this.generateMazev2.bind(this);
  }

  generateMazev2 (size){
    var theMaze = new Array();
    var row = new Array();
    var nextrow = new Array();
    for(var j = 1; j <= size; j++){
      row.push({group: j, right : true, bottom: true, left:false , top:false, start: false, finish: false });
    }

    for(var i = 0; i < size; i++){
      //add any elements not in a set to a set
      var minimumNewSet = i * size + 1;
      for(var j = 0; j < size; j++){
        if(row[j] === undefined){
          row[j] = {group : minimumNewSet + j, right : true, bottom : true, left: false, top:false};
        }
      }

      //randomly merge some rows
      for(var j = 0; j < size-1; j++){
        if(row[j].group !== row[j+1].group && Math.random() < 0.5){
          row[j].right = false;
          row[j+1].group = row[j].group;
        }
      }

      //add one bottom connection to each group

      //find all of the groups
      var groups = [];
      for(var j = 0; j < size; j++){
        groups[row[j].group]= row[j].group;
      }

      //add exactly one bottom opening for the group
      groups.forEach(function(group){
        var finished = false;
        while(!finished){
          for(var j = 0; j < size; j++){
            if(row[j].group === group && Math.random() < .25){
              row[j].bottom = false;
              nextrow[j] = {group: row[j].group, bottom: true, left: false, right: true, top:false};
              finished = true;
              break;
            }
          }
        }
      });

      //merge everything together on the last set
      if(i == size-1){
        for(var j = 0; j< size-1; j++){
          if(row[j].group !== row[j+1].group){
            row[j].right = false;
            row[j+1].group = row[j].group;
          }
        }
      }

      //add the row to the maze
      theMaze.push(row);
      //set up the next iteration's arrays to be the proper ones
      row = nextrow;
      nextrow = new Array();
    }
    //add the borders to the maze
    for(var j = 0; j< size; j++){
      theMaze[0][j].top = true;
      theMaze[size-1][j].bottom = true;
      theMaze[j][0].left = true;
      theMaze[j][size-1].right = true;
    }

    var startx = Math.floor(Math.random() * size);
    var starty = Math.floor(Math.random() * size);
    var finishx = Math.floor(Math.random() * size);
    var finishy = Math.floor(Math.random() * size);

    theMaze[startx][starty].start = true;
    theMaze[finishx][finishy].finish = true;
    return theMaze;
  }

  handleChange(e){
    this.setState({value : e.target.value});
  }

  handleSubmit(e){
    this.setState({size: this.state.value}, function(){
      this.setState({maze: this.generateMazev2(this.state.size)});
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
      return (<table>{renderMaze}</table>);
    }else{
      return (<p>Generating</p>);
    }


  }
}

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
      style.marginTop = "-2px";
    }

    if(this.props.bottom){
      style.borderBottom =  "1px solid #000000";
      style.marginBottom = "-2px";
    }

    if(this.props.right){
      style.borderRight = "1px solid #000000";
      style.marginRight = "-2px";
    }

    if(this.props.left){
      style.borderLeft = "1px solid #000000";
      style.marginLeft= "-2px";
    }
    return (
      <td onClick={this.handleClick} style={style}>{this.state.filled? 'X' : null}</td>
    );
  }
}

export default App;
