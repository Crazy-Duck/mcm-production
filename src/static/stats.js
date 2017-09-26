let gpm = document.getElementById("gpm");
let xpm = document.getElementById("xpm");

var socket = io('localhost:3000');
socket.on('selected', s => {
	if(s) {
		gpm.innerText = s.gpm;
		xpm.innerText = s.xpm;
	} else {
		gpm.innerText = "";
		xpm.innerText = "";
	}
});