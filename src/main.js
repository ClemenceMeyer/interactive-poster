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
    minY: 185.15303,
    midY: 264.394565,
    maxY: 343.6361,
    scaleModifier: [0.5, 2]
  },
  timberHearth: {
    zIndex: [130, 30],
    duration: 15,
    minY: 163.55428,
    midY: 271.88205,
    maxY: 380.20982,
    scaleModifier: [0.25, 4]
  },
  giantsDeep: {
    zIndex: [140, 20],
    duration: 20,
    minY: 174.31512,
    midY: 288.22268,
    maxY: 402.13024,
    scaleModifier: [0.125, 8]
  },
}

const planetsOrbitsPath = {
  brittleHollow: {raw: orbitRawPathBrittleHollow, path: '#path-brittle-hollow'},
  timberHearth: {raw: orbitRawPathTimberHearth, path: '#path-timber-hearth'},
  giantsDeep: {raw: orbitRawPathGiantsDeep, path: '#path-giants-deep'}
}

const scaleMod = function (scale, target) {
  const pos = MotionPathPlugin.getPositionOnPath(planetsOrbitsPath[target.dataset.key].raw, this.ratio);
  const animInfo = planetsAnimInfo[target.dataset.key]
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
  const pos = MotionPathPlugin.getPositionOnPath(planetsOrbitsPath[target.dataset.key].raw, this.ratio);
  const animInfo = planetsAnimInfo[target.dataset.key]
  return pos.y > animInfo.midY ? animInfo.zIndex[0] : animInfo.zIndex[1];
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
        scaleX: scaleMod,
        scaleY: scaleMod
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

/************** setup **************/

orbitImgs.forEach(img => {
  planetsTls[img.dataset.key] = createOrbitForImg(img)
  img.addEventListener('mousedown', pauseAnim)
})

document.addEventListener('mouseup', resumeAnims)