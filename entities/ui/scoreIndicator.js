import { getGameManager } from "../../gameManager.js";

export const addScoreIndicator = ({ x, y }) => {
  let gm = getGameManager();

  let si = add([
    text(0, { font: "sink", size: 16 }),
    pos(x, y),
    origin("right"),
    layer("ui"),
    fixed(),
    { timer: 0, triggerChange: false },
    {
      update: (e) => {
        if (e.triggerChange) {
          e.timer++;
          if (e.timer % 10 < 5) {
            e.use(color(213, 60, 106));
          } else {
            e.use(color(255, 255, 255));
          }
          if (e.timer >= 30) {
            e.timer = 0;
            e.triggerChange = false;
          }
        } else {
          e.use(color(255, 255, 255));
        }
      },
    },
  ]);

  gm.on("updateScoreIndicator", () => {
    si.text = gm.score;
    si.triggerChange = true;
  });

  return si;
};
