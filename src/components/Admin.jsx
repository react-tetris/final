import React from 'react';
import ReactHowler from 'react-howler';

import socket from '../socket';

class Admin extends React.Component {

  constructor(props) {
    super(props);

    this.clearPlayers = this.clearPlayers.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  clearPlayers() {
    socket.emit('dropPlayers')
  }

  startGame() {
    socket.emit('start_game');
  }

  render() {

    return (
      <div className='adminPage'>
            <h1 className='adminH1'>ADMIN</h1>
              <button className='adminButton' type='button' onClick={this.clearPlayers}>RESTART</button>
              <button className='adminButton' type='button' onClick={this.startGame}>START</button>
      </div>
    )
  }
}


module.exports = Admin;
