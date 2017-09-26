function toggle() {
	var cont = document.getElementById("container");
	cont.classList.toggle("stateOne");
	cont.classList.toggle("stateTwo");
};

var box = document.getElementById('box');
document.getElementById("click").addEventListener('click', () => {
	box.classList.toggle('flipped');
}, false);

document.getElementById("container").addEventListener("transitionend", toggle);
window.onload = toggle;