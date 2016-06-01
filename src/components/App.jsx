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
			players: {}
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

		socket.on('score_update', function(scoreData) {
			that.scores[scoreData.name] = scoreData.score;

			var rank = Object.keys(that.scores).map(function(playerName) {
				return {name: playerName, score: that.scores[playerName]}
			}).sort(
				function(a,b) {
					return b.score - a.score;
				}
			).findIndex(
				function(scoreData) {
					return scoreData.name === that.state.playerName;
				}
			) + 1;

			that.setState({
				rank: rank
			})
		});

		// //Retrieving score from each player Waiting for the girls for merge
		// socket.on('update_score', function(score) {
		// 	console.log(score);
		// 	that.setState({
		// 		scores: score
		// 	})
		// })

		// socket.on('name_taken', function() {
		//     that.setState({
		//     	nameTaken: true
		//     })
		// })

		// socket.on('create_ok', function(name) {
		//     that.setState({
		//     	playerName: name
		//     })
		// })
	}
	render() {
		if (this.state.playState === "STOPPED") {
      return <div>loading...</div>;
    }

    if (this.state.playState === 'ACCEPTING_PLAYERS') {
      return <Player/>;
    }

    if (this.state.playState === 'PLAYING') {
      if (this.state.isPlayer === true) {
        return <Game rank={this.state.rank} playerName={this.state.playerName} gameBag={this.state.pieces}/>;
      }
      else {
        return <div>A game is being played, please wait for the next game</div>;
      }
    }

    if (this.state.playState === 'QUEUED') {
      return <Queued players={this.state.players} />;
    }

    if (this.state.playState === 'TOO_MANY_PLAYERS') {
      return <div>There are too many players right now, wait for the next game</div>;
    }

		return <div>you have reached an unreachable state!</div>;
	}
}