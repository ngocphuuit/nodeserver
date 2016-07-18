var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');

var redisClient = redis.createClient();

server.listen(5000);

redisClient.subscribe('message.advisor');
redisClient.subscribe('message.user');

redisClient.on('message', function(channel, data) {
    var data = JSON.parse(data);
    if (channel == 'message.advisor') {
        io.in('user_' + data['UserID']).emit(channel, data);
    } else if (channel == 'message.user') {
        io.in('advisor_' + data['UserID']).emit(channel, data);
    }
});

io.on('connection', function (socket) {
  console.log("client connected");
  var role = socket.handshake.query.role;
  var room = role + '_' + socket.handshake.query.ID;
  socket.join(room);

  socket.on('disconnect', function() {
    console.log('log out');
  });
});
