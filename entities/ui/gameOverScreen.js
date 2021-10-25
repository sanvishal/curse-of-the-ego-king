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
    {
      op: 0,
      timer: 50,
      textop: 0,
      textTargY: 0,
      text: "you are not forgiven",
      secText: "Thanks for playing, let me know what you think :)",
      special: false,
    },
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
          let text = goScreen.text;
          drawText({
            text,
            origin: "center",
            font: "sink",
            opacity: goScreen.textop,
            transform: (i) => {
              return {
                pos: vec2(
                  (i - text.length / 2) * 4,
                  wave(-1, 1, time() + i * (goScreen.special ? 10 : 5))
                ),
                color: goScreen.special
                  ? rgb(
                      wave(100, 255, time()),
                      wave(100, 255, time() + 1),
                      wave(100, 255, time() + 2)
                    )
                  : rgb(255, 255, 255),
              };
            },
          });
          popTransform();

          pushTransform();
          pushTranslate(
            getActualCenter().x,
            getActualCenter().y - goScreen.textTargY + 70
          );
          drawText({
            text: goScreen.secText,
            origin: "center",
            font: "sink",
            size: 8,
            opacity: goScreen.textop,
          });
          popTransform();
        }
      },
    },
    {
      fadeIn: (text, secText, special) => {
        goScreen.special = special;
        goScreen.text = text;
        goScreen.triggerFadeIn = true;
        goScreen.secText = secText;
      },
    },
  ]);

  return goScreen;
};
