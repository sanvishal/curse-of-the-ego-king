import { addDust } from "./dust.js";

export const addFireball = ({ x, y, dir, spd }) => {
  let fireball = add([
    sprite("sprFireball"),
    layer("game"),
    area({ scale: 0.7 }),
    "projectile",
    cleanup(),
    origin("center"),
    pos(x, y),
    move(dir, spd),
    {
      update: (e) => {
        if (Math.random(1) < 0.1 && Math.random(1) < 0.1) {
          addDust({
            x: e.pos.x,
            y: e.pos.y,
          });
        }
      },
    },
  ]);
  return fireball;
};
