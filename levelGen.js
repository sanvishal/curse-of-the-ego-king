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
  addLevel(level, {
    width: 16,
    height: 16,
    w: (c) => {
      if (c.y === 0 || c.y === floor(roomHeight / 16) - 1) {
        return [
          "wall",
          opacity(0),
          rect(16, 16),
          area(),
          solid(),
          origin("center"),
          pos(
            8 + uiOffset / 2,
            8 + uiOffset + (floor(roomHeight / 16) - 1 === c.y ? -4 : -6)
          ),
          { dir: "topdown" },
        ];
      }
      if (c.x === 0 || c.x === floor(roomWidth / 16) - 1) {
        return [
          "wall",
          opacity(0),
          rect(16, 16),
          area(),
          solid(),
          origin("center"),
          pos(
            8 + uiOffset / 2 + (floor(roomWidth / 16) - 1 === c.x ? 4 : -4),
            8 + uiOffset / 2 + 11
          ),
          { dir: "leftright" },
        ];
      }
    },
  });
};

export const levelMap = level;
