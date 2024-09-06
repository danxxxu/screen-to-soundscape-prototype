function fetchJSONData() {
  fetch("./en_wiki_Galaxy_with_audio.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => loadAudio(data))
    // .then((data) => drawLayout(data))
    .catch((error) => console.error("Unable to fetch data:", error));
}

fetchJSONData();

const sceneEl = document.querySelector("a-scene");
const assetEl = document.querySelector("a-assets");
const y = 1.5;
const d1 = 8; // header 2
const d2 = 4; // header2 to header3
const dp = 2; // header to p
let x0 = 0;
let z = 0;
let src;
let sounds;
let deg;
let minX = 0,
  maxX = 0,
  minZ = 0;
const margin = 2; //get boundaries

//////////////// LOAD AUDIO ////////////////
function loadAudio(data) {
  createAudio(data.Title.replace("mp3s\\", "").replace(".mp3", ""));
  createAudio(data.Introduction.replace("mp3s\\", "").replace(".mp3", ""));

  iterateAudio(data.Sections, "Sections_");

  drawLayout(data);
}

function iterateAudio(section, prename) {
  for (const key in section) {
    const name = prename + key.replace(":", "").replaceAll(" ", "_");
    const header = name + "_header";
    createAudio(header);

    if (section[key].P != "") {
      const nameP = name + "_P";
      createAudio(nameP);
    }

    if (section[key].Subsections) {
      iterateAudio(section[key].Subsections, name + "_Subsections_");
    }
  }
}

function createAudio(name) {
  const audioEl = document.createElement("audio");
  const url =
    "https://cdn.glitch.global/53d6d00c-ae48-4ff9-bb80-4a61d4cfaa29/" +
    name +
    ".mp3";
  // const url = "https://cdn.glitch.global/53d6d00c-ae48-4ff9-bb80-4a61d4cfaa29/Introduction.mp3?v=1725365680828";
  audioEl.setAttribute("id", name);
  audioEl.setAttribute("preload", "auto");
  audioEl.setAttribute("src", url);
  // console.log(url);
  assetEl.appendChild(audioEl);
}

//////////////// DRAW LAYOUT ////////////////
function drawLayout(data) {
  // console.log(data);

  // title element; pink
  z = 0 - d1;
  src = data.Title.replace("mp3s\\", "").replace(".mp3", "");
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
  // titleEl.addEventListener('collide', function (evt) {
  // console.log('camera hit me!');});

  // intro element; pink
  src = data.Introduction.replace("mp3s\\", "").replace(".mp3", "");
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
  iterateSection(x0, 0, z, d1, data.Sections, intro, "Sections_", 0);

  // create boundary sound object #F0FFFF ivory color
  //   console.log(minX);
  createElement(
    sceneEl,
    minX - margin,
    y,
    z,
    "#F0FFFF",
    "sound-cues",
    "bound",
    "bound-cue"
  );
  // //   console.log(maxX);
  // createElement(
  //   sceneEl,
  //   maxX + margin,
  //   y,
  //   z,
  //   "#F0FFFF",
  //   "sound-cues",
  //   "bound",
  //   boundSrc
  // );
    console.log(minZ);
  // createElement(
  //   sceneEl,
  //   x0,
  //   y,
  //   minZ - margin,
  //   "#F0FFFF",
  //   "sound-cues",
  //   "bound",
  //   boundSrc
  // );
  // createElement(
  //   sceneEl,
  //   x0,
  //   y,
  //   z + margin,
  //   "#F0FFFF",
  //   "sound-cues",
  //   "bound",
  //   boundSrc
  // );

  // select elements after creation
  sounds = document.querySelectorAll("a-sphere");
}

function iterateSection(x, y, z, d, section, ele, prename, angle) {
  const num = Object.keys(section).length;
  if (num == 1) {
    deg = Math.PI / 2;
  } else {
    deg = Math.PI / (num - 1);
  }
  let i = 0;
  for (const key in section) {
    // console.log(section[key]);
    //     header only; blue color
    const name = prename + key.replace(":", "").replaceAll(" ", "_");
    const header = name + "_header";
    const x1 = 0 - d * Math.cos(deg * i + angle);
    if (x1 < 0) {
      if (x1 < minX) {
        minX = x1;
      }
    } else {
      if (x1 > maxX) {
        maxX = x1;
      }
    }
    const z1 = 0 - d / 2 - d * Math.sin(deg * i + angle);
    if (z1 < minZ) {
      minZ = z1;
    }
    const id = key + i;
    const classH = "header";
    const el = createElement(ele, x1, y, z1, "#00FFFF", classH, id, header);

    if (section[key].P != "") {
      //       load p; yellow color
      const idP = id + "_p";
      const classP = "p";
      const nameP = name + "_P";
      const xp = 0 - dp * Math.cos(deg * i + angle);
      if (xp < 0) {
        if (xp < minX) {
          minX = xp;
        }
      } else {
        if (xp > maxX) {
          maxX = xp;
        }
      }
      const zp = 0 - dp * Math.sin(deg * i + angle);
      if (zp < minZ) {
        minZ = zp;
      }
      createElement(el, xp, y, zp, "#FFFF00", classP, idP, nameP);
    }

    if (section[key].Subsections) {
      // console.log(key);
      iterateSection(
        x1,
        y,
        z1,
        d2,
        section[key].Subsections,
        el,
        name + "_Subsections_",
        0
        // deg * i - 0.5 * Math.PI
      );
    }
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
  // sphereEl.setAttribute("sound", "src:#" + s + "; autoplay: true");
  // console.log(x);
  // console.log(z);
  // console.log(s);

  ele.appendChild(sphereEl);
  return document.getElementById(id);
}

function distance(x1, z1, x2, z2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (z1 - z2) * (z1 - z2));
}

//////////////// PLAY AUDIO ////////////////
let playing = false;
document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    // console.log(event.code);
    checkAudio(sounds);
    // console.log(sounds);
  }
});

