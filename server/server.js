const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;

const mongo = require('mongodb').MongoClient;

let uri = 'mongodb://heroku_f2wxxsgg:5pdciviihqrjt101vtr5f36ro7@ds133418.mlab.com:33418/heroku_f2wxxsgg';


let app = express()
let server = http.createServer(app)
let io = socketIO(server)

app.use(express.static(publicPath))

server.listen(port, () => {
  console.log('Server is up on port ' + port)
});

io.on('connect', (socket) => {
  console.log('Connected')

  socket.on('saveData', (collection_name, data) => {

    console.log('Requesting to save data to database: ' + data)
    writeToDatabase(collection_name, data, () => {
      console.log('Saved to database')
      io.to(socket.id).emit('dataSaved');
    });

  })

  socket.on('requestData', (collection_name) => {

    console.log('Requesting to data from database: ' + collection_name)

    var data = readFromDatabase(collection_name, (data) => {
      var jsonData = JSON.stringify(data)
      io.to(socket.id).emit('dataSent', collection_name, jsonData);
    });

  });
});

function readFromDatabase(collection_name, callback){
  mongo.connect(uri, {
    useUnifiedTopology: true
  }, function(err, client) {
    if(err) throw err;
    const db = client.db('heroku_f2wxxsgg');
    const collection = db.collection(collection_name);

    var cursor = collection.find();

    var data = [];

    cursor.each(function(err, item) {

      if(item == null) {
        console.log("Reached last item.")
        console.log(data)
        callback(data)
        return data
      }

      data.push(item)
    });

  });
}

function writeToDatabase(collection_name, jsonData, callback){
  mongo.connect(uri, {
    useUnifiedTopology: true
  }, function(err, client) {
    if(err) throw err;
    const db = client.db('heroku_f2wxxsgg');
    const collection = db.collection(collection_name);
    var data = JSON.parse(jsonData);
    collection.insertOne(data, (err, result) => {});
    callback()
  });
};
