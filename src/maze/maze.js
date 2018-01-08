import React, { Component } from 'react';
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
