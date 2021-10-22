import { roomHeight, roomWidth } from "../utils/constants.js";
import { uiOffset } from "./utils/constants.js";

const getScale = () => {
  let scale = 1;
  for (let i = 0; i < 4; i++) {
    if (
      (roomHeight + uiOffset) * i <= window.innerHeight &&
      (roomWidth + uiOffset) * i <= window.innerWidth
    ) {
      scale = i;
    }
  }

  return scale;
};

console.log(getScale());

export const initKaboom = () => {
  let k = kaboom({
    width: roomWidth + uiOffset,
    height: roomHeight + uiOffset,
    background: [31, 5, 16],
    scale: getScale(),
    crisp: true,
    canvas: document.querySelector("#canvas"),
  });

  layers(["bg", "corpse", "dust", "game", "ui"], "game");

  return k;
};
