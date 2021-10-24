import { approach, clamp } from "../utils/helpers.js";
import { addDust } from "./dust.js";

export const addBlock = ({ x, y }) => {
  let block = add([
    sprite("sprBlock"),
    // rect(17, 17),
    // opacity(0),
    area({ scale: 0.7 }),
    layer("bg"),
    origin("center"),
    "block",
    "hazard",
    pos(x, y),
    { xscale: 1, yscale: 1 },
    {
      add: () => {
        for (let i = 0; i < 3; i++) {
          addDust({
            x: x + rand(-10, 10),
            y: y + rand(-10, 10),
            isSpawn: true,
            dir: -90,
            spd: 15,
          });
        }
      },
      update: (e) => {
        e.xscale = approach(block.xscale, 1, 0.05);
        e.yscale = approach(block.yscale, 1, 0.05);
        e.use(scale(vec2(e.xscale, e.yscale)));
      },
    },
    // {
    //   draw: () => {
    //     pushTransform();
    //     pushTranslate(block.pos.x, block.pos.y);
    //     drawSprite({
    //       sprite: "sprBlock",
    //       origin: "center",
    //       scale: vec2(block.xscale, block.yscale),
    //     });
    //     popTransform();
    //   },
    // },
  ]);
  return block;
};
