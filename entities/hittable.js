import { getHead } from "./head.js";

export const addHittable = ({
  parent,
  width,
  height,
  offset = vec2(0, 0),
  damagesPlayer = false,
  debug = false,
}) => {
  let head = getHead();

  let hitConstruct = [
    rect(width, height),
    area(),
    "hitBox",
    layer("ui"),
    origin("center"),
    pos(vec2(parent.pos.x + offset.x, parent.pos.y + offset.y)),
    { debug, parent },
    {
      update: (e) => {
        e.pos = vec2(parent.pos.x + offset.x, parent.pos.y + offset.y);
        e.use(opacity(e.debug ? 0.6 : 0));
      },
      draw: () => {
        if (hit.debug) {
          pushTransform();
          pushTranslate(hit.pos.x - width / 2, hit.pos.y - height / 2);
          drawRect({
            width,
            height,
            fill: false,
            outline: {
              width: 1,
              color: rgb(
                wave(0, 255, time()),
                wave(0, 255, time() + 1),
                wave(0, 255, time() + 2)
              ),
            },
          });
          popTransform();
        }
      },
    },
  ];
  if (damagesPlayer) {
    hitConstruct.push("enemy");
  }
  let hit = add(hitConstruct);

  return hit;
};
