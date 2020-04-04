const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;

const mongo = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';


let app = express()
let server = http.createServer(app)
let io = socketIO(server)

app.use(express.static(publicPath))

server.listen(port, () => {
  console.log('Server is up on port ' + port)
});

io.on('connect', (socket) => {
  console.log('Connected')
});

// data must be a json js object
// for example: { hello: "world" }
io.on('saveData', (data) => {
  saveToDatabase(data, () => {
    console.log('Saved to database')
  });
})

function saveToDatabase(jsonData, callback){

  mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      console.error(err);
      return;
    }

    const db = client.db('heroku_f2wxxsgg');
    const collection = db.collection('data');

    var data = JSON.parse(jsonData);
    collection.insertOne(data, (err, result) => {});

    callback();
  });
}
