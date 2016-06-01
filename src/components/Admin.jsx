import React from 'react';
import ReactHowler from 'react-howler';

import socket from '../socket';

class Admin extends React.Component {

  constructor(props) {
    super(props);

    this.clearPlayers = this.clearPlayers.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleSound = this.handleSound.bind(this)
  }

  clearPlayers() {
    this.state.socket.emit('dropPlayers')
  }

  startGame() {
    socket.emit('start_game');
  }

  handleSound() {
    this.setState({
      playing: true
    })
  }

  render() {

    return (
      <div className='adminPage'>
            <h1 className='adminH1'>Admin page</h1>
            <div className='adminButtons'>
              <button className='adminButton' type='button' onClick={this.clearPlayers}>Restart Game</button>
              <button className='adminButton' type='button' onClick={this.startGame}>Start Game</button>
              <button className='adminButton' type='button' onClick={this.handleSound}>Test Sound</button>
            </div>  
      </div>
    )
  }
}


module.exports = Admin;
