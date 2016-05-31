import React from 'react';
import Grid from './grid.jsx';
import gp from '../game_play.js';
import ReactHowler from 'react-howler';


function MegatronDisplay(props) {
    return (
        <Grid.Grid grid={props.grid} hardDrop={props.hardDrop ? gp.getBottomMostPosition(props.grid, props.activePiece, props.activePiecePosition.y, props.activePiecePosition.x) : null} activePiece={{ activePiece: props.activePiece, activePiecePosition: props.activePiecePosition }} shadowY={gp.getBottomMostPosition(props.grid, props.activePiece, props.activePiecePosition.y, props.activePiecePosition.x) } />
    );
}

function MegatronScoreBoard (players){
    console.log(players)
    return (
        <div className='scoreBoard'>
            {Object.keys(players).map(function(player){
                return <div>{players[player].playerName + ': ' + players[player].score}</div>
            })}
        </div>
        
        )
}
class Megatron extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            socket: this.props.socket,
            activePlayers: {},
            playing: false
        };

        // this.handleSound = this.handleSound.bind(this)
    }

    componentDidMount() {
        var that = this;
        this.state.socket.emit('megatron_activated')
        this.state.socket.on('update_megatron', function(data) {
            console.log(data, 'joeys data')
            that.state.activePlayers[data.playerName] = data;
            // that.setState({
            //     activePlayers: that.state.activePlayers,
            //     playing: true
            // })
        })
        this.timer = setInterval(function() {that.forceUpdate()}, 250);
    }
    
    componentWillUnmount() {
        this.state.socket.emit('megatron_deactivated')
    }


    render() {
        // console.log(this.state.activePlayers, "THIS IS THE STATE")
        var that = this;
        var TO_RENDER = (<div className='admin-wait'>Waiting for Admin to start game</div>);
        
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
            <div className="megatron">
                  <ReactHowler
                    src={'../sound/videoplayback.m4a'}
                    playing={this.state.playing}
            />
        {TO_RENDER}
        
        <div className='scoreboard'>{MegatronScoreBoard(that.state.activePlayers)}</div>
        </div>
        )
    }
}


module.exports = Megatron;