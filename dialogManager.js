import { roomHeight, roomWidth, uiOffset } from "./utils/constants.js";
import { approach } from "./utils/helpers.js";

export const addDialogManager = () => {
  const getSprite = (who) => {
    switch (who) {
      case "ego":
        return "sprHead";
      case "witch":
        return "sprWitch";
      case "wiggle":
        return "sprWiggle";
    }
  };

  const isUpperCase = (string) => /^[A-Z]*$/.test(string);

  let dm = add([
    "dialogManager",
    layer("uiOverlay"),
    {
      triggerOpen: false,
      openFor: 0,
      lifetime: 400,
      currY: roomHeight + uiOffset + 10,
      openY: roomHeight + uiOffset / 2,
      closeY: roomHeight + uiOffset + 20,
      xscale: 1.2,
      yscale: 1.2,
      saidThing: [],
      thingToSay: [],
      dialogOpenWidth: roomWidth - uiOffset * 2,
      dialogCurrWidth: 0,
      slow: false,
      who: "",
      say: ({ who = "", what = "", slow = false }) => {
        dm.thingToSay = [];
        dm.saidThing = [];
        dm.triggerOpen = true;
        dm.openFor = 0;
        dm.thingToSay = what.split(" ");
        dm.slow = slow;
        dm.who = who;
      },
      update: (e) => {
        if (e.triggerOpen) {
          e.currY = lerp(e.currY, e.openY, 0.1);
          if (e.openFor >= 20) {
            e.dialogCurrWidth = lerp(
              e.dialogCurrWidth,
              e.dialogOpenWidth,
              0.05
            );
          }
        } else {
          e.thingToSay = [];
          e.saidThing = [];
          e.currY = lerp(e.currY, e.closeY, 0.1);
        }

        if (e.triggerOpen) {
          e.openFor++;
          if (
            e.openFor > 30 &&
            e.openFor % (e.slow ? 40 : 10) === 0 &&
            e.thingToSay?.length !== 0
          ) {
            e.saidThing.push(e.thingToSay.shift());
          }
          if (
            e.openFor >=
            (e.lifetime * (e.thingToSay?.length || 1)) / (e.slow ? 1 : 1.2)
          ) {
            e.triggerOpen = false;
            e.openFor = 0;
          }
        }

        if (
          e.openFor % (e.slow ? 40 : 10) === 0 &&
          e.thingToSay?.length !== 0
        ) {
          e.xscale = e.who === "witch" ? 1.8 : 1.4;
          e.yscale = e.who === "witch" ? 1.8 : 1.4;
        }

        e.xscale = lerp(e.xscale, e.who === "witch" ? 1.5 : 1.2, 0.07);
        e.yscale = lerp(e.yscale, e.who === "witch" ? 1.5 : 1.2, 0.07);
      },
      draw: () => {
        if (dm.who) {
          pushTransform();
          pushTranslate(uiOffset, dm.currY);
          drawCircle({
            radius: 15,
            color: rgb(0, 0, 0),
            origin: "center",
          });
          popTransform();

          pushTransform();
          pushTranslate(uiOffset + 20, dm.currY - 12);
          drawRect({
            width: dm.dialogCurrWidth,
            height: 50,
            color: rgb(0, 0, 0),
            radius: 2,
            origin: "topleft",
          });
          popTransform();

          pushTransform();
          pushTranslate(uiOffset + 25, dm.currY - 7);
          drawText({
            text: dm.saidThing.join(" "),
            font: "sink",
            color: rgb(255, 255, 255),
            size: 8,
            height: 24,
            width: roomWidth - uiOffset * 2 - 10,
            origin: "topleft",
            transform: (i, c) => {
              return {
                pos: vec2(
                  0,
                  isUpperCase(c) ? wave(-0.7, 0.7, (time() + i) * 7) : 0
                ),
                color: isUpperCase(c)
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
          pushTranslate(uiOffset, dm.currY);
          pushRotate(-20 + wave(-10, 10, time() * 7));
          drawSprite({
            sprite: getSprite(dm.who),
            origin: "center",
            scale: vec2(dm.xscale, dm.yscale),
          });
          popTransform();
        }
      },
    },
  ]);

  return dm;
};

export const getDialogManager = () => {
  return get("dialogManager")?.[0];
};
