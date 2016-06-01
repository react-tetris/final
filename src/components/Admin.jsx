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
            <h1 className='adminH1'>ADMIN</h1>
            <div className='adminButtons'>
              <button className='adminButton' type='button' onClick={this.clearPlayers}>RESTART</button>
              <button className='adminButton' type='button' onClick={this.startGame}>START</button>
            </div>  
      </div>
    )
  }
}


module.exports = Admin;
