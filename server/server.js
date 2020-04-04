const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;

const mongo = require('mongodb').MongoClient;
// const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

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

  socket.on('saveData', (data) => {

    console.log('Requesting to save data: ' + data)

    // if(port === 3000)
    // {
    //   console.log('Server is local, data is not being saved to database.')
    // }
    // else
    // {
    console.log('Attempting to save to database.')
    writeToDatabase(data, () => {
      console.log('Saved to database')
    });
    // }
  })

  socket.on('requestData', () => {

  });
});

// function readFromDatabase(){
//   mongo.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }, (err, client) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//
//     const db = client.db('heroku_f2wxxsgg');
//     const collection = db.collection('data');
//
//     var data = JSON.parse(jsonData);
//     collection.insertOne(data, (err, result) => {});
//
//     callback();
//   });
// }

function writeToDatabase(jsonData, callback){

  mongo.connect(uri, function(err, client) {
    if(err) throw err;
    const db = client.db('heroku_f2wxxsgg');
    const collection = db.collection('data');
    var data = JSON.parse(jsonData);
    collection.insertOne(data, (err, result) => {});
    callback()
  });
};
  // mongo.connect(uri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  // }, (err, client) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //
  //   const db = client.db('heroku_f2wxxsgg');
  //   const collection = db.collection('data');
  //
  //   var data = JSON.parse(jsonData);
  //   collection.insertOne(data, (err, result) => {});
  //
  //   callback();
  // });
// }
