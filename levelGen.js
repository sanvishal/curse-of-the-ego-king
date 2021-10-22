import { roomHeight, roomWidth, uiOffset } from "./utils/constants.js";
import { floor } from "./utils/helpers.js";

let level = [];

for (let i = 0; i < roomWidth / 16; i += 1) {
  let slice = "";
  for (let j = 0; j < roomHeight / 16; j += 1) {
    if (
      i === 0 ||
      j === 0 ||
      i === floor(roomWidth / 16) - 1 ||
      j === floor(roomHeight / 16) - 1
    ) {
      slice += "w";
      continue;
    }
    slice += " ";
  }
  level.push(slice);
}

export const generateLevel = () => {
  let op = 0;
  add([
    "wall",
    opacity(op),
    color(255, 0, 0),
    rect(roomWidth, 16),
    pos(uiOffset / 2, 8 + uiOffset - 6),
    area(),
    solid(),
    origin("left"),
    { dir: "topdown" },
  ]);
  add([
    "wall",
    opacity(op),
    color(255, 0, 0),
    rect(roomWidth, 16),
    pos(uiOffset / 2, roomHeight + 8 + uiOffset / 2 - 4),
    area(),
    solid(),
    origin("left"),
    { dir: "topdown" },
  ]);
  add([
    "wall",
    opacity(op),
    color(255, 0, 0),
    rect(16, roomHeight),
    pos(8 + uiOffset / 2 - 4, 8 + uiOffset / 2),
    area(),
    solid(),
    origin("top"),
    { dir: "leftright" },
  ]);
  add([
    "wall",
    opacity(op),
    color(255, 0, 0),
    rect(16, roomHeight),
    pos(roomWidth + uiOffset / 2 - 4, 8 + uiOffset / 2),
    area(),
    solid(),
    origin("top"),
    { dir: "leftright" },
  ]);
};

export const levelMap = level;
