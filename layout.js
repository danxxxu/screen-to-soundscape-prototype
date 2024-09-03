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
const d2 = 3; // header2 to header3
const dp = 2; // header to p
let x0 = 0;
let z = 0;
let src;

function drawLayout(data) {
  // console.log(data);

  // title element; pink
  z = 0 - d1;
  src = data.Title.replace("mp3s\\", "");
  const titleEl = createElement(
    sceneEl,
    x0,
    y,
    z,
    "#EF2D5E",
    "title",
    "title",
    src
  );

  // intro element; pink
  src = data.Introduction.replace("mp3s\\", "");
  const intro = createElement(
    titleEl,
    x0,
    0,
    z,
    "#EF2D5E",
    "intro",
    "intro",
    src
  );

  // sections
  const sections = data.Sections;
  iterateSection(x0, 0, z, d1, sections, intro, "Sections_", 0);
}

function iterateSection(x, y, z, d, section, ele, prename, angle) {
  const num = Object.keys(section).length;
  const deg = Math.PI / (num - 1);
  let i = 0;
  for (const key in section) {
    // console.log(section[key]);
    //     header only; blue color
    const name = prename + key.replace(":", "").replaceAll(" ", "_");
    const header = name + "_header.mp3";
    const x1 = 0 - d * Math.cos(deg * i + angle);
    const z1 = 0 - d * Math.sin(deg * i + angle);
    const id = key + i;
    const classH = "header";
    const el = createElement(ele, x1, y, z1, "#00FFFF", classH, id, header);

    if (section[key].P != "") {
      //       load p; yellow color
      const idP = id + "_p";
      const classP = "p";
      const nameP = name + "_P.mp3";
      const xp = 0 - dp * Math.cos(deg * i + angle);
      const zp = 0 - dp * Math.sin(deg * i + angle);
      createElement(el, xp, y, zp, "#FFFF00", classP, idP, nameP);
    }

//     if (section[key].Subsections) {
//       // console.log(key);
//       iterateSection(
//         x1,
//         y,
//         z1,
//         d2,
//         section[key].Subsections,
//         el,
//         name + "_Subsections_",
//         deg * i
//       );
//     }
        i++;
  }
}

function createElement(ele, x, y, z, col, c, id, s) {
  const sphereEl = document.createElement("a-sphere");
  sphereEl.setAttribute("color", col);
  sphereEl.setAttribute("shader", "flat");
  sphereEl.setAttribute("radius", "0.5");
  sphereEl.setAttribute("position", x + " " + y + " " + z);
  sphereEl.setAttribute("class", c);
  sphereEl.setAttribute("id", id);
  sphereEl.setAttribute("sound", "src:#" + s);
  console.log(x);
  console.log(z);

  ele.appendChild(sphereEl);
  return document.getElementById(id);
}

function distance(x1, z1, x2, z2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (z1 - z2) * (z1 - z2));
}
