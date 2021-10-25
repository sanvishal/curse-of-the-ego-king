import { getGameManager } from "../../gameManager.js";
import {
  bossHealth,
  roomHeight,
  roomWidth,
  uiOffset,
} from "../../utils/constants.js";
import { getHead } from "../head.js";

export const addScoreIndicator = ({ x, y }) => {
  let gm = getGameManager();
  let head = null;
  let si = add([
    // text(0, { font: "sink", size: 16 }),
    pos(x, y),
    origin("right"),
    layer("ui"),
    fixed(),
    { timer: 0, triggerChange: false, text: "0" },
    {
      update: (e) => {
        if (e.triggerChange) {
          e.timer++;
          if (e.timer % 10 < 5) {
            e.use(color(213, 60, 106));
          } else {
            e.use(color(255, 255, 255));
          }
          if (e.timer >= 30) {
            e.timer = 0;
            e.triggerChange = false;
          }
        } else {
          e.use(color(255, 255, 255));
        }
      },
      draw: () => {
        if (!head) {
          head = getHead();
        }

        // draw head decoration
        pushTransform();
        pushTranslate((roomWidth + uiOffset) / 2, si.pos.y - 3);
        drawSprite({
          sprite: "sprHead",
          origin: "center",
          color: head.damagesPlayer ? rgb(213, 60, 106) : rgb(255, 255, 255),
        });
        popTransform();

        // draw combo cooldown bar
        pushTransform();
        pushTranslate(si.pos.x + 2, roomHeight + si.pos.y + uiOffset / 4 - 3);
        drawRect({
          width: 11,
          height: mapc(
            gm.comboCoolDown,
            0,
            gm.maxCoolDown,
            0,
            roomHeight - uiOffset / 4 + 2
          ),
          origin: "botleft",
          opacity: 0.3,
          radius: 1,
        });
        popTransform();

        // draw combo text
        pushTransform();
        pushTranslate(
          roomWidth + uiOffset - uiOffset / 4 + 3,
          si.pos.y + uiOffset / 4
        );
        let col = rgb(255, 255, 255);
        if (si.timer > 0 && si.timer % 10 < 5) {
          col = choose([rgb(213, 60, 106), rgb(178, 217, 66)]);
        } else {
          col = rgb(255, 255, 255);
        }
        drawText({
          text: gm.playerIsDead
            ? `${gm.maxCombo}x MAX COMBO`
            : `${gm.combo}x COMBO`,
          font: "sink",
          size: 8,
          origin: "left",
          transform: (i) => {
            return {
              pos: vec2(
                -i * 6 + (gm.triggerCombo ? wave(-1, 1, 5 * (time() + i)) : 0),
                i * 10
              ),
              color: col,
            };
          },
        });
        popTransform();

        // draw hit name
        pushTransform();
        pushTranslate(uiOffset / 2 - uiOffset / 4 + 5, si.pos.y + uiOffset / 4);
        let isSpecial = ["SPEED UP!", "DEFLECTED!", "DEFLECT HIT!"].includes(
          gm.hitName
        );
        drawText({
          text: gm.hitName,
          font: "sink",
          size: 8,
          origin: "left",
          opacity: gm.triggerCombo ? 0.7 : isSpecial ? 1 : 0.2,
          transform: (i) => {
            return {
              pos: vec2(
                -i * 6 +
                  (gm.triggerCombo || isSpecial
                    ? wave(-1, 1, 5 * (time() + i))
                    : 0),
                i * 10
              ),
              color: isSpecial ? col : rgb(255, 255, 255),
            };
          },
        });
        popTransform();

        // draw boss health bar
        pushTransform();
        pushTranslate(
          si.pos.x - roomWidth / 2 - roomWidth / 4 - 5,
          si.pos.y + uiOffset / 4
        );
        drawRect({
          width: mapc(gm.bossHealth, 0, bossHealth, 0, roomWidth / 2 + 10),
          height: 3,
          origin: "left",
          color: rgb(213, 60, 106),
          radius: 1,
        });
        drawRect({
          width: mapc(bossHealth, 0, bossHealth, 0, roomWidth / 2 + 10),
          height: 3,
          origin: "left",
          // color: rgb(213, 60, 106),
          fill: false,
          radius: 1,
          outline: {
            width: 1,
            color: rgb(255, 255, 255),
          },
        });
        popTransform();

        // draw score
        pushTransform();
        pushTranslate(si.pos.x, si.pos.y);
        drawText({
          text: si.text,
          font: "sink",
          size: 16,
          origin: "right",
        });
        popTransform();
      },
    },
  ]);

  gm.on("updateScoreIndicator", () => {
    si.text = `${gm.score}`;
    si.triggerChange = true;
  });

  return si;
};
