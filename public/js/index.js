let socket = io();

socket.on('connect', (socket) => {
  console.log('Connected')

  var data = {
    hello: 'world'
  }

  saveToDatabase(data)

});

function saveToDatabase(data) {
  var jsonData = JSON.stringify(obj)
  socket.emit('saveData', jsonData)
}
