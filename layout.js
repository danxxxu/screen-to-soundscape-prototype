function fetchJSONData() {
  fetch("./en_wiki_Galaxy_with_audio.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => drawLayout(data))
    .catch((error) => console.error("Unable to fetch data:", error));
}

fetchJSONData();

const sceneEl = document.querySelector("a-scene");
const y = 1.5;
const d1 = 8; // header 2
const d2 = 5; // header2 to header3
const dp = 2; // header to p
let x0 = 0;
let z = 0;
let src;

function drawLayout(data) {
  // console.log(data);

  // title element
  z = z - d1;
  src = data.Title;
  const titleEl = createElement(sceneEl, x0, y, z, "title", "title", src);

  // intro element
  z = z - d1;
  src = data.Introduction;
  const intro = createElement(titleEl, x0, 0, z, "intro", "intro", src);

  // sections
  const sections = data.Sections;
  z = z - d1;
  iterateSection(x0, 0, z, d1, sections);
  // circular elements; 5 equally spaced in 180 degree
  //   const num = 5;
  //   const deg = Math.PI / (num + 1);
  //   for (let i = 1; i < num + 1; i++) {
  //     let x = x0 - d1 * Math.cos(deg * i);
  //     z = z - d1 * Math.sin(deg * i);
  //     let c = "circle";
  //     let id = c + i;

  //     createElement(sceneEl, x, z, c, id, id);
  //   }
}

function iterateSection(x, y, z, d, section) {
  const num = Object.keys(section).length;
  const deg = Math.PI / (num - 1);
  let i = 0;
  for (const key in section) {
    console.log(section[key]);
    const x1 = x - d * Math.cos(deg * i);
    const z1 = z - d1 * Math.sin(deg * i);
    

    if (section[key].Subsections) {
      console.log("sub!");
      iterateSection(section[key].Subsections);
    }
  }
}

function createElement(ele, x, y, z, c, id, s) {
  const sphereEl = document.createElement("a-sphere");
  sphereEl.setAttribute("color", "#EF2D5E");
  sphereEl.setAttribute("shader", "flat");
  sphereEl.setAttribute("radius", "0.5");
  sphereEl.setAttribute("position", x + " " + y + " " + z);
  sphereEl.setAttribute("class", c);
  sphereEl.setAttribute("id", id);
  sphereEl.setAttribute("sound", "src:#" + s);

  ele.appendChild(sphereEl);
  return document.getElementById(id);
}

function distance(x1, z1, x2, z2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (z1 - z2) * (z1 - z2));
}
