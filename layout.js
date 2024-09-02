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
  iterateSection(x0, 0, z, d1, sections, intro, "Sections_");
}

function iterateSection(x, y, z, d, section, ele, prename) {
  const num = Object.keys(section).length;
  const deg = Math.PI / (num - 1);
  let i = 0;
  for (const key in section) {
    // console.log(section[key]);
    //     header only
    prename = prename + key.replace(":", "").replace(" ", "_");
    const header = prename + "_header.mp3";
    const x1 = x - d * Math.cos(deg * i);
    const z1 = z - d1 * Math.sin(deg * i);
    const id = key + i;
    const classH = "header";
    const el = createElement(ele, x1, y, z1, classH, id, header);
    i++;

    if (section[key].P != "") {
      //       load p
      const idP = id + "_p";
      const classP = "p";
      const nameP = prename + "_P.mp3";
      createElement(el, x1, y, z1, classP, idP, nameP);
    }

    if (section[key].Subsections) {
      // console.log("sub!");
      prename = prename + "_Subsections_";
      iterateSection(x1, y, z1, d2, section[key].Subsections, el, prename);
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
