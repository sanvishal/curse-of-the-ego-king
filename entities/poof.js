export const addPoof = ({ x, y }) => {
  let poof = add([
    sprite("sprProjPoof", { anim: "poof" }),
    origin("center"),
    layer("game"),
    rotate(rand(0, 360)),
    pos(x, y),
    { timer: 0 },
    {
      update: (e) => {
        e.timer++;
        e.use(color(rand(150, 255), rand(150, 255), rand(100, 255)));
        if (e.timer > 20) {
          destroy(e);
        }
      },
    },
  ]);

  return poof;
};
