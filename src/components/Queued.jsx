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
    
    return (
      <div className='queuedPage'>
        <header>
         <img src='http://flaticons.net/icons/Network%20and%20Security/Bomb.png' />
         <h1>BOMBTRIS</h1>
        </header>
         <h2>WAITING FOR PLAYERS</h2>
         <div className='loadingImageContainer'>
         <div className='loadingImage'>
            {IPiece.map((row, index) => <Grid.Row row={row} key={"pr"+index}/>)}
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
