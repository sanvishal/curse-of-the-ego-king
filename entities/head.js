import { getGameManager } from "../gameManager.js";
import { roomHeight } from "../utils/constants.js";
import {
  clamp,
  cos,
  floor,
  getActualCenter,
  lengthdir_x,
  lengthdir_y,
  sin,
} from "../utils/helpers.js";
import { addDust } from "./dust.js";
import { getPlayer } from "./player.js";

export const addHead = () => {
  let gm = getGameManager();
  let player = null;
  let head = add([
    // rect(20, 20),
    sprite("sprHead"),
    pos(getActualCenter()),
    origin("center"),
    layer("game"),
    area({ shape: "circle" }),
    outline({ width: 2, color: rgb(255, 0, 0) }),
    solid(),
    // color(255, 0, 255),
    "head",
    {
      fric: 0.2,
      spd: 0,
      dir: 0,
      hspd: 0,
      vspd: 0,
      brake: 0.2,
      headDeltaX: [0, 0],
      headDeltaY: [0, 0],
      rot: 0,
      aoe: roomHeight / 2 - 30,
      hitWall: false,
      playing: false,
      damagesPlayer: false,
    },
    {
      update: (e) => {
        e.spd -= e.fric;
        e.spd = clamp(e.spd, 0, 300);

        e.hspd += lengthdir_x(e.spd, e.dir);
        e.vspd += lengthdir_y(e.spd, e.dir);

        e.hspd = lerp(e.hspd, 0, e.brake);
        e.vspd = lerp(e.vspd, 0, e.brake);

        e.move(e.hspd, e.vspd);
        e.dir = vec2(e.pos.x + e.hspd, e.pos.y + e.vspd).angle(e.pos);
        // e.use(z(e.pos.y));

        e.headDeltaX.push(e.pos.x);
        e.headDeltaX.shift();
        e.headDeltaY.push(e.pos.y);
        e.headDeltaY.shift();

        if (e.spd <= 50) {
          e.hitWall = false;
        }

        if (e.damagesPlayer) {
          e.use(color(213, 60, 106));
        } else {
          e.unuse("color");
        }

        e.rot += e.spd / 4;
        e.rot = e.rot % 360;
        // if (floor(mapc(e.spd, 0, 100, 1, 2)) === 1) {
        //   e.frame = 0;
        // } else {
        //   e.frame += floor(mapc(e.spd, 0, 150, 1, 2));
        // }
        if (e.spd >= 30) {
          e.frame += floor(mapc(e.spd, 0, 150, 1, 3));
        } else {
          e.frame = 0;
        }

        e.frame %= e.numFrames();
        e.use(rotate(e.rot));
        e.use(z(e.pos.y));

        if (e.spd >= 10) {
          // more the speed more the chance of dust
          if (Math.random() <= mapc(e.spd, 0, 150, 0, 1)) {
            let d = addDust({
              x: e.pos.x + rand(-7, 7),
              y: e.pos.y + rand(-7, 7),
              dir: rand(dir, -dir),
              spd: rand(1, 7),
            });
            if (Math.random() < (e.damagesPlayer ? 0.6 : 0.2)) {
              d.use(color(213, 60, 106));
            }
          }
        }
      },
      shoot: (dir, power) => {
        if (head.playing) {
          head.dir = dir;
          head.spd = power * (gm.speedUp ? 1.5 : 1);
        }
      },
      resetSpeed: () => {
        head.spd = 0;
        head.hspd = 0;
        head.vspd = 0;
      },
      draw: () => {
        let steps = 0.1;
        if (!player) {
          player = getPlayer();
        }
        if (player) {
          let color;
          let dist = player.pos.dist(head.pos);
          if (player.isHurt) {
            if (player.invincibleTimer % 10 <= 5 && dist > head.aoe) {
              color = rgb(195, 0, 0);
            } else {
              color = rgb(255, 255, 255);
            }
          }
          for (let i = 0; i < Math.PI * 2; i += steps) {
            pushTransform();
            pushTranslate(
              head.pos.x + cos(i + time() / 20) * head.aoe,
              head.pos.y + sin(i + time() / 20) * head.aoe
            );
            drawCircle({
              radius: 0.8,
              origin: "center",
              color,
              opacity: dist > head.aoe ? 0.8 : 0.4,
            });
            popTransform();
          }
        }
      },
    },
  ]);

  return head;
};

export const getHead = () => {
  return get("head")?.[0];
};
