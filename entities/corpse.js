import { clamp, lengthdir_x, lengthdir_y } from "../utils/helpers.js";
import { addDust } from "./dust.js";

export const addCorpse = ({
  x,
  y,
  dir,
  spd,
  spr,
  dieWithPassion = false,
  poofSize,
  isPlayer = false,
}) => {
  let corpse = add([
    sprite(spr),
    origin("center"),
    area(),
    "corpse",
    layer("corpse"),
    scale(0.9),
    cleanup(),
    pos(x, y),
    {
      dir: dir,
      spd: spd,
      hspd: 0,
      vspd: 0,
      fric: 0.1,
      brake: 0.4,
      rot: rand(0, 360),
      disTime: 200,
      blinkFreq: 40,
      dieWithPassion,
      randx: rand(-100, 100),
      randy: rand(-100, 100),
    },
    {
      update: (e) => {
        if (dieWithPassion) {
          e.unuse("color");
          e.pos.x += lengthdir_x(3, e.dir + e.randx) * (isPlayer ? 1.5 : 3);
          e.pos.y += lengthdir_y(3, e.dir + e.randy) * (isPlayer ? 1.5 : 3);
          e.rot += isPlayer ? 20 : 40;
          e.use(rotate(e.rot));

          if (Math.random() < 0.5) {
            addDust({
              x: e.pos.x + rand(-poofSize.x, poofSize.x),
              y: e.pos.y + rand(-poofSize.y, poofSize.y),
            }).use(opacity(0.6));
          }
        } else {
          e.use(color(51, 51, 51));
          e.spd = lerp(e.spd, 0, e.fric);

          e.hspd += lengthdir_x(e.spd, e.dir);
          e.vspd += lengthdir_y(e.spd, e.dir);

          e.hspd = lerp(e.hspd, 0, e.brake);
          e.vspd = lerp(e.vspd, 0, e.brake);

          e.move(e.hspd, e.vspd);
          e.rot += e.spd / 4;
          e.use(rotate(e.rot));
          e.dir = vec2(e.pos.x + e.hspd, e.pos.y + e.vspd).angle(e.pos);

          e.disTime -= 1;

          if (e.disTime <= 0) {
            e.blinkFreq -= 1;
            if (Math.abs(e.disTime) % e.blinkFreq <= 6) {
              e.use(opacity(0));
            } else {
              e.use(opacity(1));
            }
          }

          if (e.disTime <= -50) {
            destroy(e);
          }
        }
      },
    },
  ]);

  return corpse;
};
