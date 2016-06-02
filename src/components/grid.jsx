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
           case 8:
                theClass = "addedLines";
                break;
        }
        if (props.shadow){
            theClass += " shadow";
        }

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
        // var currentPieceLength = props.activePiece.length;
        // var currentPieceWidth = currentPieceLength/constants.GRID_COLS * 100;
        // var currentPieceHeight = currentPieceLength/constants.GRID_ROWS * 100;
        // var currentX = props.activePiece.activePiecePosition.x / constants.GRID_COLS * 100;
        var currentX = props.activePiece.activePiecePosition.x * props.scaling;
        var currentY;
        //currentY = Math.floor(props.activePiece.activePiecePosition.y) / constants.GRID_ROWS * 100;
        currentY = Math.floor(props.activePiece.activePiecePosition.y) * props.scaling;
        //var shadowY = props.shadowY / constants.GRID_ROWS * 100;
        var shadowY = props.shadowY * props.scaling;
        return (

            <div className={props.handicap === 'shake' ? 'shake container' : (props.handicap === 'blur' ? 'blur container' : (props.handicap === 'flip' ? 'flipdiv container' : (props.lastPlayer ? 'container lastPlayer' : 'container')))}>
                {props.handicap === 'troll' ? <div className='troll'><img src='http://vignette2.wikia.nocookie.net/roblox/images/3/38/Transparent_Troll_Face.png/revision/latest?cb=20120713214853' /></div> : '' }
                {props.message ? <h1 className='message'>{props.message}</h1> : ''}
                {props.handicap === 'reverse' ? <h1 className='message'>REVERSE</h1> : ''}
                <div className={props.lastPlayer ? "grid lastPlayer" : "grid"} id="grid">
            {
                props.grid.map(
                    (row, index) => <Row row={row} key={"r"+index} />
                )
            }
                </div>
            <div className="currentPiece" style={{position: 'absolute', top: currentY + 'vh', left: currentX + 'vh'}}>
                  {
                        props.activePiece.activePiece.map(
                            (row, index) => <Row row={row} key={"pr"+index} />
                        )
                  }
            </div>
                <div className="shadowPiece" style={{position: 'absolute', top: shadowY + 'vh', left: currentX + 'vh'}}>
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
function getInitialGrid(rows, cols){
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
    getInitialGrid: getInitialGrid,
    Grid: Grid,
    Row: Row
}
