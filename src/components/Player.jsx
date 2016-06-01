import React from 'react';

import socket from '../socket';

export default class Player extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    socket.emit('new_player', this.refs.userName.value.toUpperCase());
  }

  render() {
    return (
      <div className='enterScreen'>
        <header>
         <h1>B</h1>
         <div className='fireBomb'>
            <div className='flameContainer'>
              <div className='red flame'></div>
              <div className='orange flame'></div>
              <div className='yellow flame'></div>
              <div className='white flame'></div>
              <div className='blue circle'></div>
              <div className='black circle'></div>
            </div>
          <img className='bombLogo' src='http://flaticons.net/icons/Network%20and%20Security/Bomb.png'/>
         </div>
         <h1 className='mbtris'>MBTRIS</h1>
        </header>
          <form className='enterForm' onSubmit={this.handleSubmit}>
            <input className='enterInput' type='text' ref='userName' placeholder='Enter your Name'/>
            <button className='enterButton' type='submit'>ENTER</button>
        </form>
      </div>
    );
  }
}
