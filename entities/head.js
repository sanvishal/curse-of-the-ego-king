import { roomHeight } from "../utils/constants.js";
import {
  clamp,
  cos,
  floor,
  lengthdir_x,
  lengthdir_y,
  sin,
} from "../utils/helpers.js";
import { addDust } from "./dust.js";
import { getPlayer } from "./player.js";

export const addHead = () => {
  let head = add([
    // rect(20, 20),
    sprite("sprHead"),
    pos(center()),
    origin("center"),
    layer("game"),
    area(),
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
      aoe: roomHeight / 2 - 50,
      hitWall: false,
    },
    {
      update: (e) => {
        e.spd -= e.fric;
        e.spd = clamp(e.spd, 0, 200);

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

        e.rot += e.spd / 4;
        e.rot = e.rot % 360;
        if (floor(mapc(e.spd, 0, 100, 0, 2)) === 0) {
          e.frame = 0;
        } else {
          e.frame += floor(mapc(e.spd, 0, 150, 0, 2));
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
            if (Math.random() < 0.2) {
              d.use(color(213, 60, 106));
            }
          }
        }
      },
      shoot: (dir, power) => {
        head.dir = dir;
        head.spd = power;
      },
      resetSpeed: () => {
        head.spd = 0;
        head.hspd = 0;
        head.vspd = 0;
      },
      draw: () => {
        let steps = 0.06;
        let player = getPlayer();
        let dist = player.pos.dist(head.pos);
        for (let i = 0; i < Math.PI * 2; i += steps) {
          pushTransform();
          pushTranslate(
            head.pos.x + cos(i) * head.aoe,
            head.pos.y + sin(i) * head.aoe
          );
          drawCircle({
            radius: 0.8,
            origin: "center",
            // color: rgb(0, wave(150, 255, time()), wave(150, 255, time())),
            opacity: dist > head.aoe ? 0.8 : 0.4,
          });
          popTransform();
        }
      },
    },
  ]);

  return head;
};

export const getHead = () => {
  return get("head")?.[0];
};