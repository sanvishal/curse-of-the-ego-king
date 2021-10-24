import { getPlayer } from "../player.js";
import { getHealthManager } from "./healthManager.js";

export const addSingleHealth = ({ x, y, i, initHealth = true }) => {
  let hm = getHealthManager();
  let player = getPlayer();

  let health = add([
    sprite("sprHeart"),
    pos(x, y),
    scale(1),
    origin("center"),
    layer("ui"),
    fixed(),
    { hasHealth: initHealth, initY: y },
    {
      update: (e) => {
        e.use(opacity(health.hasHealth ? 1 : 0.4));
        if (e.hasHealth) {
          e.pos.y = e.initY + wave(-1, 1, 2 * (time() + i));
        } else {
          e.pos.y = e.initY;
        }
      },
    },
    {
      toggle: (h) => {
        health.hasHealth = h;
      },
    },
    {
      draw: () => {
        let col = rgb(255, 255, 255);
        if (player.awayTimer > 0 && player.awayTimer % 10 < 5) {
          col = rgb(213, 60, 106);
        } else {
          col = rgb(255, 255, 255);
        }
        if (i === hm.health - 1 && health.hasHealth && player.activateRing) {
          pushTransform();
          pushTranslate(health.pos.x - health.width / 2 - 1, health.pos.y);
          drawRect({
            origin: "left",
            width: mapc(player.awayTimer % 200, 0, 200, health.width + 3, 0),
            height: health.height + 3,
            opacity: 0.4,
            color: col,
          });
          popTransform();
        }
      },
    },
  ]);
  return health;
};
