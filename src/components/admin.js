import React from 'react';
import ReactHowler from 'react-howler';



class Admin extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: this.props.socket,
      playing: false
    };
    this.clearPlayers = this.clearPlayers.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleSound = this.handleSound.bind(this)
  }

  clearPlayers() {
    this.state.socket.emit('dropPlayers')
  }

  startGame() {
    this.state.socket.emit('start_game', 'server received!')
  }

  handleSound() {
    this.setState({
      playing: true
    })
  }

  render() {
  
    return (
      <div className='admin-page'>
            <h1 className='admin-h1'>Admin page</h1>
          <ReactHowler
          src={'../sound/videoplayback.m4a'}
          playing={this.state.playing}
        />
            <button className='arcade-button' type='button' onClick={this.clearPlayers}>Restart Game</button>
            <button className='arcade-button' type='button' onClick={this.startGame}>Start Game</button>
            <button type='button' onClick={this.handleSound}>Test Sound</button>
          </div>
    )
  }
}


module.exports = Admin;