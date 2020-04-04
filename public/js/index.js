let socket = io();

socket.on('connect', () => {

  requestData((data) => {

    //temporary
    var temp = document.getElementById("temp-data")
    temp.innerHTML += JSON.stringify(data)

    console.log(data)

  })

});

function requestData(onDataSent){

  console.log('Requesting data.')
  socket.emit('requestData')

  //waits for data to be sent
  socket.on('dataSent', (jsonData) => {

    //parses json string to a js object
    var data = JSON.parse(jsonData)
    onDataSent(data)

  });
}

function requestSidePanel(coords){

  requestData((data) => {
    data.forEach(function (arrayItem) {

      if(arrayItem.location == "csi"){
        var temp = document.getElementById("sidePanel");
        temp.innerHTML += arrayItem.comments;
      }

    })
  })
}
