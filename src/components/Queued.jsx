import React from 'react';

export default class Queued extends React.Component {
  render() {
    return (
      <div className='allPage'>
         <h1 className='waiting-h1'>Waiting for all players</h1>
         <div><img src="/img/loading.gif"/></div>
         <h2 className='connected-title'>Connected players</h2>
         <ul>
           {
             Object.keys(this.props.players).map((player, i) => {
               return <li className='player-list-waiting' key={this.props.players[player].socketId}>{this.props.players[player].playerName}</li>
             })
           }
         </ul>
     </div>
    )
  }
}
