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
const d2 = 8; // header2 to header3
const dp = 6; // header to p
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
const proxi = 2;
let elCount = 0;
let checkCollide = false;

//////////////// LOAD AUDIO ////////////////
function loadAudio(data) {
  createAudio(data.Title.audio_path.replace("mp3s\\", "").replace(".mp3", ""));
  createAudio(
    data.Introduction.audio_path.replace("mp3s\\", "").replace(".mp3", "")
  );

  iterateAudio(data.Sections, "Sections_");

  drawLayout(data);
}

// Recursively iterates through sections and subsections to load audio
function iterateAudio(section, prename) {
  for (const key in section) {
    const name = prename + key.replace(":", "").replaceAll(" ", "_");
    createAudio(
      section[key].audio_path.replace("mp3s\\", "").replace(".mp3", "")
    );

    if (section[key].P && section[key].P.audio_path !== "") {
      createAudio(
        section[key].P.audio_path.replace("mp3s\\", "").replace(".mp3", "")
      );
    }

    // Recursively process subsections if they exist
    if (section[key].Subsections) {
      iterateAudio(section[key].Subsections, name + "_Subsections_");
    }
  }
}

function createAudio(name) {
  const audioEl = document.createElement("audio");
  let url = `https://cdn.glitch.global/91bb62d6-e769-4965-8bb6-e45f81e52be1/${name}.mp3`;

  audioEl.setAttribute("id", name);
  audioEl.setAttribute("preload", "auto");
  audioEl.setAttribute("src", url);
  // console.log(url);
  assetEl.appendChild(audioEl);
}

//////////////// DRAW LAYOUT ///////////////////
// Handles the creation of visual and interactive elements in the scene
function drawLayout(data) {
  // Create title element (pink)
  z = -d1;
  const titleEl = createElement(
    sceneEl,
    x0,
    y,
    z,
    "#EF2D5E",
    "title",
    "title",
    data.Title.audio_path.replace("mp3s\\", "").replace(".mp3", ""),
    true
  );

  // Create introduction element (pink)
  const introEl = createElement(
    titleEl,
    x0,
    0,
    z,
    "#EF2D5E",
    "intro",
    "intro",
    data.Introduction.audio_path.replace("mp3s\\", "").replace(".mp3", ""),
    true
  );

  // Recursively create sections and subsections
  iterateSection(x0, 0, z, d1, data.Sections, introEl, "Sections_", 0);

  // Add sound collision detection and boundary
  sounds = document.querySelectorAll("a-sphere");
  document.querySelector("[camera]").setAttribute("check-collide", "");
  document.querySelector("[camera]").setAttribute("play-proxi", "");

  document.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
      // console.log(event.code);
      checkCollide = false;
      checkAudio(sounds);
    }
  });

  // console.log(elCount);

  // Create boundary sound object (ivory color)
  createElement(
    sceneEl,
    minX - margin,
    y,
    z0 + margin,
    "#F0FFFF",
    "sound-cues",
    "bound",
    "bound-cue",
    false
  );

  document.querySelector("[camera]").setAttribute("hit-bounds", "");
}

// Recursively iterates through sections, creating header and paragraph elements
function iterateSection(x, y, z, d, section, parentEl, prename, angle) {
  const numSections = Object.keys(section).length;
  const degStep = numSections === 1 ? Math.PI / 2 : Math.PI / (numSections - 1);

  Object.keys(section).forEach((key, i) => {
    const name = prename + key.replace(":", "").replaceAll(" ", "_");
    const headerName = section[key].audio_path
      .replace("mp3s\\", "")
      .replace(".mp3", "");

    // Calculate position for the section
    const x1 = -d * Math.cos(degStep * i + angle);
    const z1 = -d / 2 - d * Math.sin(degStep * i + angle);

    // Create header element (blue)
    const headerEl = createElement(
      parentEl,
      x1,
      y,
      z1,
      "#00FFFF",
      "header",
      `${key}${i}`,
      headerName,
      true
    );

    // If paragraph exists, create it (yellow)
    if (section[key].P) {
      const xp = -dp * Math.cos(degStep * i + angle);
      const zp = -dp * Math.sin(degStep * i + angle);
      createElement(
        headerEl,
        xp,
        y,
        zp,
        "#FFFF00",
        "p",
        `${key}${i}_p`,
        section[key].P.audio_path.replace("mp3s\\", "").replace(".mp3", ""),
        true
      );
    }

    // Recursively handle subsections
    if (section[key].Subsections) {
      iterateSection(
        x1,
        y,
        z1,
        d2,
        section[key].Subsections,
        headerEl,
        name + "_Subsections_",
        0
      );
    }
  });
}

