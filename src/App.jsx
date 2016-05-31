//Node modules
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, browserHistory} from 'react-router';

//socket
import io from 'socket.io-client';
const socket = io();

//Game components
import Player from './components/player.js';
import Admin from './components/admin.js';
import Megatron from './components/megatron_screen.js';
import constants from './constants.js';
import Grid from './components/grid.jsx';
import gp from './game_play.js';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			grid: Grid.GetInitialGrid(constants.GRID_ROWS, constants.GRID_COLS),
			gameBag: this.props.gameBag,
			activePiece: constants.SHAPES[this.props.gameBag[0]],
			activePiecePosition: {
				x: constants.X_START,
				y: constants.Y_START
			},
			nextPiece: constants.SHAPES[this.props.gameBag[1]],
			ySpeed: 8,
			lines: 0,
			totalLines: 0,
			score: 0,
			gameStatus: props.serverState.gameStatus,
			playerName: ''
		}
		this.updateGameState = this.updateGameState.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
		this.handleKeyup = this.handleKeyup.bind(this);

		this.addPlayer = this.addPlayer.bind(this);
		this.handleGameFull = this.handleGameFull.bind(this);
	}
	componentDidMount() {
	
		document.addEventListener('keydown', this.handleKeydown);
		document.addEventListener('keyup', this.handleKeyup);
		this.pieceCounter = 1;
		this.serverTimer = new Date();
		this.updateGameState();
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeydown);
		document.removeEventListener('keyup', this.handleKeyup);
	}
	componentWillReceiveProps(){
		console.log(this.props)
			console.log("THIS SHIT IS RUNNING IN THE FORCEING OF TSHIT")
		this.state.gameStatus = this.props.serverState.gameStatus;
		if(this.props.serverState.dropTheBase){
			this.forceUpdate()
		}
		
	
	}
	

	addPlayer(name) {
		var playerName = {
			name: name
		}
		this.setState({
			playerName: name
		})
		socket.emit('new_player', playerName)
	}
	handleGameFull() {
		this.setState({
			gameStatus: "DENIED"
		})
	}

	//right 39
	//left 37
	//up 38
	//down 40
	//space 32
	handleKeydown(e) {
		//only handle key events if piece is not in hard drop mode
		if (!this.hardDrop) {
			switch (e.which) {
				case 39:
					if (gp.canMoveRight(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x)) {
						var x = this.state.activePiecePosition.x;
						var newX = x + 1;
						this.state.activePiecePosition.x = newX;
						this.setState({
							activePiecePosition: this.state.activePiecePosition
						});
					}
					return;
				case 37:
					if (gp.canMoveLeft(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x)) {
						var x = this.state.activePiecePosition.x;
						var newX = x - 1;
						this.state.activePiecePosition.x = newX;
						this.setState({
							activePiecePosition: this.state.activePiecePosition
						});
					}
					return;
				case 38:
					if (gp.canRotate(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x)) {
						this.setState({
							activePiece: gp.rotateRight(this.state.activePiece)
						});
					}
					return;
				case 40:
					this.fastDrop = true;
					return;
				case 32:
					var yPositionDiff = 20 - Math.floor(this.state.activePiecePosition.y);
					var newScore = this.state.score + yPositionDiff;
					this.setState({
						ySpeed: 60,
						score: newScore
					});
					this.hardDrop = true;
			}
		}
	}

	handleKeyup(e) {
		if (e.which === 40) {
			this.fastDrop = false;
		}
	}

	updateGameState() {
	
		if (this.state.gameStatus === "ACTIVE") {
			var speed = this.fastDrop ? 15 : this.state.ySpeed;
			var currentState = this.state;
			var y = currentState.activePiecePosition.y;
	
			if (gp.canMoveDown(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x) && !this.hardDrop) {
				this.time = null;
				var newY = this.state.activePiecePosition.y + 1 / 60 * speed;
				this.state.activePiecePosition.y = newY;
				this.setState({
					activePiecePosition: this.state.activePiecePosition
				});
		}
		else {
			if (this.time || this.hardDrop) {
				if (new Date() - this.time > 1000 / 2 || this.hardDrop) {
					this.time = null;
					var finalY = this.state.activePiecePosition.y;
					if (this.hardDrop) {
						finalY = gp.getBottomMostPosition(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x)
					}
					var mergedGrid = gp.mergeGrid(this.state.grid, this.state.activePiece, this.state.activePiecePosition.x, finalY);
					var gridStatus = gp.clearLines(mergedGrid);
					var clearedGrid = gridStatus.clearedGrid;
					var gameOver = gridStatus.gameOver;
					var currLines = this.state.totalLines;
					var newLines = gridStatus.clearedLines + currLines;
					var currScore = this.state.score;
					var newScore = gp.getPoints(gridStatus.clearedLines) + currScore;
					if (gameOver) {
						return;
					}
					else {
						
						
						var playerState = {
							grid: clearedGrid,
							nextPiece: constants.SHAPES[this.state.gameBag[this.pieceCounter + 1]],
							activePiece: constants.SHAPES[this.state.gameBag[this.pieceCounter]],
							activePiecePosition: {
								x: constants.X_START,
								y: constants.Y_START
							},
							totalLines: newLines,
							score: newScore,
							ySpeed: 8
						};
						
						
						
						this.setState(playerState);
						this.pieceCounter++;
						this.hardDrop = false;
					}
				}
			}
			else {
				this.time = new Date();
			}
		}
		
		}
		
		
		if(new Date() - this.serverTimer > 250){
			var playerInfo = {
				grid: this.state.grid,
				nextPiece: this.state.nextPiece,
				activePiece: this.state.activePiece,
				activePiecePosition: this.state.activePiecePosition,
				totalLines: this.state.totalLines,
				score: this.state.score,
				hardDrop: this.hardDrop,
				playerName: this.state.playerName
			}
			
			console.log(this.state.playerName, "THIS SHOULD BE THE PLAYER")
			
			if(this.state.playerName && this.state.gameStatus === 'ACTIVE'){
				console.log(this.state.playerName)
				socket.emit('megatron_screen', playerInfo)
			}
			
			this.serverTimer = new Date();
		}
		requestAnimationFrame(this.updateGameState)
	}

	render() {
		console.log(this.state, "THE STATE IN APP")
		if (this.props.serverState.gameStatus === "QUEUED") {

			return (
				<div className='allPage'>
		          <h1 className='waiting-h1'>Waiting for all players</h1>
		          <div><img src="../img/loading.gif"/></div>
		          <h2 className='connected-title'>Connected players</h2>
		          <ul>
		            {
		              Object.keys(this.props.serverState.allplayers).map((player, i) => {
		                return <li className='player-list-waiting' key={this.props.serverState.allplayers[player].socketId}>{this.props.serverState.allplayers[player].playerName}</li>
		              })
		            }
		          </ul>
        		</div>)
		}

		 if (this.props.serverState.gameStatus === 'DENIED') {
			return (<div>there are too many players, please wait for the next game</div>)
		}

		if (this.props.serverState.gameStatus === 'STOPPED') {
			return (
				<div>
					<Player checkName={this.props.serverState.nameTaken} onAddPlayer={this.addPlayer} denied={this.props.serverState.gameStatus} onGameFull={this.handleGameFull}  allPlayers={this.props.serverState.allplayers}/>
				    {this.props.children}
      			</div>)
		}
			else {
			return (
			<div className="page">
				<div className="leftSidebar">
					<h1>NEXT</h1>
					<div className="nextPiece">
						{this.state.nextPiece.map((row, index) => <Grid.Row row={row} key={"pr" + index}/>) }
					</div>
					<div className="rank"></div>
					<div className="lines">
						<h1>LINES</h1>
						<h2>{this.state.totalLines}</h2>
					</div>
					<div className="score">
						<h1>SCORE</h1>
						<h2>{this.state.score}</h2>
					</div>
				</div>
				<Grid.Grid grid={this.state.grid} hardDrop={this.hardDrop ? gp.getBottomMostPosition(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x) : null} activePiece={{ activePiece: this.state.activePiece, activePiecePosition: this.state.activePiecePosition }} shadowY={gp.getBottomMostPosition(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x) } />
				<div className="sidebar">
					<div className="players">PLAYERS</div>
					<div className="handicaps">HANDICAPS</div>
				</div>
			</div>)
		}
	}
}


