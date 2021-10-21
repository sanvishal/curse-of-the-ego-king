import { roomHeight, roomWidth, uiOffset } from "../../utils/constants.js";
import {
  clamp,
  cos,
  getActualCenter,
  lengthdir_x,
  lengthdir_y,
  rLerp,
  sin,
} from "../../utils/helpers.js";
import { addDust } from "../dust.js";
import { addHittable } from "../hittable.js";
import { getPlayer } from "../player.js";

export const addSkeleHead = ({ x, y }) => {
  let skeleHead = add([
    sprite("sprSkeleHead"),
    pos(x, y),
    { hitBox: null },
    area(),
    "skeleHead",
    origin("center"),
    {
      dir: 0,
      targetPos: vec2(0, 0),
      hspd: 0,
      vspd: 0,
      spd: 4,
      fric: 0.1,
      pushBack: false,
      pushBackDir: 0,
      pushBackTimer: 40,
      xscale: 1,
      yscale: 1,
      targetTimer: 400,
    },
    {
      update: (e) => {
        e.spd -= e.fric;
        e.spd = clamp(e.spd, 4, 200);
        let dir = e.pushBack ? e.pushBackDir : e.targetPos.angle(e.pos);
        e.dir = rad2deg(rLerp(deg2rad(e.dir), deg2rad(dir), 0.03));
        e.hspd = lengthdir_x(e.spd, 0);
        e.vspd = lengthdir_y(e.spd, 0);
        e.pos.x = getActualCenter().x + cos(time() / 2) * 50;
        e.pos.y = getActualCenter().y + sin(time() / 2) * 50;

        if (Math.random() < 0.2) {
          addDust({ x: e.pos.x + rand(-3, 3), y: e.pos.y + rand(-3, 3) }).use(
            color(255, 0, 0)
          );
        }
        e.use(rotate(wave(-15, 15, time() * 4)));

        if (e.pushBack) {
          e.pushBackTimer -= 1;
        }

        if (e.pushBackTimer <= 0) {
          if (e.spd <= 0.4) {
            e.pushBack = false;
            e.pushBackTimer = 40;
          }
        }

        e.xscale = lerp(e.xscale, 1, 0.1);
        e.yscale = lerp(e.yscale, 1, 0.1);
        e.use(scale(vec2(e.xscale, e.yscale)));

        e.pos.x = clamp(
          e.pos.x,
          uiOffset / 2 + e.width / 2 + 9,
          roomWidth - e.width / 2 + uiOffset / 2 - 9
        );
        e.pos.y = clamp(
          e.pos.y,
          e.height / 2 + uiOffset / 2 + 22,
          roomHeight - e.height / 2 + uiOffset / 4 + 6
        );
      },
    },
  ]);

  let hittable = addHittable({
    parent: skeleHead,
    width: 6,
    height: 6,
    damagesPlayer: true,
  });
  skeleHead.hitBox = hittable;

  return skeleHead;
};
