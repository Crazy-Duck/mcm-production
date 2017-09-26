let net = document.getElementById("networth");
let dire = document.getElementById("dire");
let rad = document.getElementById("radiant");

var socket = io('localhost:3000');
socket.on('networth', networth => {
	let gold = networth.radiant - networth.dire;
	let max = networth.radiant + networth.dire;
	net.style.color = gold > 0 ? "#5faf37" : "#8f1e17";
	net.innerText = Math.abs(gold);
	dire.style.width = networth.dire /max * 204;
	radiant.style.width = networth.radiant /max * 204;
});