import { roomHeight, roomWidth, uiOffset } from "../../utils/constants.js";
import { getActualCenter } from "../../utils/helpers.js";

export const addGameOverScreen = () => {
  let goScreen = add([
    rect(roomWidth, roomHeight),
    color(0, 0, 0),
    z(1000),
    pos(uiOffset / 4 + uiOffset / 4, uiOffset / 2 + uiOffset / 4),
    layer("uiOverlay"),
    opacity(0),
    origin("topleft"),
    { op: 0, timer: 50, textop: 0, textTargY: 0 },
    {
      update: (e) => {
        if (e.triggerFadeIn) {
          e.timer--;
          if (e.timer <= 0) {
            e.op = lerp(e.op, 0.7, 0.05);
            e.use(opacity(e.op));
          }
        }
      },
      draw: () => {
        if (goScreen.timer <= -70) {
          goScreen.textop = lerp(goScreen.textop, 1, 0.05);
          goScreen.textTargY = lerp(goScreen.textTargY, 40, 0.02);
          // prevent overflows I guess???
          goScreen.timer = -100;
          pushTransform();
          pushTranslate(
            getActualCenter().x,
            getActualCenter().y - goScreen.textTargY
          );
          drawText({
            text: "you did not escape",
            origin: "center",
            font: "sink",
            opacity: goScreen.textop,
          });
          popTransform();
        }
      },
    },
    {
      fadeIn: () => {
        goScreen.triggerFadeIn = true;
      },
    },
  ]);

  return goScreen;
};
