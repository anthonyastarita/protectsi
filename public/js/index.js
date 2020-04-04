let socket = io();

var allData;

socket.on('connect', () => {

  //temp: this doesn't need to be on connect
  requestData()

});

function requestData(){

  console.log('Requesting data.')
  socket.emit('requestData')

  //waits for data to be sent
  socket.on('dataSent', (jsonData) => {

    //parses json string to a js object
    var data = JSON.parse(jsonData);

    //saves data into allData
    allData = data;
    
    //do something with parsed data
    var temp = document.getElementById("temp-data")
    temp.innerHTML += jsonData
    console.log(data)
  });
}

function requestSidePanel(coords){

    allData.forEach(function (arrayItem) {
    
      if(arrayItem.location == "csi"){
        var temp = document.getElementById("sidePanel");
        temp.innerHTML += arrayItem.comments;
      }

});
}
