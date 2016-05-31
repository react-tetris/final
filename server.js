var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var state = {
  status: 'not accepting'
}

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
    })
    state.status='not accepting'
    io.sockets.emit('logout', PLAYERS)

  });

  socket.on('dropPlayers', function (msg) {
    PLAYERS = {};
    io.sockets.emit('dropPlayers')
  })

  socket.on('start_game', function (msg) {
    {state.status === 'accepting' ? io.emit('start_game') : null}
  })


  socket.on('megatron_activated', function() {
    MEGATRONS.push(socket);
  })
  socket.on('megatron_deactivated', function() {
    var idx = MEGATRONS.find(socket);
    MEGATRONS.splice(idx, 1);
  })
  
  socket.on('megatron_screen', function(data) {
    Object.assign(PLAYERS[data.playerName], data);
    
    MEGATRONS.forEach(function(mt) {
      mt.emit('update_megatron', data);
    })
  })

  socket.on("new_player", function (msg) {
    if (Object.keys(PLAYERS).length >= 6) {
      state.status = 'not accepting'
      console.log('Sorry too many players are already logged in')
      socket.emit('denied');
    }

    else {
      if(Object.keys(PLAYERS).length > 0) {
        Object.keys(PLAYERS).forEach(function(player){
        if(player === msg.name){
          console.log("ITS GOING IN")
          socket.emit("name_taken");
        } else {
          PLAYERS[msg.name] = {socketId: socket.id, playerName: msg.name};
        }
      })
      } else {
        PLAYERS[msg.name] = {socketId: socket.id, playerName: msg.name};
        socket.emit('create_ok', msg.name)
      }
      
      state.status = 'accepting'
      io.emit('playerList', PLAYERS);
      console.log("NEW PLAYER JOINED", msg.name)
      console.log("NEW PLAYER LIST", PLAYERS)
      socket.emit('queued');
    }


  })
});


http.listen(process.env.PORT || 3000, function () {
  console.log('SKYNET IS ONLINE!');
});