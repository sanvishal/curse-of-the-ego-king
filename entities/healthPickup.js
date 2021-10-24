import { addScoreBubble } from "./scoreBubble.js";

export const addHealthPickup = ({ x, y }) => {
  let healthPicukup = add([
    sprite("sprHeart"),
    area(),
    "healthPickup",
    pos(x, y),
    origin("center"),
    { timer: 0 },
    {
      update: (e) => {
        e.timer++;
        if (e.timer % 10 < 5) {
          e.use(choose([color(213, 60, 106)]));
        } else {
          e.use(color(255, 255, 255));
        }

        if (e.timer >= 700) {
          addScoreBubble({
            x: e.pos.x,
            y: e.pos.y,
            amount: "x",
          });
          destroy(e);
        }
      },
    },
  ]);

  return healthPicukup;
};
