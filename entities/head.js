import { clamp, floor, lengthdir_x, lengthdir_y } from "../utils/helpers.js";
import { addDust } from "./dust.js";

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
    },
  ]);
  console.log(head.numFrames());
  return head;
};

export const getHead = () => {
  return get("head")?.[0];
};
