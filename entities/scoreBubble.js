export const addScoreBubble = ({ x, y, amount }) => {
  let score = add([
    text(String(amount), { font: "sink", size: 7 }),
    pos(x, y),
    { timer: 0, rot: 0 },
    {
      update: (e) => {
        e.timer += 1;
        e.pos.y = lerp(e.pos.y, y - 10, 0.06);

        if (e.timer % 10 < 5) {
          e.use(choose([color(213, 60, 106), color(178, 217, 66)]));
        } else {
          e.use(color(255, 255, 255));
        }

        if (e.timer > 75) {
          destroy(e);
        }
      },
    },
    origin("center"),
  ]);

  return score;
};
