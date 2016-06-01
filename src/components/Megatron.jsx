import React from 'react';
import Grid from './grid.jsx';
import gp from '../game_play.js';
import ReactHowler from 'react-howler';

import socket from '../socket';

function MegatronDisplay(props) {
    return (
        <div className='playerGrid'>
            <h2>{props.rank}</h2>
            <Grid.Grid scaling={2} grid={props.grid} hardDrop={props.hardDrop ? gp.getBottomMostPosition(props.grid, props.activePiece, props.activePiecePosition.y, props.activePiecePosition.x) : null} activePiece={{ activePiece: props.activePiece, activePiecePosition: props.activePiecePosition }} shadowY={gp.getBottomMostPosition(props.grid, props.activePiece, props.activePiecePosition.y, props.activePiecePosition.x) } />
            <h3>{props.playerName}</h3>
            <h3>SCORE: {props.score}</h3>
        </div>
    );
}

function MegatronScoreBoard(players) {
    console.log(players)
    return (
        <div className='scoreBoard'>
            {Object.keys(players).map(function(player){
                return (
                <div>
                    {'Player: ' + players[player].playerName + "  Score: "  + players[player].score}
                    <h3>{'Rank: ' + players[player].rank}</h3>
                </div>
                )
            })}
            
        </div>

    )
}
class Megatron extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activePlayers: {}
        };

    }

    componentDidMount() {
        var that = this;
        socket.emit('megatron_activated')
        socket.on('update_megatron', function(data) {
            that.state.activePlayers[data.playerName] = data;
        })
        this.timer = setInterval(function() {
            that.forceUpdate()
        }, 250);


        socket.on('dropPlayers', function(data) {
            that.setState({
                activePlayers: {}
            })
        })
    }



    componentWillUnmount() {
        this.state.socket.emit('megatron_deactivated')
        clearInterval(this.timer);
    }


    render() {

        var that = this;
        var TO_RENDER = (<div className='megatronWaiting'>Waiting for Admin to start game</div>);

        var players = this.state.activePlayers;
        var playerNames = Object.keys(players);

        if (playerNames.length > 0) {
            TO_RENDER = playerNames.map(function(playerName) {
                var player = players[playerName]
                if (player.grid) {
                    return (
                        <div key={player.playerName}>
                            <MegatronDisplay {...player}/>

                        </div>
                    );
                }
            });
        }
        else {
            TO_RENDER = (<div className='admin-wait'>Waiting for Admin to start game</div>)
        }

        return (
            <div className='megatron'>
                  <h1>BOMBTRIS</h1>
                  <ReactHowler
                    src={'../sound/videoplayback.m4a'}
                    playing={this.state.playing}
                   />
                 <div className='megatronContainer'>
                    {TO_RENDER}
                 </div>
            </div>
        )
    }
}

//<div className='scoreboard'>{MegatronScoreBoard(that.state.activePlayers)}</div>
module.exports = Megatron;
