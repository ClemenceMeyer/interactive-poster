// https://deep-fold.itch.io/pixel-planet-generator pixel planets
// https://jasondyoungberg.github.io/travelers/ audio files

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin)

const orbitImgs = document.querySelectorAll(".orbit-img")

const orbitRawPathBrittleHollow = MotionPathPlugin.getRawPath('#path-brittle-hollow')
const orbitRawPathTimberHearth = MotionPathPlugin.getRawPath('#path-timber-hearth')
const orbitRawPathGiantsDeep = MotionPathPlugin.getRawPath('#path-giants-deep')

/************** orbit **************/

const planetsAnimInfo = {
  brittleHollow: {
    zIndex: [120, 40],
    duration: 10,
    sizeModifier: 400
  },
  timberHearth: {
    zIndex: [130, 30],
    duration: 15,
    sizeModifier: 300
  },
  giantsDeep: {
    zIndex: [140, 20],
    duration: 20,
    sizeModifier: 200
  },
}


const planetsOrbitsPath = {
  brittleHollow: {raw: orbitRawPathBrittleHollow, path: '#path-brittle-hollow'},
  timberHearth: {raw: orbitRawPathTimberHearth, path: '#path-timber-hearth'},
  giantsDeep: {raw: orbitRawPathGiantsDeep, path: '#path-giants-deep'}
}

const scaleModifier = function (scale, target) {
  const pos = MotionPathPlugin.getPositionOnPath(planetsOrbitsPath[target.dataset.key].raw, this.ratio);
  console.log(pos.y)
  return pos.y / planetsAnimInfo[target.dataset.key].sizeModifier;
};

const zIndexMod = function (scale, target) {
  const pos = MotionPathPlugin.getPositionOnPath(planetsOrbitsPath[target.dataset.key].raw, this.ratio);
  return pos.y / planetsAnimInfo[target.dataset.key].sizeModifier;
};

const createOrbitForImg = (img) => {
  return gsap.timeline({repeat:-1}).to(
    img,
    {
      scale: 1,
      ease:"none",
      duration: planetsAnimInfo[img.dataset.key].duration,
      motionPath: {
        path: planetsOrbitsPath[img.dataset.key].path,
        align: planetsOrbitsPath[img.dataset.key].path,
        alignOrigin: [0.5, 0.5]
      },
      zIndex: 1,
      modifiers: {
        zIndex: zIndexMod,
        scaleX: scaleModifier,
        scaleY: scaleModifier
      }
    },
    0
  );
}

/************** interact with anim **************/

let planetsTls = {}

const pauseAnim = (e) => {
  planetsTls[e.target.dataset.key].pause()
}

const resumeAnims = () => {
  Object.values(planetsTls).forEach(tl => {
    tl.resume()
  })
}

/****************************/

orbitImgs.forEach(img => {
  planetsTls[img.dataset.key] = createOrbitForImg(img)
  img.addEventListener('mousedown', pauseAnim)
})

document.addEventListener('mouseup', resumeAnims)