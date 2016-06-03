var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var gameState = 'ACCEPTING_PLAYERS';

var PLAYERS = {};

var MEGATRONS = [];

app.use(express.static('public'));

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});



io.on('connection', function (socket) {
  io.emit('playerList', PLAYERS);

  socket.on('disconnect', function () {
    Object.keys(PLAYERS).forEach(function(player) {
        if(PLAYERS[player].socketId === socket.id){
          delete PLAYERS[player];
        }
    });
    io.sockets.emit('logout', socket.id);
  });

  socket.on('entering_game', function() {
    console.log('Someone entered the game');
    socket.emit('game_status', gameState);
  });

  socket.on('dropPlayers', function (msg) {
    PLAYERS = {};
    console.log("after players dropped", PLAYERS)
    io.sockets.emit('dropPlayers', 'ACCEPTING_PLAYERS')
    gameState = 'ACCEPTING_PLAYERS';
  });

  socket.on('start_game', startTheGame);

  socket.on('bomb_sent', function (bombObj) {
    var victim = Math.floor(Math.random() * (Object.keys(PLAYERS).length -1));
    var playersArr = Object.keys(PLAYERS);
    var playerWhoSentIndex = playersArr.indexOf(bombObj.playerName);
    playersArr.splice(playerWhoSentIndex, 1);
    var victimPlayer = playersArr[victim];
    io.to(PLAYERS[victimPlayer].socketId).emit('victimize', bombObj.bomb);
  });

  socket.on('megatron_activated', function() {
    MEGATRONS.push(socket);
  });
  socket.on('megatron_deactivated', function() {
    var idx = MEGATRONS.find(socket);
    MEGATRONS.splice(idx, 1);
  });

  socket.on('megatron_screen', function(data) {
    if (gameState !== 'PLAYING') {
      return;
    }
    MEGATRONS.forEach(function(mt) {
      mt.emit('update_megatron', data);
    });
  })
  
  socket.on('score_update', function(data) {
    
    io.emit('score_update', {
      name: data.name,
      score: data.score
    });
  });

//------------SOMEONE DIES
  socket.on('player_died', function(deadPlayer){
    var numPlayers = Object.keys(PLAYERS).length;
    if (numPlayers === 1) {
      io.emit('game_over', {winner: PLAYERS[deadPlayer]});
    }
    else {
      io.emit("remove_player", deadPlayer);
    }
    delete PLAYERS[deadPlayer];
   
  });

  socket.on("new_player", function (newPlayerName) {
    if (Object.keys(PLAYERS).length >= 6) {
      socket.emit('game_status', 'TOO_MANY_PLAYERS');
    }

    else {
      var nameTaken = false;
      Object.keys(PLAYERS).forEach(function(playerName){
        if (newPlayerName === playerName) {
          nameTaken = true;
        }
      });

      if(nameTaken) {
        socket.emit("name_taken");
      }
      else {
        var newPlayer = {socketId: socket.id, playerName: newPlayerName};
        PLAYERS[newPlayerName] = newPlayer;
        socket.emit("game_status", "QUEUED");
        io.emit("update_players", PLAYERS);

        if (Object.keys(PLAYERS).length === 6) {
          startTheGame();
        }
      }
    }
  });
});

function startTheGame() {
  var pieces = getGamePieces();
  io.emit('game_status', 'PLAYING');
  io.emit('changing_players', PLAYERS);
  gameState = 'PLAYING';
  for (var playerName in PLAYERS) {
    io.to(PLAYERS[playerName].socketId).emit('start_game', {pieces: pieces, name: playerName});
  }
}


function shuffleBag() {
	var array = ['I', 'J', 'Z', 'S', 'O', 'L', 'T'];
	var arrLength = array.length;

    while (arrLength > 0) {
        var index = Math.floor(Math.random() * arrLength);
        arrLength--;
        var temp = array[arrLength];
        array[arrLength] = array[index];
        array[index] = temp;
    }
    return array;
}


function getGamePieces() {
    var array = [];
    var i = 0;
    while (i < 150) {
		array.push(shuffleBag())
		i++;
	}
    var gamePieces = [].concat.apply([], array);
    return gamePieces;
}

http.listen(process.env.PORT || 3000, function () {
  console.log('SKYNET IS ONLINE!');
});