function checkAudio(audioArray) {
  if (!playing) {
    audioArray.forEach((s) => {
      s.components.sound.playSound();
    });
    playing = true;
    console.log("play");
  } else {
    audioArray.forEach((s) => {
      s.components.sound.pauseSound();
    });
    playing = false;
    console.log("stop");
  }
}

//////////////// HIT BOUND ////////////////
AFRAME.registerComponent("hit-bounds", {
  init: function () {
    // nothing here
  },
  tick: function () {
    const bound = document.querySelector("#bound");
    let elX = this.el.object3D.position.x;
    let elZ = this.el.object3D.position.z;
    // console.log(elX);
    let hitBound;
    // limit Z
    if (this.el.object3D.position.z > z + margin) {
      this.el.object3D.position.z = z + margin;
      hitBound = z + margin + 1;
      bound.setAttribute("position", elX + " " + y + " " + hitBound);
      bound.components.sound.playSound();
    }
    if (this.el.object3D.position.z < minZ - margin) {
      this.el.object3D.position.z = minZ - margin;
      hitBound = minZ - margin - 1;
      console.log(hitBound)
      bound.setAttribute("position", elX + " " + y + " " + hitBound);
      bound.components.sound.playSound();
    }
    // limit X
    if (this.el.object3D.position.x > maxX + margin) {
      this.el.object3D.position.x = maxX + margin;
      hitBound = maxX + margin + 1;
      bound.setAttribute("position", hitBound + " " + y + " " + elZ);
      bound.components.sound.playSound();
    }
    if (this.el.object3D.position.x < minX - margin) {
      this.el.object3D.position.x = minX - margin;
      hitBound = minX - margin - 1;
      bound.setAttribute("position", hitBound + " " + y + " " + elZ);
      bound.components.sound.playSound();
    }
  },
});
