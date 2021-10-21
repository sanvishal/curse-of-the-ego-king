import { roomHeight, roomWidth, uiOffset } from "../../utils/constants.js";
import { clamp, lengthdir_x, lengthdir_y, rLerp } from "../../utils/helpers.js";
import { addHittable } from "../hittable.js";
import { getPlayer } from "../player.js";

export const addSlime = ({ x, y }) => {
  let player = getPlayer();
  let slime = add([
    sprite(choose(["sprSlime1", "sprSlime2"]), { anim: "slime" }),
    pos(x, y),
    { hitBox: null },
    origin("center"),
    {
      dir: 0,
      hspd: 0,
      vspd: 0,
      spd: 0.3,
      fric: 0.1,
      pushBack: false,
      pushBackDir: 0,
      pushBackTimer: 40,
    },
    {
      update: (e) => {
        e.spd -= e.fric;
        e.spd = clamp(e.spd, 0.3, 200);
        let dir = e.pushBack ? e.pushBackDir : player.pos.angle(e.pos);
        let dist = player.pos.dist(e.pos);
        e.dir = rad2deg(
          rLerp(deg2rad(e.dir), deg2rad(dir), dist < 20 ? 0.01 : 0.6)
        );
        e.hspd = lengthdir_x(e.spd, e.dir);
        e.vspd = lengthdir_y(e.spd, e.dir);
        e.pos.x += e.hspd;
        e.pos.y += e.vspd;

        if (e.pushBack) {
          e.pushBackTimer -= 1;
        }

        if (e.pushBackTimer <= 0) {
          if (e.spd <= 0.4) {
            e.pushBack = false;
            e.pushBackTimer = 40;
          }
        }

        if (e.hspd < 0) {
          e.flipX(true);
        } else {
          e.flipX(false);
        }

        e.pos.x = clamp(
          e.pos.x,
          uiOffset / 2 + e.width / 2 + 9,
          roomWidth - e.width / 2 + uiOffset / 2 - 9
        );
        e.pos.y = clamp(
          e.pos.y,
          e.width / 2 + uiOffset / 2 + 15,
          roomHeight - e.height / 2 + uiOffset / 4 + 4
        );
      },
    },
  ]);

  let hittable = addHittable({
    parent: slime,
    width: 10,
    height: 5,
    offset: vec2(0, 2),
    damagesPlayer: true,
  });
  slime.hitBox = hittable;

  return slime;
};
