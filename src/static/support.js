let radiant = document.getElementById("radiant");
let dire = document.getElementById("dire");

let socket = io('localhost:3000');
socket.on('support', s => {
    radiant.innerText = s.radiant;
    dire.innerText = s.dire;
});