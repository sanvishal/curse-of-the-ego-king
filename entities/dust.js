export const addDust = ({ x, y, dir = 0, spd = 0 }) => {
  let dust = add([
    sprite("sprDust", { anim: choose(["poof1", "poof2", "poof3"]) }),
    layer("dust"),
    pos(x, y),
    origin("center"),
    move(dir, spd),
    {
      update: (e) => {
        if ([7, 15, 23].includes(e.frame)) {
          destroy(e);
        }
      },
    },
  ]);

  return dust;
};
