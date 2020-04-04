let socket = io();

socket.on('connect', (socket) => {

  console.log('Requesting data.')
  socket.emit('requestData')

});

socket.on('dataReceived', (data) => {

});
