document.getElementById("addLoc").onclick = function() {
    var form = document.getElementById("locationInput");
    var input = document.createElement("input");
    input.type = "text";
    input.size = 40;
    input.maxLength = 150;
    var br = document.createElement("br");
    form.appendChild(input);
    form.appendChild(br);
}