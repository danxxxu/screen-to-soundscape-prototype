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
const y = 1.6;
const d1 = 8; // header 2
const d2 = 4; // header2 to header3
const dp = 2; // header to p
let x0 = 0;
let z = 0;
let z0 = 0;
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
    src,
    true,
    true
  );

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
    src,
    true,
    true
  );

  // sections
  iterateSection(x0, 0, z, d1, data.Sections, intro, "Sections_", 0);
  // select elements after creation
  sounds = document.querySelectorAll("a-sphere");

  // create boundary sound object #F0FFFF ivory color
  //   console.log(minX);
  createElement(
    sceneEl,
    minX - margin,
    y,
    z0 + margin,
    "#F0FFFF",
    "sound-cues",
    "bound",
    "bound-cue",
    false,
    false
  );
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
    const z1 = 0 - d / 2 - d * Math.sin(deg * i + angle);
    const id = key + i;
    const classH = "header";
    const el = createElement(
      ele,
      x1,
      y,
      z1,
      "#00FFFF",
      classH,
      id,
      header,
      true,
      true
    );

    //       load p; yellow color
    if (section[key].P != "") {
      const idP = id + "_p";
      const classP = "p";
      const nameP = name + "_P";
      const xp = 0 - dp * Math.cos(deg * i + angle);
      const zp = 0 - dp * Math.sin(deg * i + angle);
      createElement(el, xp, y, zp, "#FFFF00", classP, idP, nameP, true, true);
    }

    // iterate subsections
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

function createElement(ele, x, y, z, col, c, id, s, collide, auto) {
  const sphereEl = document.createElement("a-sphere");
  sphereEl.setAttribute("color", col);
  sphereEl.setAttribute("shader", "flat");
  sphereEl.setAttribute("radius", "0.5");
  sphereEl.setAttribute("position", x + " " + y + " " + z);
  sphereEl.setAttribute("class", c);
  sphereEl.setAttribute("id", id);
  if (auto) {
    sphereEl.setAttribute(
      "sound",
      "src:#" + s + "; autoplay: true; loop: true"
    );
  } else {
    sphereEl.setAttribute("sound", "src:#" + s + "; loop: true");
  }
  sphereEl.setAttribute("world-pos", "");
  if (collide) {
    sphereEl.setAttribute("collide", "");
  }
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
// document.addEventListener("keyup", (event) => {
//   if (event.code === "Space") {
//     // console.log(event.code);
//     checkAudio(sounds);
//     // console.log(sounds);
//   }
// });

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
//////////////// GET WORLD POS ////////////////
AFRAME.registerComponent("world-pos", {
  init: function () {
    this.worldpos = new THREE.Vector3();
  },
  update: function () {
    this.el.getObject3D("mesh").getWorldPosition(this.worldpos);
    // console.log(this.worldpos);
    if (this.worldpos.x < 0) {
      if (this.worldpos.x < minX) {
        minX = this.worldpos.x;
      }
    } else {
      if (this.worldpos.x > maxX) {
        maxX = this.worldpos.x;
      }
    }

    if (this.worldpos.z < minZ) {
      minZ = this.worldpos.z;
    }
  },
});

//////////////// HIT BOUND ////////////////
let hit = false;
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
    if (this.el.object3D.position.z > z0 + margin) {
      this.el.object3D.position.z = z0 + margin;
      hitBound = z0 + margin + 1;
      bound.object3D.position.x = elX;
      bound.object3D.position.z = hitBound;
      if (!hit) {
        hit = true;
        bound.components.sound.playSound();
        // console.log("hit" + this.el.object3D.position.z);
      }
    }
    if (this.el.object3D.position.z < minZ - margin) {
      this.el.object3D.position.z = minZ - margin;
      hitBound = minZ - margin - 1;
      // console.log("MINZ: " + minZ);
      bound.object3D.position.x = elX;
      bound.object3D.position.z = hitBound;
      if (!hit) {
        hit = true;
        bound.components.sound.playSound();
        console.log("hit");
      }
    }
    // limit X
    if (this.el.object3D.position.x > maxX + margin) {
      this.el.object3D.position.x = maxX + margin;
      hitBound = maxX + margin + 1;
      bound.object3D.position.x = hitBound;
      bound.object3D.position.z = elZ;
      if (!hit) {
        hit = true;
        bound.components.sound.playSound();
        console.log("hit");
      }
    }
    if (this.el.object3D.position.x < minX - margin) {
      this.el.object3D.position.x = minX - margin;
      hitBound = minX - margin - 1;
      bound.object3D.position.x = hitBound;
      bound.object3D.position.z = elZ;
      if (!hit) {
        hit = true;
        bound.components.sound.playSound();
        console.log("hit");
      }
    }

    if (
      this.el.object3D.position.x > minX - margin &&
      this.el.object3D.position.x < maxX + margin &&
      this.el.object3D.position.z > minZ - margin &&
      this.el.object3D.position.z < z0 + margin
    ) {
      if (hit) {
        bound.components.sound.stopSound();
      }
      hit = false;
    }
  },
});

AFRAME.registerComponent("collide", {
  init: function () {
    this.worldpos = new THREE.Vector3();
  },
  tick: function () {
    // const cameraEl = this.el.sceneEl.camera.el;
    const cameraEl = document.querySelector("[camera]");
    let camX = cameraEl.object3D.position.x;
    let camZ = cameraEl.object3D.position.z;
    this.el.getObject3D("mesh").getWorldPosition(this.worldpos);

    if (distance(camX, camZ, this.worldpos.x, this.worldpos.z) < 1) {
      // console.log(this.el.id);
      sounds.forEach((s) => {
        if (s != this.el) {
          s.components.sound.pauseSound();
        }
      });
    }
  },
});

AFRAME.registerComponent("check-collide", {
  init: function () {},
  tick: function () {
    let worldpos = new THREE.Vector3();
    let elX = this.el.object3D.position.x;
    let elZ = this.el.object3D.position.z;
    let colStatus = false;

    sounds.forEach((s) => {
      s.getObject3D("mesh").getWorldPosition(worldpos);
      if (distance(elX, elZ, worldpos.x, worldpos.z) < 1) {
        colStatus = true;
      }
      console.log(colStatus);
    });
  },
});
