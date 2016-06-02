import React from 'react';

import constants from '../constants.js';
import gp from '../game_play.js';
import Grid from './grid.jsx';


export default class Queued extends React.Component {
  
  render() {
    
    var IPiece = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
        
    var JPiece = [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0]]
      
    var LPiece = [
      [0, 0, 3],
      [3, 3, 3],
      [0, 0, 0]]
      
    var OPiece = [
      [4, 4],
      [4, 4]]
      
    var SPiece = [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0]]
      
    var TPiece = [
      [0, 6, 0],
      [6, 6, 6],
      [0, 0, 0]]
        
    var ZPiece = [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0]]  
    
    
    return (
      <div className='queuedPage'>
        <header>
          <h1>B</h1>
          <img className='bombLogo' src='http://flaticons.net/icons/Network%20and%20Security/Bomb.png'/>
          <h1 className='mbtris'>MBTRIS</h1>
        </header>
         <h2>WAITING FOR PLAYERS</h2>
         <div className='loadingImageContainer'>
         <div className='rowOne'>
            <div className='loadingImage'>
                {IPiece.map((row, index) => <Grid.Row row={row} key={"pr"+index}/>)}
            </div>
            <div className='loadingImage'>
                {JPiece.map((row, index) => <Grid.Row row={row} key={"pr"+index}/>)}
             </div>
            <div className='loadingImage'>
                {SPiece.map((row, index) => <Grid.Row row={row} key={"pr"+index}/>)}
            </div>
         </div>
         <div className='rowTwo'>
            <div className='loadingImage'>
                {OPiece.map((row, index) => <Grid.Row row={row} key={"pr"+index}/>)}
            </div>
         </div>
         <div className='rowThree'>
            <div className='loadingImage'>
                {LPiece.map((row, index) => <Grid.Row row={row} key={"pr"+index}/>)}
            </div>
            <div className='loadingImage'>
               {TPiece.map((row, index) => <Grid.Row row={row} key={"pr"+index}/>)}
            </div>
            <div className='loadingImage'>
               {ZPiece.map((row, index) => <Grid.Row row={row} key={"pr"+index}/>)}
            </div>
         </div>
         </div>
         <ul>
           {
             Object.keys(this.props.players).map((player, i) => {
               return <li key={this.props.players[player].socketId}>{this.props.players[player].playerName}</li>
             })
           }
         </ul>
     </div>
    )
  }
}
