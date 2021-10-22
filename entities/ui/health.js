export const addSingleHealth = ({ x, y, i, initHealth = true }) => {
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
        health.use(opacity(health.hasHealth ? 1 : 0.4));
        if (health.hasHealth) {
          health.use(opacity(1));
        } else {
          health.use(opacity(0.4));
        }
      },
    },
  ]);
  return health;
};
