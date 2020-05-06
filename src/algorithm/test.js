const ACA = require('./aca')

const zip = (...arrays) => {
  const maxLength = Math.max(...arrays.map(x => x.length))
  return Array.from({ length: maxLength }).map((_, i) => {
    return Array.from({ length: arrays.length }, (_, k) => arrays[k][i])
  })
}

const distanceX = [
  178, 272, 176, 171, 650, 499, 267, 703, 408, 437, 491, 74, 532,
  416, 626, 42, 271, 359, 163, 508, 229, 576, 147, 560, 35, 714,
  757, 517, 64, 314, 675, 690, 391, 628, 87, 240, 705, 699, 258,
  428, 614, 36, 360, 482, 666, 597, 209, 201, 492, 294]
const distanceY = [
  170, 395, 198, 151, 242, 556, 57, 401, 305, 421, 267, 105, 525,
  381, 244, 330, 395, 169, 141, 380, 153, 442, 528, 329, 232, 48,
  498, 265, 343, 120, 165, 50, 433, 63, 491, 275, 348, 222, 288,
  490, 213, 524, 244, 114, 104, 552, 70, 425, 227, 331]
const xycoords = zip(distanceX, distanceY)
const aca = new ACA(50, 50, xycoords)
aca.searchPath(150)