// App.propTypes = {};
// App.defaultProps = {};


class AdminWrapper extends React.Component {
	render() {
		return (<Admin socket={socket}/>);
	}
}

class AppWrapper extends React.Component {

	constructor() {
		super();

		this.state = {
			gameStatus: 'STOPPED',
			connect: false,
			disconnect: false,
			denied: false,
			allplayers: {},
			nameTaken: false,
			playerName: '',
			gameBag: gp.getGamePieces()
		}
	}

	componentWillMount() {

		var that = this;
		socket.on('connect', function() {
			that.setState({
				connect: true
			})
		});

		//on player disconnect, server sends a refreshed list of queued users   
		socket.on('logout', function(data) {
			//console.log(data, "THIS IS THE NEW LIST after someone exits")
			that.setState({
				allplayers: data
			})
		});

		//If your name is submited in the first 6 players you are queued
		socket.on('queued', function() {
			that.setState({
				gameStatus: 'QUEUED'
			})
		});

		//If game room is full, 7th player will be refused
		socket.on('denied', function(msg) {
			//console.log(msg);
			that.setState({
				gameStatus: 'DENIED'
			})
		})

		//Get the list of players from the server
		socket.on('playerList', function(data) {
			//console.log(data, "All players Data")
			that.setState({
				allplayers: data
			})
		})

		//Retrieving score from each player Waiting for the girls for merge
		socket.on('update_score', function(score) {
			console.log(score);
			that.setState({
				scores: score
			})
		})

		//When the Clear player button is clicked on the Admin page all players are removed from server
		socket.on('dropPlayers', function() {
			console.log("THIS IS WHEN THE BASE WAS DROPPED");
			that.setState({
			gameStatus: 'STOPPED',
			connect: false,
			disconnect: false,
			denied: false,
			allplayers: {},
			nameTaken: false,
			playerName: '',
			gameBag: gp.getGamePieces(),
			dropTheBase: true
			})
			
			that.forceUpdate()
		})

		socket.on('start_game', function() {
			console.log("GAME WAS STARTED")
			that.setState({
				gameStatus: 'ACTIVE'
			})
			that.forceUpdate();
		})
		
		socket.on('name_taken', function() {
		    that.setState({
		    	nameTaken: true
		    })
		})
		
		socket.on('create_ok', function(name) {
		    that.setState({
		    	playerName: name
		    })
		})
	}
	render() {
		console.log(this.state.gameStatus, "THE STATUSES")
		return (<App serverState={this.state} gameBag={this.state.gameBag}/>);
	}
}

class MegatronWrapper extends React.Component {
	render(){
		return (<Megatron socket={socket}/>)
	}
}

var routes = (
	<Router history={browserHistory}>
    <Route path="/" component={AppWrapper} />
    <Route path="/admin" component={AdminWrapper} />
    <Route path="/megatron" component={MegatronWrapper} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('#app'));
