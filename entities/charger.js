import { clamp, lengthdir_x, lengthdir_y } from "../utils/helpers.js";
import { getHead } from "./head.js";
import { getPlayer } from "./player.js";

export const addChargerLine = () => {
  let head = getHead();
  let player = getPlayer();
  let maxCharge = 40;

  let chargeLine = add([
    rect(maxCharge, 2),
    pos(head.pos),
    "chargerBG",
    layer("game"),
    opacity(0.6),
    {
      update: (e) => {
        let angle = head.pos.angle(player.pos);
        e.angle = angle;
        e.pos.x = head.pos.x + lengthdir_x(head.width / 2, angle);
        e.pos.y = head.pos.y + lengthdir_y(head.height / 2, angle);

        let dist = head.pos.dist(player.pos);
        if (dist < 40) {
          e.use(opacity(0.6));
        } else {
          e.use(opacity(0));
        }
      },
    },
  ]);

  let charger = add([
    rect(0, 2),
    color(255, 0, 0),
    pos(head.pos),
    "charger",
    { charge: 0, maxCharge },
    {
      update: (e) => {
        let c = keyIsDown("z");
        let angle = head.pos.angle(player.pos);
        e.angle = angle;
        e.pos.x = head.pos.x + lengthdir_x(head.width / 2, angle);
        e.pos.y = head.pos.y + lengthdir_y(head.height / 2, angle);
        let dist = head.pos.dist(player.pos);
        if (dist < 40) {
          e.use(opacity(0.6));
        } else {
          e.use(opacity(0));
        }
        if (c) {
          e.width = e.charge;
        } else {
          e.charge -= 2;
          charger.charge = clamp(charger.charge, 0, e.maxCharge);
          e.width = e.charge;
        }
      },
    },
  ]);

  return { chargeLine, charger };
};
