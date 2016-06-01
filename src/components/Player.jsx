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

          <form className='enterForm' onSubmit={this.handleSubmit}>
          <input className='formInput' type='text' ref='userName' placeholder='Enter your Name'/>
          <button className='enterButton' type='submit'>Enter the GAME!</button>
        </form>
      </div>
    );
  }
}
