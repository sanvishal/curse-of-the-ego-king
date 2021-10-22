import { floor } from "../utils/helpers.js";

export const addDust = ({ x, y, dir = 0, spd = 0, isSpawn = false }) => {
  let dust = add([
    sprite("sprDust"),
    layer(isSpawn ? "ui" : "dust"),
    pos(x, y),
    origin("center"),
    scale(isSpawn ? 2 : 1),
    move(dir, spd),
    { sFrame: choose([0, 8, 16]) },
    {
      update: (e) => {
        e.sFrame += isSpawn ? 0.3 : 0.2;
        e.frame = floor(e.sFrame);

        if (isSpawn) {
          e.use(rotate(time() * 200));
          e.use(color(255, 113, 116));
        }

        if ([7, 15, 23].includes(e.frame)) {
          destroy(e);
        }
      },
    },
  ]);

  return dust;
};