// Helper function to create a visual element (sphere) in the scene
function createElement(
  parentEl,
  x,
  y,
  z,
  color,
  className,
  id,
  soundId,
  autoPlay
) {
  const sphereEl = document.createElement("a-sphere");

  // Set attributes for the sphere element
  sphereEl.setAttribute("color", color);
  sphereEl.setAttribute("shader", "flat");
  sphereEl.setAttribute("radius", "0.5");
  sphereEl.setAttribute("position", `${x} ${y} ${z}`);
  sphereEl.setAttribute("class", className);
  sphereEl.setAttribute("id", id);

  // Set sound attributes
  const soundSrc = `src:#${soundId}`;
  sphereEl.setAttribute(
    "sound",
    autoPlay
      ? `${soundSrc}; autoplay: true; loop: false; distanceModel: exponential; refDistance: 3; rolloffFactor: 3`
      : soundSrc
  );
  if (autoPlay) {
    sphereEl.setAttribute("world-pos", "");
    sphereEl.setAttribute("collide", "");
  }

  // Append the created element to its parent
  parentEl.appendChild(sphereEl);

  elCount++;

  return document.getElementById(id); // Return the created element
}

//////////////// PLAY AUDIO ////////////////
let playing = true;
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
  init: function () {},
  tick: function () {
    const bound = document.querySelector("#bound");
    let elX = this.el.object3D.position.x;
    let elZ = this.el.object3D.position.z;
    // console.log(elX);
    let hitBound;
    // limit Z
    if (
      this.el.object3D.position.z > z0 + margin ||
      this.el.object3D.position.z == z0 + margin
    ) {
      this.el.object3D.position.z = z0 + margin;
      hitBound = z0 + margin + 0.5;
      bound.object3D.position.x = elX;
      bound.object3D.position.z = hitBound;
      if (!hit) {
        hit = true;
        bound.components.sound.playSound();
        // console.log("hit" + this.el.object3D.position.z);
      }
      document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowDown") {
          hit = true;
          bound.components.sound.playSound();
        }
      });
    }
    if (
      this.el.object3D.position.z < minZ - margin ||
      this.el.object3D.position.z == minZ - margin
    ) {
      this.el.object3D.position.z = minZ - margin;
      hitBound = minZ - margin - 0.5;
      // console.log("MINZ: " + minZ);
      bound.object3D.position.x = elX;
      bound.object3D.position.z = hitBound;
      if (!hit) {
        hit = true;
        bound.components.sound.playSound();
        console.log("hit");
      }
      document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowUp") {
          hit = true;
          bound.components.sound.playSound();
        }
      });
    }
    // limit X
    if (
      this.el.object3D.position.x > maxX + margin ||
      this.el.object3D.position.x == maxX + margin
    ) {
      this.el.object3D.position.x = maxX + margin;
      hitBound = maxX + margin + 0.5;
      bound.object3D.position.x = hitBound;
      bound.object3D.position.z = elZ;
      if (!hit) {
        hit = true;
        bound.components.sound.playSound();
        console.log("hit");
      }
      document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowRight") {
          hit = true;
          bound.components.sound.playSound();
        }
      });
    }
    if (
      this.el.object3D.position.x < minX - margin ||
      this.el.object3D.position.x == minX - margin
    ) {
      this.el.object3D.position.x = minX - margin;
      hitBound = minX - margin - 0.5;
      bound.object3D.position.x = hitBound;
      bound.object3D.position.z = elZ;
      if (!hit) {
        hit = true;
        bound.components.sound.playSound();
        console.log("hit");
      }
      document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowLeft") {
          hit = true;
          bound.components.sound.playSound();
        }
      });
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
      if (distance(camX, camZ, this.worldpos.x, this.worldpos.z) < proxi) {
        // console.log(this.el);
        checkCollide = true;
        // collide = false;
        // console.log(this.el.components.sound.isPlaying);
        this.el.components.sound.playSound();
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
    if (checkCollide) {
      let worldpos = new THREE.Vector3();
      let elX = this.el.object3D.position.x;
      let elZ = this.el.object3D.position.z;
      let colStatus = false;
      // console.log(checkCollide);
      sounds.forEach((s) => {
        s.getObject3D("mesh").getWorldPosition(worldpos);
        // console.log(worldpos)
        if (distance(elX, elZ, worldpos.x, worldpos.z) < proxi) {
          colStatus = true;
        }
      });

      if (!colStatus) {
        sounds.forEach((s) => {
          if (!s.components.sound.isPlaying) {
            s.components.sound.playSound();
          }
        });
        checkCollide = false;
      }
    }
  },
});

AFRAME.registerComponent("play-proxi", {
  init: function () {},
  tick: function () {
    let worldpos = new THREE.Vector3();
    let elX = this.el.object3D.position.x;
    let elZ = this.el.object3D.position.z;
    let proxiEl;
    let closeDist = 100;

    document.addEventListener("keyup", (event) => {
      // console.log(event.code)
      if (event.code === "ShiftLeft") {
        checkCollide = false;
        sounds.forEach((s) => {
          s.getObject3D("mesh").getWorldPosition(worldpos);
          // console.log(worldpos)
          if (distance(elX, elZ, worldpos.x, worldpos.z) < closeDist) {
            closeDist = distance(elX, elZ, worldpos.x, worldpos.z);
            proxiEl = s;
          }
        });
        sounds.forEach((s) => {
          if (s != proxiEl) {
            s.components.sound.pauseSound();
          }
        });
        proxiEl.components.sound.playSound();
        // console.log(proxiEl);
      }
    });
  },
});

// Helper function to calculate distance between two points (x1, z1) and (x2, z2)
function distance(x1, z1, x2, z2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(z1 - z2, 2));
}
