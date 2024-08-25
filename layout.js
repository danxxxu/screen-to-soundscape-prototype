const sceneEl = document.querySelector("a-scene");

let cubeEl = document.createElement("a-box");
cubeEl.setAttribute("color", "blue");
cubeEl.setAttribute("position", "0 1.5 -2");
sceneEl.appendChild(cubeEl);
