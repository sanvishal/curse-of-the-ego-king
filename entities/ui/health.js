export const addSingleHealth = ({ x, y, i, initHealth = true }) => {
  let health = add([
    sprite("sprHeart"),
    pos(x, y),
    scale(1.5),
    origin("center"),
    layer("ui"),
    fixed(),
    { hasHealth: initHealth },
    {
      toggle: (h) => {
        health.hasHealth = h;
        health.frame = health.hasHealth ? 0 : 1;
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
