// const port = process.env.PORT || 4000;

// const socket = io.connect('http://localhost:3600')

var socket = io();

var username = document.getElementById("username");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var message = document.getElementById("message");
var feedback = document.getElementById("feedback");
console.log("chat.js here");

btn.addEventListener("click", () => {

    if (message.value) {
        socket.emit("chat", {
            message: message.value,
            username: username.innerHTML
        });
    }
});

message.addEventListener("keypress", () => {
    socket.emit("typing", username.innerHTML);
});

socket.on("chat", (data) => {
    message.value = "";
    feedback.innerHTML = "";
    output.innerHTML += "<p> <strong>" + data.username + ": </strong>" + data.message + " </p>";

});

socket.on("typing", (data) => {
    feedback.innerHTML = "<p><em>" + data + " typing...</em><p/>";

})

