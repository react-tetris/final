import React from 'react';
import constants from '../constants.js';

function Row(props) {

    function giveClass(num){
        var theClass;
        switch (num){
           case 0: 
                theClass = "emptyCell";
                break; 
           case 1:
                theClass = "I";
                break;
           case 2:
                theClass = "J";
                break;
           case 3:
                theClass = "L";
                break;
           case 4:
                theClass = "O";
                break;
           case 5:
                theClass = "S";
                break;
           case 6:
                theClass = "T";
                break;
           case 7:
                theClass = "Z";
                break;
        }
        if (props.shadow){
            theClass += " shadow";
        }
        // if (props.hardDrop){
        //     theClass += " hardDrop";            
        // } 
        return theClass;
    }
    
    return (
        <div className="row">
            {props.row.map(
                (cell, index) => cell === 0 ? <div className={giveClass(cell)} key={"codrin" + index + Math.floor(Math.random()*100)}></div> : <div className={giveClass(cell)} key={"codrin" + index + Math.floor(Math.random()*100)}></div>
            )}
        </div>
    )
}

function Grid(props) {

    var currentX = props.activePiece.activePiecePosition.x / constants.GRID_COLS * 100;
    var currentY;
    // if (props.hardDrop) {
    //     currentY = props.hardDrop / constants.GRID_ROWS * 100;
    // }
    // else {
        currentY = Math.floor(props.activePiece.activePiecePosition.y) / constants.GRID_ROWS * 100;
    // }
    var shadowY = props.shadowY / constants.GRID_ROWS * 100;
    return (
        <div className="container">
            <div className="grid">
            {   
                props.grid.map(
                    (row, index) => <Row row={row} key={"r"+index} />
                )
            }
            </div>
            <div className="currentPiece" style={{position: 'absolute', top: currentY + '%', left: currentX + '%'}}>
                {   
                    props.activePiece.activePiece.map(
                        (row, index) => <Row row={row} hardDrop={props.hardDrop} key={"pr"+index} />
                    )
                }
            </div>
            <div className="shadowPiece" style={{position: 'absolute', top: shadowY + '%', left: currentX + '%'}}>
                {   
                    props.activePiece.activePiece.map(
                        (row, index) => <Row row={row} shadow={true} key={"sr"+index} />
                    )
                }            
            </div>
        </div>
    )
}

//get initial grid of 0s for any given height/width
function GetInitialGrid(rows, cols){
    var grid = [];
    for (var row=0; row<rows; row++){
        grid[row]=[];
        for (var col=0; col<cols; col++){
            grid[row][col] = 0;
        }
    }
    return grid;
}

module.exports={
    GetInitialGrid: GetInitialGrid,
    Grid: Grid,
    Row: Row
}