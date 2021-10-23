import { approach, clamp } from "../utils/helpers.js";

export const addBlock = ({ x, y }) => {
  let block = add([
    rect(17, 17),
    opacity(0),
    area({ scale: 0.7 }),
    layer("game"),
    origin("center"),
    "block",
    pos(x, y),
    { xscale: 1, yscale: 1 },
    {
      draw: () => {
        block.xscale = approach(block.xscale, 1, 0.05);
        block.yscale = approach(block.yscale, 1, 0.05);
        pushTransform();
        pushTranslate(block.pos.x, block.pos.y);
        drawSprite({
          sprite: "sprBlock",
          origin: "center",
          scale: vec2(block.xscale, block.yscale),
        });
        popTransform();
      },
    },
  ]);
  return block;
};
