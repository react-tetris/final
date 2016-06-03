import React from 'react';
import Grid from './grid.jsx';
import gp from '../game_play.js';
import ReactHowler from 'react-howler';

import socket from '../socket';

function MegatronDisplay(props) {
    return (
        <div className='playerGrid'>
            <h2>{props.rank}</h2>
            <Grid.Grid scaling={2} lastPlayer={props.lastPlayer} grid={props.grid} handicap={props.handicapBombs[0] ? props.handicapBombs[0].name : null} hardDrop={props.hardDrop ? gp.getBottomMostPosition(props.grid, props.activePiece, props.activePiecePosition.y, props.activePiecePosition.x) : null} message={props.gameMessage ? (typeof props.gameMessage === "number" ? 4-props.gameMessage : props.gameMessage) : null} activePiece={{ activePiece: props.activePiece, activePiecePosition: props.activePiecePosition }} shadowY={gp.getBottomMostPosition(props.grid, props.activePiece, props.activePiecePosition.y, props.activePiecePosition.x) } />
            <h3>{props.playerName}</h3>
            <h3>{props.score}</h3>
        </div>
    );
}


class Megatron extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activePlayers: {},
            musicPlaying: false
        };
        this.lastPlayer = false;
        this.playerNames = [];
    }

    componentDidMount() {
        var that = this;
        socket.emit('megatron_activated');
        
        socket.on('changing_players', function(PLAYERS){
            that.playerNames = Object.keys(PLAYERS);
        })
        
        socket.on('update_megatron', function(data) {
            if(that.playerNames.indexOf(data.playerName) != -1){
                that.state.activePlayers[data.playerName] = data;
            }
            that.state.musicPlaying = true;
        });
        this.timer = setInterval(function() {
            that.forceUpdate()
        }, 250);

        socket.on('remove_player', function(name){
            if(Object.keys(that.state.activePlayers).length === 1){
                return;
            } else {
                delete that.state.activePlayers[name];
                if(Object.keys(that.state.activePlayers).length === 1){
                    that.lastPlayer = true;
                }
            }
        });
        socket.on('dropPlayers', function() {
            that.lastPlayer = false;
            that.setState({
                activePlayers: {}
            })
            that.playerNames = [];
        });
        
        socket.on('game_over', function(winner) {
            that.setState({
                gameOver: true
            });
            that.state.musicPlaying = false;
            that.playerNames = [];
        })
    }

    componentWillUnmount() {
        this.state.socket.emit('megatron_deactivated');
        this.state.activePlayers={};
        this.playerNames=[];
        clearInterval(this.timer);
        this.lastPlayer = false;
    }

    render() {
        //lastPlayer={that.lastPlayer};
        var that = this;
        var TO_RENDER = (<div className='megatronWaiting'>Waiting for Admin to start game</div>);

        var players = this.state.activePlayers;
        var playerNames = Object.keys(players);
        
        if (playerNames.length > 0) {

            TO_RENDER = playerNames.map(function(playerName) {
                var player = players[playerName];
                player.lastPlayer = that.lastPlayer;
                if (player.grid) {
                    return (
                        <div key={player.playerName}>
                            <MegatronDisplay {...player} />
                        </div>
                    );
                }
            });
        }
        
        
        
        else {
            TO_RENDER = (
                <div className='admin-wait'>
                    <h1>Waiting for Admin to start game</h1>
                </div>)
        }

        return (
            <div className='megatron'>
                  <header>
                    <h1>B</h1>
                    <img className='bombLogo' src='http://flaticons.net/icons/Network%20and%20Security/Bomb.png'/>
                    <h1 className='mbtris'>MBTRIS</h1>
                  </header>
                  <ReactHowler
                    src={'../sound/videoplayback.m4a'}
                    playing={this.state.musicPlaying}
                   />
                 <div className='megatronContainer'>
                    {TO_RENDER}
                 </div>
            </div>
        )
    }
}

module.exports = Megatron;
