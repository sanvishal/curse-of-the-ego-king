import { addScoreBubble } from "./scoreBubble.js";

export const addLetterPickUp = ({ x, y, letter }) => {
  let letterPickup = add([
    text(letter, { font: "sinko", size: 16 }),
    area(),
    "healthPickup",
    "letterPickup",
    pos(x, y),
    origin("center"),
    { timer: 0, letter },
    {
      update: (e) => {
        e.timer++;
        if (e.timer % 10 < 5) {
          e.use(choose([color(213, 60, 106)]));
        } else {
          e.use(color(255, 255, 255));
        }
      },
    },
  ]);

  return letterPickup;
};
