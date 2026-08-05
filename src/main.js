// https://deep-fold.itch.io/pixel-planet-generator pixel planets
// https://jasondyoungberg.github.io/travelers/ audio files

const DEBUG = false

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";
import { Howl, Howler } from "howler";

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(CustomEase) 



const onDomContentLoaded = () => {

  let canStart = false

  // Get HTML Elements
  const soundButton = document.querySelector("#sound-button");
  const posterElement = document.querySelector("#poster")

  const orbitImgs = document.querySelectorAll(".orbit-img");
  const hoverSoundEls = document.querySelectorAll(".hover-sound");

  // Get orbits paths
  const orbitRawPathHourglassTwin = MotionPathPlugin.getRawPath(
    "#path-hourglass-twin"
  );
  const orbitRawPathHourglassTwins = MotionPathPlugin.getRawPath(
    "#path-hourglass-twins"
  );
  const orbitRawPathBrittleHollow = MotionPathPlugin.getRawPath(
    "#path-brittle-hollow"
  );
  const orbitRawPathTimberHearth = MotionPathPlugin.getRawPath(
    "#path-timber-hearth"
  );
  const orbitRawPathGiantsDeep =
    MotionPathPlugin.getRawPath("#path-giants-deep");
  const orbitRawPathDarkBramble =
    MotionPathPlugin.getRawPath("#path-dark-bramble");

  const orbitPathHourglassTwin = document.querySelector(
    "#path-hourglass-twin"
  );
  const orbitPathHourglassTwins = document.querySelector(
    "#path-hourglass-twins"
  );
  const orbitPathBrittleHollow = document.querySelector(
    "#path-brittle-hollow"
  );
  const orbitPathTimberHearth = document.querySelector(
    "#path-timber-hearth"
  );
  const orbitPathGiantsDeep =
    document.querySelector("#path-giants-deep");
  const orbitPathDarkBramble =
    document.querySelector("#path-dark-bramble");

  /************** orbit **************/

  const planetsAnimInfo = {
    hourglassTwins: {
      zIndex: [110, 50],
      duration: 20,
      minY: 289.89851,
      midY: 318.375035,
      maxY: 346.85156,
      scaleModifier: [0.8, 1.4],
      ease: "M0,0 C0.198,0 0.391,0.209 0.5,0.5 0.598,0.763 0.798,1 1,1 "
    },
    emberTwin: {
      zIndex: [20, 10],
      duration: 4,
      minY: -35.83591,
      midY: -24.445315,
      maxY: -13.05472,
      scaleModifier: [0.98, 1.04],
      start: 0.5,
      ease: "M0,0 C0,0 1,1 1,1"
    },
    ashTwin: {
      zIndex: [20, 10],
      duration: 4,
      minY: -35.83591,
      midY: -24.445315,
      maxY: -13.05472,
      scaleModifier: [0.98, 1.04],
      ease: "M0,0 C0,0 1,1 1,1"
    },
    brittleHollow: {
      zIndex: [120, 40],
      duration: 30,
      minY: 185.15303,
      midY: 264.394565,
      maxY: 343.6361,
      scaleModifier: [0.5, 2],
      ease: "M0,0 C0.198,0 0.391,0.209 0.5,0.5 0.598,0.763 0.798,1 1,1 "
    },
    timberHearth: {
      zIndex: [130, 30],
      duration: 38,
      minY: 163.55428,
      midY: 271.88205,
      maxY: 380.20982,
      scaleModifier: [0.3, 4],
      ease: "M0,0 C0.25,0 0.414,0.209 0.5,0.5 0.579,0.77 0.754,1 1,1"
    },
    giantsDeep: {
      zIndex: [140, 20],
      duration: 50,
      minY: 139.76044,
      midY: 225.19142499999998,
      maxY: 310.62241,
      scaleModifier: [0.2, 2],
      ease: "M0,0 C0.351,0 0.434,0.209 0.5,0.5 0.561,0.775 0.653,1 1,1"
    },
    darkBramble: {
      zIndex: [150, 10],
      duration: 70,
      minY: 114.81513,
      midY: 228.72269,
      maxY: 342.63025,
      scaleModifier: [0.1, 16],
      ease: "M0,0 C0.45,0 0.473,0.203 0.5,0.5 0.525,0.778 0.555,1 1,1"
    },
  };

  const planetsOrbitsPath = {
    hourglassTwins: {
      raw: orbitRawPathHourglassTwins,
      path: "#path-hourglass-twins",
    },
    ashTwin: { raw: orbitRawPathHourglassTwin, path: "#path-hourglass-twin" },
    emberTwin: { raw: orbitRawPathHourglassTwin, path: "#path-hourglass-twin" },
    brittleHollow: {
      raw: orbitRawPathBrittleHollow,
      path: "#path-brittle-hollow",
    },
    timberHearth: {
      raw: orbitRawPathTimberHearth,
      path: "#path-timber-hearth",
    },
    giantsDeep: { raw: orbitRawPathGiantsDeep, path: "#path-giants-deep" },
    darkBramble: { raw: orbitRawPathDarkBramble, path: "#path-dark-bramble" },
  };

  const scaleMod = function (scale, target) {
    const pos = MotionPathPlugin.getPositionOnPath(
      planetsOrbitsPath[target.dataset.key].raw,
      this.ratio
    );
    const animInfo = planetsAnimInfo[target.dataset.key];
    if (pos.y <= animInfo.midY) {
      // Map minY → midY   ↦   0.5 → 1
      const t = (pos.y - animInfo.minY) / (animInfo.midY - animInfo.minY);
      return animInfo.scaleModifier[0] + t * (1 - animInfo.scaleModifier[0]);
    } else {
      // Map midY → maxY   ↦   1 → 2
      const t = (pos.y - animInfo.midY) / (animInfo.maxY - animInfo.midY);
      return 1 + t * (animInfo.scaleModifier[1] - 1);
    }
  };

  const zIndexMod = function (scale, target) {
    const pos = MotionPathPlugin.getPositionOnPath(
      planetsOrbitsPath[target.dataset.key].raw,
      this.ratio
    );
    const animInfo = planetsAnimInfo[target.dataset.key];
    return pos.y > animInfo.midY ? animInfo.zIndex[0] : animInfo.zIndex[1];
  };

  const createOrbitForImg = (img) => {
    return gsap.timeline({ repeat: -1 }).to(
      img,
      {
        scale: 1,
        ease: CustomEase.create("custom", planetsAnimInfo[img.dataset.key].ease),
        duration: planetsAnimInfo[img.dataset.key].duration,
        motionPath: {
          path: planetsOrbitsPath[img.dataset.key].path,
          align: planetsOrbitsPath[img.dataset.key].path,
          alignOrigin: [0.5, 0.5],
          fromCurrent: true,
        },
        zIndex: 1,
        modifiers: {
          zIndex: zIndexMod,
          scaleX: scaleMod,
          scaleY: scaleMod,
        },
      },
      0
    );
  };

  /************** sounds **************/

  let soundChert = new Howl({ src: ["travelers-sound/chert.wav"], loop: true });
  let soundRiebeck = new Howl({
    src: ["travelers-sound/riebeck.wav"],
    loop: true,
  });
  let soundEsker = new Howl({ src: ["travelers-sound/esker.wav"], loop: true });
  let soundGabbro = new Howl({
    src: ["travelers-sound/gabbro.wav"],
    loop: true,
  });
  let soundFeldspar = new Howl({
    src: ["travelers-sound/feldspar.wav"],
    loop: true,
  });

  let planetAudios = {
    hourglassTwins: { howl: soundChert, ready: false, playing: false },
    brittleHollow: { howl: soundRiebeck, ready: false, playing: false },
    timberHearth: { howl: soundEsker, ready: false, playing: false },
    giantsDeep: { howl: soundGabbro, ready: false, playing: false },
    darkBramble: { howl: soundFeldspar, ready: false, playing: false },
  };

  Object.values(planetAudios).forEach((audio) => {
    audio.howl.once("load", () => {
      audio.ready = true;
      if (
        !Object.values(planetAudios).some((audio) => {
          audio.ready === false;
        })
      ) {
        soundButton.disabled = false;
      }
    });
  });

  /************** interactions **************/

  let planetsTls = {};

  const pauseAnim = (e) => {
    planetsTls[e.target.dataset.key].pause();
  };

  const resumeAnims = () => {
    Object.values(planetsTls).forEach((tl) => {
      tl.resume();
    });
  };

  const playSound = (el) => {
    planetAudios[el.dataset.key].howl.fade(0, 1, 500);
    planetAudios[el.dataset.key].playing = true
  };

  const stopSound = (el) => {
    planetAudios[el.dataset.key].howl.fade(1, 0, 500);
    planetAudios[el.dataset.key].playing = false
  };

  /************** setup **************/

  orbitImgs.forEach((img) => {
    if (img.dataset.key === "ashTwin") {
      setTimeout(() => {
        planetsTls[img.dataset.key] = createOrbitForImg(img);
        img.addEventListener("mousedown", pauseAnim);
        canStart = true
      }, 2000);
    } else {
      planetsTls[img.dataset.key] = createOrbitForImg(img);
      img.addEventListener("mousedown", pauseAnim);
    }
  });

  const start = () => {
    if (!canStart) {
      window.alert("Please wait a little, it's not ready yet")
      return
    }
    posterElement.classList.remove("hidden")
    soundButton.removeEventListener("click", start)
    soundButton.remove()
    hoverSoundEls.forEach((el) => {
      planetAudios[el.dataset.key].howl.volume(0);
      planetAudios[el.dataset.key].howl.play();
    });
    document.addEventListener("mousemove", checkMousePosition);
  }

  soundButton.addEventListener("click", start);

  const checkMousePosition = (e) => {
    // All the elements the mouse is currently overlapping with
    const _overlapped = document.elementsFromPoint(e.pageX, e.pageY);
    const hoverSoundElsArray = Array.from(hoverSoundEls)

    const soundElsHovering = _overlapped.filter(el => { return hoverSoundElsArray.includes(el) })
    soundElsHovering.forEach( el => {
      if (!planetAudios[el.dataset.key].playing) {
        // console.log(`${el.dataset.key} start sound`)
        playSound(el)
      }
    })

    const soundElsNotHovering = hoverSoundElsArray.filter(el => { return !_overlapped.includes(el) })
    soundElsNotHovering.forEach( el => {
      if (planetAudios[el.dataset.key].playing) {
        // console.log(`${el.dataset.key} stop sound`)
        stopSound(el)
      }
    })
  };

  if (DEBUG) {
    const paths = [orbitPathHourglassTwin, orbitPathHourglassTwins, orbitPathBrittleHollow, orbitPathTimberHearth, orbitPathGiantsDeep, orbitPathDarkBramble]
    paths.forEach( p => p.style.stroke = "white")
  }
  
  document.addEventListener("mouseup", resumeAnims);
};

document.addEventListener("DOMContentLoaded", onDomContentLoaded);
