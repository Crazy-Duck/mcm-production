"use strict"

function addRow() {
    let message = prompt("Message?");
    let interval = prompt("Interval?");
    if (message && interval) {
        let spam = document.getElementById("spam");
        let d = document.createElement("div");
        let m = document.createElement("input");
        m.value = message;
        let i = document.createElement("input");
        i.value = interval;
        let b = document.createElement("button");
        b.className = "remove";
        b.dataset.remove = message;
        b.addEventListener("click", () => {
            spam.removeChild(d);
            // call backend
            remove (b.dataset.remove);
        });
        d.appendChild(m);
        d.appendChild(i);
        d.appendChild(b);
        spam.appendChild(d);
        // call backend
        add(message, interval);
    }
}

function add (message, interval) {
    let xhr = new XMLHttpRequest();
    let url = "/spam";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({"message": message, "interval": interval}));
}

function remove (message) {
    let xhr = new XMLHttpRequest();
    let url = "/spam";
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({"message": message}));
}

window.onload = () => {
    let spam = document.getElementById("spam");
    let add = document.getElementById("add");
    add.addEventListener("click", addRow);
    [...document.getElementsByClassName("remove")].map(b => {
        b.addEventListener("click", () => {
            b.parentNode.parentNode.removeChild(b.parentNode);
            // call backend
            remove (b.dataset.message);
        });
    });
};