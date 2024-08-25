const sceneEl = document.querySelector("a-scene");
const y = 1.5;

let cubeEl = document.createElement("a-box");
cubeEl.setAttribute("color", "blue");
cubeEl.setAttribute("position", "0 1.5 -2");
sceneEl.appendChild(cubeEl);


function createElement(x, z, c, id){
  const sphereEl = document.createElement("a-sphere");
  sphereEl.setAttribute("color", "#EF2D5E");
  sphereEl.setAttribute("position", x + ' ' + y +' ' + )
}

function distance(x1, z1, x2, z2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (z1 - z2) * (z1 - z2));
}
