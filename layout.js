const data = require("./en_wiki_Galaxy_with_audio.json");
console.log(data)

const sceneEl = document.querySelector("a-scene");
const y = 1.5;
const dis = 5;

// intro element 
let x0 = 0;
let z0 = 0 - dis;
createElement(sceneEl, x0, z0, "intro", "intro", "intro");

// circular elements; 5 equally spaced in 180 degree
const num = 5;
const deg = Math.PI / (num + 1);
for(let i = 1; i < num + 1; i ++){
  let x = x0 - dis * Math.cos(deg*i);
  let z = z0 - dis * Math.sin(deg*i);
  let c = "circle";
  let id = c+i;
  
  createElement(sceneEl, x, z, c, id, id);
}

function createElement(ele, x, z, c, id, s) {
  const sphereEl = document.createElement("a-sphere");
  sphereEl.setAttribute("color", "#EF2D5E");
  sphereEl.setAttribute("shader", "flat");
  sphereEl.setAttribute("radius", "0.5");
  sphereEl.setAttribute("position", x + " " + y + " " + z);
  sphereEl.setAttribute("class", c);
  sphereEl.setAttribute("id", id);
  sphereEl.setAttribute("sound", "src:#" + s);
  
  ele.appendChild(sphereEl);
}

function distance(x1, z1, x2, z2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (z1 - z2) * (z1 - z2));
}
