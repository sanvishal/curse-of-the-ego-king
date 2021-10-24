import { lengthdir_x, lengthdir_y, rLerp } from "../utils/helpers.js";
import { addDust } from "./dust.js";
import { getPlayer } from "./player.js";

export const addFireball = ({ x, y, dir, spd, special = false }) => {
  let player = getPlayer();
  let fireball = add([
    sprite(special ? "sprSplFireball" : "sprFireball"),
    layer("game"),
    area({ scale: 0.7 }),
    "projectile",
    cleanup(),
    origin("center"),
    pos(x, y),
    move(dir, spd),
    {
      special,
      followTimer: 0,
      dir: 0,
      isDeflected: false,
      defSpd: 0,
      deflectDir: 0,
      xDir: 1,
      yDir: 1,
    },
    {
      update: (e) => {
        if (
          Math.random(1) < (e.special ? (e.isDeflected ? 0.6 : 0.34) : 0.1) &&
          Math.random(1) < (e.special ? (e.isDeflected ? 0.6 : 0.34) : 0.1)
        ) {
          addDust({
            x: e.pos.x,
            y: e.pos.y,
          }).use(
            e.special
              ? e.isDeflected
                ? color(255, 0, 255)
                : color(0, 255, 0)
              : color(255, 255, 255)
          );
        }

        if (e.special) {
          e.followTimer++;
          let dir;
          if (e.followTimer > 500) {
            dir = e.dir;
          } else {
            dir = e.isDeflected ? e.deflectDir : player.pos.angle(e.pos);
          }
          e.dir = rad2deg(rLerp(deg2rad(e.dir), deg2rad(dir), 0.02));
          e.pos.x +=
            lengthdir_x(e.isDeflected ? e.defSpd : 0.7, e.dir) * e.xDir;
          e.pos.y +=
            lengthdir_y(e.isDeflected ? e.defSpd : 0.7, e.dir) * e.yDir;
        }
      },
    },
  ]);
  return fireball;
};
