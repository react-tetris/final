import React from 'react';

export default class Player extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 
  handleSubmit(event) {
    event.preventDefault();
    this.props.onAddPlayer(this.refs.userName.value.toUpperCase());
  }

  render() {
    console.log(this.props.allPlayers, 'THERE SHOULD BE ALLPLAYERS')
    return (
      <div className='enterScreen'>
        {Object.keys(this.props.allPlayers).length  <= 6 ? 
          <form className='enterForm' onSubmit={this.handleSubmit}>
          <input className='formInput' type='text' ref='userName' placeholder='Enter your Name'/>
          <button className='enterButton' type='submit'>Enter the GAME!</button>
        </form>
          : this.props.onGameFull()
        }
        {this.props.nameTaken ? <div>EAT Kabab</div>: ""}
      </div>
    );
  }
}

