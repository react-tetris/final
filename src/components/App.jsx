import React from 'react';

import socket from '../socket';

import Player from './Player';
import Queued from './Queued';
import Game from './Game';

export default class App extends React.Component {

	constructor() {
		super();

		this.state = {
			playState: 'STOPPED',
			players: {},
			nameTaken: false
		};

		this.scores = {};
	}

	componentDidMount() {
    var that = this;
    socket.emit('entering_game');

    socket.on('game_status', function(newGameState) {
      that.setState({
        playState: newGameState
      })
    });
		
    socket.on('dropPlayers', function(newGameState) {
      that.setState({
        playState: newGameState
      })
    });
    
    
    socket.on('start_game', function(state) {
      that.setState({
        playState: 'PLAYING',
        pieces: state.pieces,
        isPlayer: true,
				playerName: state.name
      });
    });

		socket.on('update_players', function(players) {
			that.setState({
				players: players
			});
		});
	  
//     socket.on('score_update', function(scoreData) {
// 			that.scores[scoreData.name] = scoreData.score;
// ​
// 			var rank = Object.keys(that.scores).map(function(playerName) {
// 				return {name: playerName, score: that.scores[playerName]}
// 			}).sort(
// 				function(a,b) {
// 					return b.score - a.score;
// 				}
// 			).findIndex(
// 				function(scoreData) {
// 					return scoreData.name === that.state.playerName;
// 				}
// 			) + 1;			
// 			if (that.refs.game) {
// 				that.refs.game.setRank(rank);
// 			}
// 		});	
}
   
 
  
	render() {
		if (this.state.playState === "STOPPED") {
      return <div className='alert'>loading...</div>;
    }

    if (this.state.playState === 'ACCEPTING_PLAYERS') {
      return <Player/>;
    }

    if (this.state.playState === 'PLAYING') {
      if (this.state.isPlayer === true) {
        return <Game playerName={this.state.playerName} gameBag={this.state.pieces}/>;
      }
      else {
        return <div className='alert'><header>
         <img src='http://flaticons.net/icons/Network%20and%20Security/Bomb.png' />
         <h1>BOMBTRIS</h1>
        </header>Game in session, please wait for the next game...</div>;
      }
    }

    if (this.state.playState === 'QUEUED') {
      return <Queued players={this.state.players} />;
    }

    if (this.state.playState === 'TOO_MANY_PLAYERS') {
      return <div className='alert'><header>
         <img src='http://flaticons.net/icons/Network%20and%20Security/Bomb.png' />
         <h1>BOMBTRIS</h1>
        </header>Game is full, please wait for the next game...</div>;
    }

		return <div>you have reached an unreachable state!</div>;
	}
}
