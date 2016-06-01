import React from 'react';

import socket from '../socket';

export default class Player extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      nameTaken: false
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    var that = this
    socket.on('name_taken', function() {
      that.setState({
        nameTaken: true
      })
    });
  }

  handleSubmit(event) {
    event.preventDefault(); {
      this.refs.userName.value === '' ? '' : socket.emit('new_player', this.refs.userName.value.toUpperCase());
    }
  }

  render() {
    return (
      <div className='enterScreen'>
          <form className='enterForm' onSubmit={this.handleSubmit}>
            <input className='enterInput' type='text' ref='userName' placeholder='Enter your Name'/>
            <button className='enterButton' type='submit'>ENTER</button>
            {this.state.nameTaken ? <div>Name already in use</div> : ''}
        </form>
      </div>
    );
  }
}
