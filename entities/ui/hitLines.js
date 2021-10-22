export const addHitLines = ({ x, y, n = 10 }) => {
  let getRandDirs = () => {
    let a = [];
    for (let i = 0; i < n; i++) {
      a.push(rand(0, 360));
    }
    return a;
  };

  let lines = add([
    pos(x, y),
    {
      targx: getRandDirs(n),
      targy: getRandDirs(n),
      timer: 0,
    },
    {
      draw: () => {
        for (let i = 0; i < n; i++) {
          pushTransform();
          pushTranslate(0, 0);
          drawTriangle({
            opacity: 0.4,
            p3: vec2(x, y),
            p2: vec2(
              rand(-20, 20) + x + Math.cos(lines.targx[i]) * 512,
              rand(-20, 20) + y + Math.sin(lines.targy[i]) * 512
            ),
            p1: vec2(
              x + Math.cos(lines.targx[i]) * 512,
              y + Math.sin(lines.targy[i]) * 512
            ),
          });
          popTransform();
        }
        lines.timer++;
        if (lines.timer > 4) {
          destroy(lines);
        }
      },
    },
  ]);
  console.log(lines.targx, lines.targy);
};
