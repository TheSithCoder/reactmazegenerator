import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Cell from './maze/cell.js';
var generator = require('./generator');

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      size : 20,
      value : 20,
      maze : this.generateMaze(20)
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateMaze = this.generateMaze.bind(this);
  }

  generateMaze(size){
    var theMaze = new Array();
    var oldrow = new Array();
    for(var i = 0; i < size; i++){
      oldrow.push({group: 0, left: false, right: true, top: false, bottom: true, start:false, finish:false});
      oldrow[i].group = i;
    }


    for(var i = 0; i < size; i++){
      var row = this.nextEllerRow(oldrow);
      theMaze.push(row);
      oldrow = row.slice(); //ensures no passing by reference
    }
    row = this.finishMaze(oldrow);
    console.log(theMaze.length);
    theMaze = this.addBorders(theMaze);
    theMaze = this.addStartAndFinish(theMaze);
    return theMaze;
  }

  nextEllerRow(row){
    //set up the next row
    row = this.setUpEllerRow(row);
    //randomly add right walls
    for(var j = 0; j < row.length-1; j++){
      if(Math.random() < 0.5 && row[j].group !== row[j+1].group){
        row = this.mergeGroups(row[j].group, row[j+1].group, row);
        row[j].right = false;
      }
    }
    row = this.addBottomOpenings(row);
    console.log(row);
    return row;
  }

  setUpEllerRow(row){
    var newRow = new Array();
    for(var j = 0; j < row.length; j++){
      var group = row[j].group;
      if(row[j].bottom){
        group = generator();
      }
      newRow[j] = {group : group , left:false, right: true, top:false, bottom:true, start:false, finish:false};
    }
    return newRow;
  }

  mergeGroups(merger, mergee, row){
    row.forEach(function(element, index, arr){
      if(element.group == mergee){
        arr[index].group = merger;
      }
    });
    return row;
  }

  addBottomOpenings(row){
    //map the groups to a list of element numbers
    var groups = {};
    row.forEach(function(element, index){
      if(groups[element.group] == null || groups[element.group] == undefined){
          groups[element.group] = {};
          groups[element.group].indexes = [];
          groups[element.group].open = false;
      }
      groups[element.group].indexes.push(index);
    });
    var keys = Object.keys(groups);
    //iterate over each group. Ensure that there is at least one opening among them
    keys.forEach(function(element, index){
      var groupData = groups[element];
      for(var j = 0; j < groupData.indexes.length-1; j++){
        if(Math.random() < 0.5){//TODO remove debugging false
          groups[element].open = true;
          row[groupData.indexes[j]].bottom = false;
        }
      }
      //Ensures that the final square has an opening if none of the others do
      if(Math.random() < 0.5 || groupData.open == false){
        groups[element].open = true;
        row[groupData.indexes[groupData.indexes.length-1]].bottom = false;
      }
    });
    return row;
  }

  finishMaze(row){
    for(var j = 0; j < row.length-1; j++){
      if(row[j].group !== row[j+1].group){
        row[j].right = false;
        row = this.mergeGroups(row[j].group, row[j+1].group, row);
      }
    }
    return row;
  }

  addBorders(theMaze){
    //iterate over each group. Ensure that there is at least one opening among them
    var size = theMaze.length;
    for(var j = 0; j < size; j++){
      theMaze[0][j].top = true;
      theMaze[j][0].left = true;

      theMaze[size-1][j].bottom = true;
      theMaze[j][size-1].right = true;
    }
    return theMaze;
  }

  addStartAndFinish(theMaze){
    var size = theMaze.length;
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
      this.setState({maze: this.generateMaze(this.state.size)});
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
