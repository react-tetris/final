import React from 'react';
import ReactDOM from 'react-dom';
import Hammer from 'react-hammerjs';

import constants from '../constants.js';
import Grid from './grid.jsx';
import gp from '../game_play.js';
import h from '../handicaps.js';

import socket from '../socket';

export default class Game extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			grid: Grid.getInitialGrid(constants.GRID_ROWS, constants.GRID_COLS),
			gameBag: this.props.gameBag,
			activePiece: constants.SHAPES[this.props.gameBag[0]],
			activePiecePosition: {
				x: constants.X_START,
				y: constants.Y_START
			},
			nextPiece : constants.SHAPES[this.props.gameBag[1]],
			ySpeed: constants.DEFAULT_YSPEED,
			lines: 0,
			totalLines: 0,
			score: 0,
			handicapsAcc: [],
			handicapBombs: [],
			gameMessage: 1
		}
		this.serverTimer = 0;
		this.updateGameState = this.updateGameState.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
		this.handleKeyup = this.handleKeyup.bind(this);
		this.handleRightMove = this.handleRightMove.bind(this);
		this.handleLeftMove = this.handleLeftMove.bind(this);
		this.handleHardDrop = this.handleHardDrop.bind(this);
		this.handleRotate = this.handleRotate.bind(this);
		this.beforeGame = this.beforeGame.bind(this);
		this.handleBombClick = this.handleBombClick.bind(this);

		this.handleSwipe = this.handleSwipe.bind(this);
		this.goFS = this.goFS.bind(this);
	}
	componentDidMount() {
		var that = this;
		document.addEventListener('keydown', this.handleKeydown);
		document.addEventListener('keyup', this.handleKeyup);
		this.pieceCounter = 1;
		this.gameStartTime = new Date();
		this.beforeGame();
		//this.updateGameState();
		// setTimeout(function(){
		// 	that.state.handicapBombs.push({name: 'speedUp', maxTime: 2000})
		// }, 2000)
		// setTimeout(function(){
		// 	that.state.handicapBombs.push({name: 'extraLines'})
		// }, 4000);
		// setTimeout(function(){
		// 	that.state.handicapBombs.push({name: 'blur', maxTime: 5000})
		// }, 6000)
		// setTimeout(function(){
		// 	that.state.handicapBombs.push({name: 'cat', maxTime: 5000})
		// }, 2000)
		// setTimeout(function(){
		// 	that.state.handicapBombs.push({name: 'troll', maxTime: 5000})
		// setTimeout(function(){
		// 	that.state.handicapBombs.push({name: 'shake', maxTime: 2500})
		// }, 5000)
		// setTimeout(function(){
		// 	that.state.handicapBombs.push({name: 'reverse', maxTime: 5000});
		// }, 5000)
		// setTimeout(function(){
		// 	that.state.handicapBombs.push({name: 'flip', maxTime: 5000});
		// }, 5000)

	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeydown);
		document.removeEventListener('keyup', this.handleKeyup);
	}

	//display 3, 2, 1 countdown before starting game
	//display GO! when game has started
	//reusable state value for any game message
	beforeGame(){
		var that = this;
		if(new Date() - this.gameStartTime < 3000){
			this.state.gameMessage = Math.floor((new Date() - this.gameStartTime)/1000)+1;
			this.setState({gameMessage: this.state.gameMessage});
			requestAnimationFrame(this.beforeGame)
		}
		else {
			this.setState({gameMessage: "GO!"});
			setTimeout(function(){
				that.setState({gameMessage: null});
			}, 1000)
			this.updateGameState();
		}
	}
	goFS(){
		document.requestFullScreen();
	}
	handleSwipe(e){
		e.preventDefault();
		console.log(e)
		if (e.direction === 16){
			this.handleHardDrop();
		}
	}


	//right 39
	//left 37
	//up 38
	//down 40
	//space 32
	handleKeydown(e) {
		//only handle key events if piece is not in hard drop mode
		if (!this.hardDrop) {
			//if reverse handicap is active, switch left and right key handle events
			if(this.state.handicapBombs[0] && this.state.handicapBombs[0].name === 'reverse'){
				switch (e.which) {
					case 37:
						this.handleRightMove();
						return;
					case 39:
						this.handleLeftMove();
						return;
					case 38:
						this.handleRotate();
						return;
					case 40:
						this.fastDrop = true;
						return;
					case 32:
						this.handleHardDrop();
				}
			}
			else {
				switch (e.which) {
					case 39:
						this.handleRightMove();
						return;
					case 37:
						this.handleLeftMove();
						return;
					case 38:
						this.handleRotate();
						return;
					case 40:
						this.fastDrop = true;
						return;
					case 32:
						this.handleHardDrop();
				}
			}
		}
	}

	handleKeyup(e) {
		if (e.which === 40) {
			this.fastDrop = false;
		}
	}

	handleRightMove(){
		if (gp.canMoveRight(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x)) {
			var x = this.state.activePiecePosition.x;
			var newX = x + 1;
			this.state.activePiecePosition.x = newX;
			this.setState({ activePiecePosition: this.state.activePiecePosition });
		}
	}

	handleHardDrop(){
		var yPositionDiff = 20-Math.floor(this.state.activePiecePosition.y);
		var newScore = this.state.score + 2*yPositionDiff;
		this.setState({ score: newScore });
		this.hardDrop = true;
	}

	handleLeftMove(){
		if (gp.canMoveLeft(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x)) {
			var x = this.state.activePiecePosition.x;
			var newX = x - 1;
			this.state.activePiecePosition.x = newX;
			this.setState({ activePiecePosition: this.state.activePiecePosition });
		}
	}

	handleRotate(){
		if (gp.canRotate(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x)) {
			this.setState({ activePiece: gp.rotateRight(this.state.activePiece) });
		}
	}

	handleBombClick(e){
		e.preventDefault();
		var bomb = this.state.handicapsAcc[0];
		this.state.handicapBombs.push(bomb);
		this.state.handicapsAcc.splice(0,1);
	}

	updateGameState(){

		if (this.state.handicapBombs[0] && this.state.handicapBombs[0].name === 'extraLines'){
			this.state.handicapBombs.splice(0,1);
			this.setState({grid: h.extraLines(this.state.grid)});
		}

		if (this.state.handicapBombs[0] && !this.handicapStartTime) {
				this.handicapStartTime = new Date()
		}
		else if (this.state.handicapBombs[0] && (new Date()-this.handicapStartTime > this.state.handicapBombs[0].maxTime)) {
				if (this.state.handicapBombs[0].name === 'shake'){
					this.state.grid = h.shake(this.state.grid)
					//setState??
				}
		this.state.handicapBombs.splice(0, 1);
		this.handicapStartTime = null;
		//this.setState?
		}

		var speed = this.state.handicapBombs[0] && this.state.handicapBombs[0].name === 'speedUp' ? 40 : (this.fastDrop ? 25 : this.state.ySpeed);
		var currentState = this.state;
		var y = currentState.activePiecePosition.y;

		if (gp.canMoveDown(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x) && !this.hardDrop) {
			this.time = null;
			var newY = this.state.activePiecePosition.y + 1 / 60 * speed;
			this.state.activePiecePosition.y = newY;
			this.setState({
				activePiecePosition: this.state.activePiecePosition,
			});
		} else {
			if (this.time || this.hardDrop) {
				if (new Date() - this.time > 500 || this.hardDrop) {
					this.time = null;
					var finalY = this.state.activePiecePosition.y;
					if (this.hardDrop){
						finalY = gp.getBottomMostPosition(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x)
					}
					var mergedGrid = gp.mergeGrid(this.state.grid, this.state.activePiece, this.state.activePiecePosition.x, finalY);
					var gridStatus = gp.clearLines(mergedGrid);
					var clearedGrid = gridStatus.clearedGrid;
					var gameOver = gridStatus.gameOver;
					var newLines = gridStatus.clearedLines + this.state.totalLines;
					var newScore = gp.combos(this.previousClearedLines, gridStatus.clearedLines) + this.state.score;
					var newHandicapArr = gp.getRandomBomb(this.state.handicapsAcc, gridStatus.clearedLines);
					if (gameOver) {
						this.setState({
							grid: clearedGrid,
							gameMessage: "GAME OVER!"
						})
						return;
					} else {
						this.setState({
							grid: clearedGrid,
							nextPiece: constants.SHAPES[this.state.gameBag[this.pieceCounter + 1]],
							activePiece: constants.SHAPES[this.state.gameBag[this.pieceCounter]],
							activePiecePosition: {
								x: constants.X_START,
								y: constants.Y_START
							},
							totalLines: newLines,
							score: newScore,
							ySpeed: constants.DEFAULT_YSPEED,
							handicapsAcc: newHandicapArr
						});
						this.deltaX = 0;
						this.pieceCounter++;
						this.hardDrop = false;
						this.previousClearedLines = gridStatus.clearedLines;
					}
				}
			} else {
				this.time = new Date();
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
				playerName: this.props.playerName
			}

			socket.emit('megatron_screen', playerInfo)

			this.serverTimer = new Date();
		}

		requestAnimationFrame(this.updateGameState);
	}

	render() {
		// TODO: this.props.rank

		var disabled = this.state.handicapsAcc.length === 0;
		var options = {preventDefault: true, swipe: {threshold: 0.1, velocity: 0, dragBlockHorizontal: true}};

		return (

			<div className="gamePage">
				<div className="main">
					<div className='leftSideBar'>
						<Hammer onTap={this.state.handicapBombs[0] && this.state.handicapBombs[0].name === 'reverse' ? this.handleRightMove : this.handleLeftMove}>
							<div className='controlButton leftButton'></div>
						</Hammer>
					</div>
					<Hammer onSwipe={this.handleSwipe} onTap={this.handleRotate} vertical={true} options={options}>
					<Grid.Grid scaling={4} message={this.state.gameMessage ? (typeof this.state.gameMessage === "number" ? 4-this.state.gameMessage : this.state.gameMessage) : null} handicap={this.state.handicapBombs[0] ? this.state.handicapBombs[0].name : null } grid={this.state.grid} hardDrop={this.hardDrop ? gp.getBottomMostPosition(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x) : null} activePiece={{activePiece: this.state.activePiece, activePiecePosition: this.state.activePiecePosition}} shadowY={gp.getBottomMostPosition(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y, this.state.activePiecePosition.x)} />
					</Hammer>
					<div className='rightSideBar'>
						<Hammer onTap={this.state.handicapBombs[0] && this.state.handicapBombs[0].name === 'reverse' ? this.handleLeftMove : this.handleRightMove}>
							<div className='controlButton rightButton'></div>
						</Hammer>
					</div>
				</div>
					<div className="footer">
						<div className="nextPiece">
						<h2 className='nextTitle'>NEXT</h2>
							{this.state.nextPiece.map((row, index) => <Grid.Row row={row} key={"pr"+index}/>)}
						</div>
						<div className = 'sidebarElement'>
							<div className="lines">
								<h2>LINES</h2>
								<h3>{this.state.totalLines}</h3>
							</div>
							<div className="score">
								<h2>SCORE</h2>
								<h3>{this.state.score} ({this.props.rank})</h3>
							</div>
						</div>
							<div className="handicaps">
								<h2>BOMBS</h2>
								<Hammer onTap={this.handleBombClick}>
								<h2 className="bombsButton" type="button" disabled={disabled} ref="the_bomb">{this.state.handicapsAcc.length}</h2>
								</Hammer>
							</div>
					</div>
			</div>
		);
	}
}
