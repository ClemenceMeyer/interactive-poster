// https://deep-fold.itch.io/pixel-planet-generator pixel planets
// https://jasondyoungberg.github.io/travelers/ audio files

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Howl, Howler } from "howler";

gsap.registerPlugin(MotionPathPlugin);

const onDomContentLoaded = () => {
  const soundButton = document.querySelector("#sound-button");
  const soundLoadingTxt = document.querySelector("#sound-loading-txt");

  const orbitImgs = document.querySelectorAll(".orbit-img");

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

  /************** orbit **************/

  const planetsAnimInfo = {
    hourglassTwins: {
      zIndex: [110, 50],
      duration: 20,
      minY: 289.89851,
      midY: 318.375035,
      maxY: 346.85156,
      scaleModifier: [0.8, 1.4],
    },
    emberTwin: {
      zIndex: [20, 10],
      duration: 4,
      minY: -35.83591,
      midY: -24.445315,
      maxY: -13.05472,
      scaleModifier: [0.98, 1.04],
      start: 0.5,
    },
    ashTwin: {
      zIndex: [20, 10],
      duration: 4,
      minY: -35.83591,
      midY: -24.445315,
      maxY: -13.05472,
      scaleModifier: [0.98, 1.04],
    },
    brittleHollow: {
      zIndex: [120, 40],
      duration: 30,
      minY: 185.15303,
      midY: 264.394565,
      maxY: 343.6361,
      scaleModifier: [0.5, 2],
    },
    timberHearth: {
      zIndex: [130, 30],
      duration: 38,
      minY: 163.55428,
      midY: 271.88205,
      maxY: 380.20982,
      scaleModifier: [0.3, 4],
    },
    giantsDeep: {
      zIndex: [140, 20],
      duration: 50,
      minY: 139.76044,
      midY: 225.19142499999998,
      maxY: 310.62241,
      scaleModifier: [0.2, 2],
    },
    darkBramble: {
      zIndex: [150, 10],
      duration: 70,
      minY: 114.81513,
      midY: 228.72269,
      maxY: 342.63025,
      scaleModifier: [0.1, 16],
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

  // let minY = 10000000000
  // let maxY = -10000000000

  const scaleMod = function (scale, target) {
    const pos = MotionPathPlugin.getPositionOnPath(
      planetsOrbitsPath[target.dataset.key].raw,
      this.ratio
    );
    const animInfo = planetsAnimInfo[target.dataset.key];
    // if (target.dataset.key == "darkBramble") {
    //   minY = pos.y > minY ? minY : pos.y
    //   maxY = pos.y < maxY ? maxY : pos.y
    //   console.log(minY, (maxY-minY) / 2 + minY ,maxY)
    // }
    if (pos.y <= animInfo.midY) {
      // Map minY → midY   ↦   0.5 → 1
      const t = (pos.y - animInfo.minY) / (animInfo.midY - animInfo.minY);
      return animInfo.scaleModifier[0] + t * (1 - animInfo.scaleModifier[0]);
    } else {
      // Map midY → maxY   ↦   1 → 2
      const t = (pos.y - animInfo.midY) / (animInfo.maxY - animInfo.midY);
      return 1 + t * (animInfo.scaleModifier[1] - 1);
    }
    return 1;
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
        ease: "none",
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
  let soundRiebeck = new Howl({ src: ["travelers-sound/riebeck.wav"], loop: true });
  let soundEsker = new Howl({ src: ["travelers-sound/esker.wav"], loop: true });
  let soundGabbro = new Howl({ src: ["travelers-sound/gabbro.wav"], loop: true });
  let soundFeldspar = new Howl({ src: ["travelers-sound/feldspar.wav"], loop: true });

  let planetAudios = {
    hourglassTwins: { howl: soundChert, ready: false },
    brittleHollow: { howl: soundRiebeck, ready: false },
    timberHearth: { howl: soundEsker, ready: false },
    giantsDeep: { howl: soundGabbro, ready: false },
    darkBramble: { howl: soundFeldspar, ready: false },
  };

  Object.values(planetAudios).forEach((audio) => {
    audio.howl.once("load", () => {
      audio.ready = true;
      console.log(`${audio.howl} loaded`);
      if (
        !Object.values(planetAudios).some((audio) => {
          audio.ready === false;
        })
      ) {
        soundButton.disabled = false;
        soundLoadingTxt.style.display = "none";
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

  const playSound = (e) => { planetAudios[e.target.dataset.key].howl.fade(0, 1, 500); };

  const stopSound = (e) => { planetAudios[e.target.dataset.key].howl.fade(1, 0, 500); };

  /************** setup **************/

  orbitImgs.forEach((img) => {
    planetsTls[img.dataset.key] = createOrbitForImg(img);
    img.addEventListener("mousedown", pauseAnim);
  });

  soundButton.addEventListener("click", () => {
    orbitImgs.forEach((img) => {
      if (img.dataset.key != "emberTwin" && img.dataset.key != "ashTwin") {
        planetAudios[img.dataset.key].howl.volume(0);
        planetAudios[img.dataset.key].howl.play();
        img.addEventListener("mouseenter", playSound);
        img.addEventListener("mouseleave", stopSound);
      }
    });
  });
  document.addEventListener("mouseup", resumeAnims);
};

document.addEventListener("DOMContentLoaded", onDomContentLoaded);
