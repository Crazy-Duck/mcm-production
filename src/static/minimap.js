var socket = io('localhost:3000');
socket.on('minimap', minimap => {
	let icon = document.getElementById(minimap.index);
	icon.style.left = minimap.left + 'px';
	icon.style.top = minimap.top + 'px';
});

function drag_start(event) {
    let style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
		event.target.id + ',' + 
		(parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + 
		(parseInt(style.getPropertyValue("top"),10) - event.clientY));
} 
function drag_over(event) { 
    event.preventDefault(); 
    return false; 
} 
function drop(event) { 
    let offset = event.dataTransfer.getData("text/plain").split(',');
	let dm = document.getElementById(offset[0]);
	let l = (event.clientX + parseInt(offset[1],10));
	let t = (event.clientY + parseInt(offset[2],10));
    dm.style.left = l + 'px';
	dm.style.top = t + 'px';
	socket.emit('minimap', {
		"index": offset[0],
		"left": l,
		"top": t
	});
    event.preventDefault();
    return false;
} 

window.onload = () => {
	let map = document.getElementById("minimap");
	map.addEventListener("dragover", drag_over, false);
	map.addEventListener("drop", drop, false);
	let icons = document.getElementsByClassName("icon");
	for (let i=0; i<icons.length; i++) {
		let icon = icons[i];
		icon.addEventListener("dragstart", drag_start, false);
		icon.style.left = 316 + 32 * (i%20);
		icon.style.top = Math.floor(i/20) * 32
	};
};