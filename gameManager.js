// enemyTypes - depreciated
/*
slime - move towards you and touches you, damages you - 0
flying skele head - moves towards you and stays at a distance and fires a bullet occasionally - 1
spike traps - spikes at the bottom, you can't break it - 2
auto shooter - a machine that shoots projectiles in four directions, you can break it but hard to break - 3 // didnt do
*/

import { getDialogManager } from "./dialogManager.js";
import { addBlock } from "./entities/block.js";
import { addDust } from "./entities/dust.js";
import { addGhostDude } from "./entities/enemies/ghostDude.js";
import { addSkeleHead } from "./entities/enemies/skeleHead.js";
import { addSlime } from "./entities/enemies/slime.js";
import { addSnakeBoss, getSnakeBosss } from "./entities/enemies/snakeBoss.js";
import { addSnakeBossBodyPart } from "./entities/enemies/snakeBossBodyPart.js";
import { addSpike } from "./entities/enemies/spike.js";
import { getHead } from "./entities/head.js";
import { addHealthPickup } from "./entities/healthPickup.js";
import { getPlayer } from "./entities/player.js";
import { getHealthManager } from "./entities/ui/healthManager.js";
import { addHitLines } from "./entities/ui/hitLines.js";
import {
  uiOffset,
  roomWidth,
  roomHeight,
  bossHealth,
} from "./utils/constants.js";
import {
  approach,
  clamp,
  getActualCenter,
  getRandomArbitrary,
  lengthdir_x,
  lengthdir_y,
} from "./utils/helpers.js";

let randDeg = getRandomArbitrary(0, 360);

const getThingToSayOnStart = (wave) => {
  switch (wave) {
    case 0:
      return {
        what: choose([
          "this is enough to put you down!",
          "this should be super easy... for me",
        ]),
        slow: false,
      };
    case 1:
      return {
        what: choose([
          "behold... my SKELE HEADS!!!",
          "i summon thee, whatever...",
          "double the trouble with my SKELE HEADS",
        ]),
        slow: false,
      };
    case 2:
      return {
        what: choose([
          "step on those weird looking floor for the JOKES, haha",
          "weird looking tiles?? STEP ON THEM to find out",
        ]),
        slow: false,
      };
    case 3:
      return {
        what: choose([
          "bounce your head on that thingy",
          "who's giving you those health pickups!!",
        ]),
        slow: false,
      };
    case 4:
      return {
        what: choose(["behold my GHOST DUDES, figure out what they do"]),
        slow: false,
      };
    case 5:
      return {
        what: choose([
          "behold my... SKELE HEAD PRO MAX",
          "i summon thee... SKELE HEAD PRO MAX",
        ]),
        slow: false,
      };
    case 6:
      return {
        what: choose([
          "this is GHOST DUDES playground",
          "GHOST DUDES are loving it, unlike you",
          "GHOST DUDES favorite sport is head ball",
        ]),
        slow: false,
      };
    case 7:
      return {
        what: choose([
          "floor is lava, i only got so much mana",
          "try standing still, i dare",
        ]),
        slow: false,
      };
    case 8:
      return {
        what: choose(["just say SORRY and this will be over!"]),
        slow: false,
      };
    case 9:
      return {
        what: choose(["SWOOOOOOOOOOOOOOOSH"]),
        slow: true,
      };
  }
};

const getThingToSayOnEnd = (wave) => {
  switch (wave) {
    case 0:
      return {
        what: choose([
          "haha.. anyone can win those slimes",
          "not bad, not good",
          "jokes on you, there's more to come",
        ]),
        slow: false,
      };
    case 1:
      return {
        what: choose([
          "you should've lost a health or two",
          "how are you even walking?",
        ]),
        slow: false,
      };
    case 2:
      return {
        what: choose([
          "did you stand on those tiles? fun, ain't it?",
          "not good, not terrible",
        ]),
        slow: false,
      };
    case 3:
      return {
        what: choose([
          "you should've lost a health or two",
          "we are just getting started",
        ]),
        slow: false,
      };
    case 4:
      return {
        what: choose([
          "you should've lost a health or two",
          "i think GHOST DUDES like your head",
        ]),
        slow: false,
      };
    case 5:
      return {
        what: choose([
          "you can deflect those green balls?? that's new",
          "that was hard, ain't it? there's more!",
        ]),
        slow: false,
      };
    case 6:
      return {
        what: choose(["GHOST DUDES favorite sport is head ball"]),
        slow: false,
      };
    case 7:
      return {
        what: choose([
          "you survived that? let's see how you do this...",
          "this is not looking good, i'll have to pull out the big spells",
        ]),
        slow: false,
      };
    case 8:
      return {
        what: choose([
          "you can deflect those green balls?? that's new!",
          "how are you even walking?",
        ]),
        slow: false,
      };
  }
};

const putItems = ({
  xAmount,
  yAmount,
  x = getActualCenter().x,
  y = getActualCenter().y,
  shouldPlace,
  itemName,
  itemWidth,
  itemHeight,
}) => {
  let items = [];
  let startAtX = x - (xAmount * itemWidth) / 2 + 10;
  let startAtY = y - (yAmount * itemHeight) / 2 + 10;
  let iCount = 0;
  let jCount = 0;
  for (let i = startAtX; i < startAtX + xAmount * itemWidth; i += itemWidth) {
    iCount++;
    for (
      let j = startAtY;
      j < startAtY + yAmount * itemHeight;
      j += itemHeight
    ) {
      jCount++;
      if (shouldPlace(iCount, jCount, xAmount, yAmount)) {
        items.push({
          name: itemName,
          props: {
            x: i,
            y: j,
          },
        });
      }
    }
    jCount = 0;
  }
  return items;
};

const waves = [
  {
    enemies: [
      {
        name: "slime",
        props: {
          x: getActualCenter().x + Math.cos(randDeg) * 70,
          y: getActualCenter().y + Math.sin(randDeg) * 70,
        },
      },
      {
        name: "slime",
        props: {
          x: getActualCenter().x + Math.cos(randDeg) * -70,
          y: getActualCenter().y + Math.sin(randDeg) * -70,
        },
      },
    ],
  },
  {
    enemies: [
      {
        name: "slime",
        props: {
          x: getActualCenter().x + Math.cos(randDeg) * 70,
          y: getActualCenter().y + Math.sin(randDeg) * -70,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: roomHeight / 2 - 30,
          xspd: 1,
          yspd: 1,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: 60,
          xspd: -1,
          yspd: -1,
        },
      },
    ],
  },
  {
    hazards: putItems({
      xAmount: 8,
      yAmount: 8,
      shouldPlace: (i, j, xAmnt, yAmnt) => {
        return i === 1 || j === 1 || i === xAmnt || j === yAmnt;
      },
      itemHeight: 16,
      itemWidth: 16,
      itemName: "spike",
    }),
    enemies: [
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: 50,
          xvary: 1,
          yvary: 2,
          xspd: 1,
          yspd: 1,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: roomHeight - 150,
          xvary: 2,
          yvary: 2,
          xspd: -1,
          yspd: -1,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: 70,
          xvary: 3,
          yvary: 1,
          xspd: -1,
          yspd: -1,
        },
      },
    ],
  },
  {
    hazards: putItems({
      xAmount: 7,
      yAmount: 7,
      shouldPlace: (i, j, xAmnt, yAmnt) => {
        return (
          (i === 1 && j === 1) ||
          (i === 1 && j === yAmnt) ||
          (i === xAmnt && j === 1) ||
          (i === xAmnt && j === yAmnt)
        );
      },
      itemHeight: 17,
      itemWidth: 17,
      itemName: "block",
    }),
    enemies: [
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: 50,
          xvary: 1,
          yvary: 2,
          xspd: 1,
          yspd: 1,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: roomHeight - 150,
          xvary: 2,
          yvary: 2,
          xspd: -1,
          yspd: -1,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: 70,
          xvary: 3,
          yvary: 1,
          xspd: -1,
          yspd: -1,
        },
      },
      {
        name: "slime",
        props: {
          x:
            getActualCenter().x +
            lengthdir_x(
              getRandomArbitrary(26, 100),
              getRandomArbitrary(0, 360)
            ),
          y:
            getActualCenter().y +
            lengthdir_y(
              getRandomArbitrary(26, 100),
              getRandomArbitrary(0, 360)
            ),
        },
      },
      {
        name: "slime",
        props: {
          x:
            getActualCenter().x +
            lengthdir_x(
              getRandomArbitrary(26, 100),
              getRandomArbitrary(0, 360)
            ),
          y:
            getActualCenter().y +
            lengthdir_y(
              getRandomArbitrary(26, 100),
              getRandomArbitrary(0, 360)
            ),
        },
      },
      {
        name: "slime",
        props: {
          x:
            getActualCenter().x +
            lengthdir_x(
              getRandomArbitrary(26, 100),
              getRandomArbitrary(0, 360)
            ),
          y:
            getActualCenter().y +
            lengthdir_y(
              getRandomArbitrary(26, 100),
              getRandomArbitrary(0, 360)
            ),
        },
      },
    ],
  },
  {
    hazards: [
      ...putItems({
        xAmount: 7,
        yAmount: 7,
        shouldPlace: (i, j, xAmnt, yAmnt) => {
          return (
            (i === 1 && j === 1) ||
            (i === 1 && j === yAmnt) ||
            (i === xAmnt && j === 1) ||
            (i === xAmnt && j === yAmnt)
          );
        },
        itemHeight: 17,
        itemWidth: 17,
        itemName: "block",
      }),
      ...putItems({
        xAmount: 3,
        yAmount: 3,
        x: getActualCenter().x - (16 * 6) / 2 - 3,
        y: getActualCenter().y - (16 * 6) / 2 - 3,
        shouldPlace: (i, j, xAmnt, yAmnt) => {
          return i === 1 || j === 1 || i === xAmnt || j === yAmnt;
        },
        itemHeight: 16,
        itemWidth: 16,
        itemName: "spike",
      }),
      ...putItems({
        xAmount: 3,
        yAmount: 3,
        x: getActualCenter().x + (16 * 6) / 2 + 3,
        y: getActualCenter().y - (16 * 6) / 2 - 3,
        shouldPlace: (i, j, xAmnt, yAmnt) => {
          return i === 1 || j === 1 || i === xAmnt || j === yAmnt;
        },
        itemHeight: 16,
        itemWidth: 16,
        itemName: "spike",
      }),
      ...putItems({
        xAmount: 3,
        yAmount: 3,
        x: getActualCenter().x - (16 * 6) / 2 - 3,
        y: getActualCenter().y + (16 * 6) / 2 + 3,
        shouldPlace: (i, j, xAmnt, yAmnt) => {
          return i === 1 || j === 1 || i === xAmnt || j === yAmnt;
        },
        itemHeight: 16,
        itemWidth: 16,
        itemName: "spike",
      }),
      ...putItems({
        xAmount: 3,
        yAmount: 3,
        x: getActualCenter().x + (16 * 6) / 2 + 3,
        y: getActualCenter().y + (16 * 6) / 2 + 3,
        shouldPlace: (i, j, xAmnt, yAmnt) => {
          return i === 1 || j === 1 || i === xAmnt || j === yAmnt;
        },
        itemHeight: 16,
        itemWidth: 16,
        itemName: "spike",
      }),
    ],
    enemies: [
      {
        name: "slime",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y - 80,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y + 100,
          r: roomWidth / 2 - 40,
          yvary: 10,
          yspd: 0,
          xspd: 1.06,
        },
      },
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x - 100,
          y: getActualCenter().y,
        },
      },
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x + 100,
          y: getActualCenter().y,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: roomWidth / 2 - 20,
          yvary: 2,
          xvary: 4,
          yspd: 1.06,
          xspd: 1,
        },
      },
    ],
  },
  {
    hazards: putItems({
      xAmount: 6,
      yAmount: 6,
      shouldPlace: (i, j, xAmnt, yAmnt) => {
        return (
          (i === 1 && j === 1) ||
          (i === 1 && j === yAmnt) ||
          (i === xAmnt && j === 1) ||
          (i === xAmnt && j === yAmnt)
        );
      },
      itemHeight: 17,
      itemWidth: 17,
      itemName: "block",
    }),
    enemies: [
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y + 100,
          r: roomWidth / 2 - 40,
          yvary: 10,
          yspd: 0,
          xspd: 2.5,
          special: true,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y - 100,
          r: roomWidth / 2 - 40,
          yvary: 10,
          yspd: 0,
          xspd: -1.5,
          special: true,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x - roomWidth / 2 - 65,
          y: getActualCenter().y,
          r: roomWidth / 2 - 40,
          xvary: 10,
          yspd: 1.5,
          xspd: 0,
          special: true,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x + 18,
          y: getActualCenter().y,
          r: roomWidth / 2 - 40,
          xvary: 10,
          yspd: -1.5,
          xspd: 0,
          special: true,
        },
      },
    ],
  },
  {
    hazards: [
      ...putItems({
        y: getActualCenter().y - 75,
        xAmount: 2,
        yAmount: 2,
        shouldPlace: (i, j, xAmnt, yAmnt) => {
          return (i + j) % 2;
        },
        itemHeight: 17,
        itemWidth: 17,
        itemName: "block",
      }),
      ...putItems({
        y: getActualCenter().y + 75,
        xAmount: 2,
        yAmount: 2,
        shouldPlace: (i, j, xAmnt, yAmnt) => {
          return (i + j - 1) % 2;
        },
        itemHeight: 17,
        itemWidth: 17,
        itemName: "block",
      }),
      ...putItems({
        x: getActualCenter().x - 75,
        xAmount: 2,
        yAmount: 2,
        shouldPlace: (i, j, xAmnt, yAmnt) => {
          return (i + j) % 2;
        },
        itemHeight: 17,
        itemWidth: 17,
        itemName: "block",
      }),
      ...putItems({
        x: getActualCenter().x + 75,
        xAmount: 2,
        yAmount: 2,
        shouldPlace: (i, j, xAmnt, yAmnt) => {
          return (i + j) % 2;
        },
        itemHeight: 17,
        itemWidth: 17,
        itemName: "block",
      }),
    ],
    enemies: [
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x + 100,
          y: getActualCenter().y,
        },
      },
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x - 100,
          y: getActualCenter().y,
        },
      },
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y + 100,
        },
      },
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y - 100,
        },
      },
    ],
  },
  {
    hazards: putItems({
      xAmount: 13,
      yAmount: 13,
      shouldPlace: (i, j, xAmnt, yAmnt) => {
        return !((i + j - 1) % 4);
      },
      itemHeight: 16,
      itemWidth: 16,
      itemName: "spike",
    }),
    enemies: [
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x + 100,
          y: getActualCenter().y,
        },
      },
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x - 100,
          y: getActualCenter().y,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: roomWidth / 2 - 40,
          xvary: 1,
          yvary: 5,
          yspd: 1,
          xspd: 1,
        },
      },
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y + 100,
        },
      },
    ],
  },
  {
    hazards: putItems({
      xAmount: 1,
      yAmount: 1,
      shouldPlace: (i, j, xAmnt, yAmnt) => {
        return true;
      },
      itemHeight: 17,
      itemWidth: 17,
      itemName: "block",
    }),
    enemies: [
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x + 100,
          y: getActualCenter().y,
        },
      },
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x - 100,
          y: getActualCenter().y,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: roomWidth / 2 - 40,
          xvary: 1,
          yvary: 5,
          yspd: 1,
          xspd: 1,
          special: true,
        },
      },
      {
        name: "skeleHead",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y,
          r: roomWidth / 2 - 40,
          xvary: 5,
          yvary: 1,
          yspd: 1,
          xspd: 1,
          special: true,
        },
      },
      {
        name: "slime",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y - 60,
        },
      },
      {
        name: "ghostDude",
        props: {
          x: getActualCenter().x,
          y: getActualCenter().y + 100,
        },
      },
    ],
  },
];

export const addGameManager = () => {
  let waveBanner = add([
    rect(roomWidth, uiOffset / 2 + 10),
    layer("uiOverlay"),
    z(100000),
    color(0, 0, 0),
    origin("center"),
    pos(roomWidth / 2 + uiOffset / 2, -14),
    {
      wave: 0,
      stayTimer: 200,
      targetY: uiOffset / 2 - 4,
      toggleOpen: true,
      closeTarget: -14,
      openTarget: uiOffset / 2 - 4,
      text: "",
      juicy: false,
    },
    {
      update: (e) => {
        e.pos.y = lerp(e.pos.y, e.targetY, 0.1);
        if (e.toggleOpen) {
          e.stayTimer--;
          if (e.stayTimer <= 0) {
            e.targetY = waveBanner.closeTarget;
            e.stayTimer = 200;
            e.toggleOpen = false;
            e.juicy = false;
          }
        }
      },
      open: () => {
        waveBanner.toggleOpen = true;
        waveBanner.targetY = waveBanner.openTarget;
        waveBanner.stayTimer = 200;
      },
      close: () => {
        waveBanner.toggleOpen = false;
        waveBanner.targetY = waveBanner.closeTarget;
        waveBanner.juicy = false;
        waveBanner.stayTimer = 200;
      },
    },
    {
      draw: () => {
        let col = rgb(213, 60, 106);
        if ((time() * 45) % 10 < 5) {
          col = rgb(213, 60, 106);
        } else {
          col = rgb(178, 217, 66);
        }
        if (waveBanner.juicy) {
          for (let i = 0; i < roomWidth + uiOffset; i += 6) {
            pushTransform();
            pushTranslate(
              waveBanner.pos.x - roomWidth / 2 - uiOffset / 2 + i,
              waveBanner.pos.y + wave(-5, 5, time() * 2 + i)
            );
            drawCircle({
              radius: 0.6,
              origin: "center",
              opacity: 0.4,
              color: col,
            });
            popTransform();
          }
        }
        pushTransform();
        pushTranslate(waveBanner.pos.x, waveBanner.pos.y);
        drawText({
          text: waveBanner.text,
          font: "sink",
          origin: "center",
          color: waveBanner.juicy ? col : rgb(255, 255, 255),
          transform: (i) => {
            if (waveBanner.juicy) {
              return {
                pos: vec2(0, wave(-2, 2, time() * 4 + i / 4)),
              };
            }
          },
        });
        popTransform();
      },
    },
  ]);

  let player = null;
  let head = null;
  let hm = null;
  let limits = [900, 1000, 1200, 1500, 1900, 2400, 2800, 3200];
  let boss = null;
  let dm = null;

  let gm = add([
    "gm",
    {
      score: Number(getData("SCORE")) || 0,
      currWave: Number(getData("WAVE")) || 0,
      currWaveSpawned: false,
      currEntities: [],
      spawnGap: 120,
      triggerPlay: false,
      triggerNextWave: false,
      nextWaveGap: 300,
      combo: 1,
      maxCombo: 1,
      triggerCombo: false,
      maxCoolDown: 670,
      comboCoolDown: 670,
      playerIsDead: false,
      hitName: "",
      speedUp: false,
      speedUpTimer: 0,
      speedUpLimit: 1200,
      fxBg: null,
      putHeartTimer: 0,
      isBoss: false,
      bossSpawned: false,
      bossSpawnTimer: 0,
      partsJoined: 0,
      parts: [],
      partJoinTimer: 1,
      boss: null,
      bossHealth: bossHealth,
      bossDead: false,
      bossMessageTimer: 0,
      letters: [],
      triggerLetterUpdate: false,
      letterToUpdate: "",
      egoSaidSorry: false,
      gameEndedTimer: 0,
      gameOver: false,
    },
    {
      update: (e) => {
        if (!player) {
          player = getPlayer();
        }

        if (!head) {
          head = getHead();
        }

        if (!dm) {
          dm = getDialogManager();
        }

        if (e.triggerCombo && player.playing) {
          e.comboCoolDown -= clamp(e.combo, 1, 3);
          if (e.comboCoolDown <= 0) {
            e.triggerCombo = false;
            e.combo = 1;
            gm.trigger("updateScoreIndicator");
            e.comboCoolDown = e.maxCoolDown;
          }
        }

        if (player.playing) {
          if (!e.speedUp && e.currWave !== 9) {
            e.speedUpTimer++;
            if (e.speedUpTimer >= e.speedUpLimit) {
              e.speedUp = true;
              e.speedUpTimer = 0;
              if (e.fxBg) {
                e.fxBg.triggerfx = true;
                gm.hitName = "SPEED UP!";
              }
            }
          }
        }

        e.maxCombo = Math.max(e.maxCombo, e.combo);

        if (!e.currWaveSpawned) {
          if (e.currWave !== 9) {
            dm?.say({
              who: "witch",
              ...getThingToSayOnStart(e.currWave),
            });
          }
          let thingsToSpawn = waves[e.currWave];
          let enemies = thingsToSpawn?.enemies;
          let hazards = thingsToSpawn?.hazards;
          enemies?.forEach((enemy) => {
            switch (enemy?.name) {
              case "slime": {
                e.currEntities.push(addSlime(enemy.props));
                break;
              }
              case "skeleHead": {
                e.currEntities.push(addSkeleHead(enemy.props));
                break;
              }
              case "ghostDude": {
                e.currEntities.push(addGhostDude(enemy.props));
                break;
              }
            }
          });

          hazards?.forEach((hazard) => {
            switch (hazard?.name) {
              case "spike": {
                e.currEntities.push(addSpike(hazard.props));
                break;
              }
              case "block": {
                e.currEntities.push(addBlock(hazard.props));
                break;
              }
            }
          });

          // if (e.currWave === 9) {
          //   let boss = addSnakeBoss({
          //     x: getActualCenter().x,
          //     y: getActualCenter().y - 50,
          //   });
          //   boss[0].playing = false;
          // }

          e.isBoss = e.currWave === 9;
          e.currWaveSpawned = true;
          e.triggerPlay = true;
        }

        if (!hm) {
          hm = getHealthManager();
        }

        let noOfEnemies = get("enemy")?.length || 0;
        if (hm) {
          e.putHeartTimer += 1 * player.playing;
          try {
            if (e.putHeartTimer >= limits[clamp(hm.health, 0, hm.maxHealth)]) {
              e.putHeartTimer = 0;
              if (noOfEnemies > 1 || e.currWave === 9) {
                addHealthPickup({
                  x: rand(uiOffset + 14, roomWidth - uiOffset / 4),
                  y: rand(uiOffset + 20, roomHeight - uiOffset / 4),
                });
              }
            }
          } catch (err) {
            // just to be safe
          }
        }

        if (e.bossDead) {
          every("enemy", (enemy) => {
            if (typeof enemy.parent.die === "function") {
              enemy.parent.hurt({ dieWithPassion: true });
              enemy.parent.die();
            }
          });

          e.bossMessageTimer++;
          if (e.bossMessageTimer === 10) {
            dm?.say({
              who: "wiggle",
              what: "*MILDLY SAD*",
              slow: false,
            });
          }

          if (
            e.letters?.length === 5 &&
            !e.egoSaidSorry &&
            e.bossMessageTimer > 400
          ) {
            dm?.say({
              who: "ego",
              what: "s..ss..sss..... SORRY",
              slow: true,
            });
            e.egoSaidSorry = true;
          }
        }

        if (e.egoSaidSorry) {
          e.gameEndedTimer++;
          if (e.gameEndedTimer === 300) {
            dm?.say({
              who: "witch",
              what: "that's what i wanted! an actual SORRY, you are forgiven",
              slow: false,
            });
          }

          if (e.gameEndedTimer === 700) {
            e.trigger("gameEndScreen");
            e.gameOver = true;
          }
        }

        if (noOfEnemies <= 0 && e.currWave < waves.length) {
          e.speedUp = false;
          e.speedUpTimer = 0;
          e.comboCoolDown = e.maxCoolDown;
          e.nextWaveGap--;
          if (e.nextWaveGap === 299) {
            if (e.currWave !== 9) {
              dm?.say({
                who: "witch",
                ...getThingToSayOnEnd(e.currWave),
              });
            }
          }
          // show wave complete
          if (e.nextWaveGap <= 175) {
            waveBanner.text = "WAVE COMPLETE";
            waveBanner.juicy = true;
            waveBanner.open();
            every("hazard", (h) => {
              for (let i = 0; i < 2; i++) {
                addDust({
                  x: h.pos.x + rand(-7, 7),
                  y: h.pos.y + rand(-7, 7),
                  isSpawn: true,
                });
              }
              destroy(h);
            });
          }
          // move player and head to center
          if (e.nextWaveGap <= 100 && e.nextWaveGap >= 0) {
            player.playing = false;
            head.playing = false;
            head.spd = 0;
            head.vspd = 0;
            head.hspd = 0;
            player.pos.x = lerp(player?.pos.x, getActualCenter().x, 0.05);
            player.pos.y = lerp(player?.pos.y, getActualCenter().y + 13, 0.05);

            head.pos.x = lerp(head?.pos.x, getActualCenter().x, 0.05);
            head.pos.y = lerp(head?.pos.y, getActualCenter().y, 0.05);
            head.rot = 0;

            if (Math.random() < 0.2) {
              addDust({
                x: player.pos.x + rand(-6, 6),
                y: player.pos.y + rand(-6, 6),
                isSpawn: true,
              });
            }

            if (Math.random() < 0.2) {
              addDust({
                x: head.pos.x + rand(-10, 10),
                y: head.pos.y + rand(-10, 10),
                isSpawn: true,
              });
            }
          }
          // show next wave
          if (e.nextWaveGap <= -120) {
            waveBanner.close();
            e.currWave++;
            setData("WAVE", e.currWave);
            setData("SCORE", e.score);
            waveBanner.text = "WAVE " + e.currWave;
            waveBanner.open();
            e.nextWaveGap = 300;
            e.triggerNextWave = true;
            e.currWaveSpawned = false;
            e.currEntities = [];
          }
        }

        if (e.triggerPlay) {
          if (e.isBoss) {
            if (!e.bossSpawed) {
              e.bossSpawnTimer++;
              if (e.bossSpawnTimer === 50) {
                dm?.say({
                  who: "witch",
                  ...getThingToSayOnStart(e.currWave),
                });
                e.parts.push(
                  addSnakeBossBodyPart({
                    x: getActualCenter().x - 100,
                    y: getActualCenter().y - 90,
                  })
                );
                e.parts.push(
                  addSnakeBossBodyPart({
                    x: getActualCenter().x,
                    y: getActualCenter().y - 90,
                  })
                );
                e.parts.push(
                  addSnakeBossBodyPart({
                    x: getActualCenter().x + 100,
                    y: getActualCenter().y - 90,
                  })
                );
                e.parts.push(
                  addSnakeBossBodyPart({
                    x: getActualCenter().x + 100,
                    y: getActualCenter().y + 100,
                  })
                );
                e.parts.push(
                  addSnakeBossBodyPart({
                    x: getActualCenter().x - 100,
                    y: getActualCenter().y + 100,
                  })
                );
                e.parts.forEach((p) => {
                  p.playing = false;
                });
              }

              if (e.bossSpawnTimer >= 80) {
                if (Math.random() < 0.5 && e.partsJoined > 0) {
                  addDust({
                    x: getActualCenter().x + rand(-10, 10),
                    y: getActualCenter().y - 60 + rand(-10, 10),
                    isSpawn: true,
                  });
                }
                if (Math.random() < 0.4) {
                  addDust({
                    x: e.parts[e.partsJoined].pos.x + rand(-5, 5),
                    y: e.parts[e.partsJoined].pos.y + rand(-5, 5),
                  }).use(color(255, 0, 0));
                }
                e.parts[e.partsJoined].pos.x = lerp(
                  e.parts[e.partsJoined].pos.x,
                  getActualCenter().x,
                  0.1
                );
                e.parts[e.partsJoined].pos.y = lerp(
                  e.parts[e.partsJoined].pos.y,
                  getActualCenter().y - 60,
                  0.08
                );

                e.partJoinTimer++;
                if (
                  e.partJoinTimer > 60 &&
                  e.partsJoined < e.parts.length - 1
                ) {
                  e.partsJoined++;
                  e.partJoinTimer = 1;
                }
              }

              if (e.bossSpawnTimer === 500) {
                dm?.say({
                  who: "witch",
                  what: choose([
                    "his name is WIGGLEBOTTOM JR. be his treat",
                    "play fetch with WIGGLEBOTTOM JR. haha",
                  ]),
                });
                e.bossSpawed = true;
                e.fxBg.triggerfx = true;
                e.parts.forEach((p) => {
                  destroy(p.hitBox);
                  destroy(p);
                });
                addHitLines({
                  x: getActualCenter().x,
                  y: getActualCenter().y - 60,
                });
                addSnakeBoss({
                  x: getActualCenter().x,
                  y: getActualCenter().y - 60,
                });
              }
            }

            if (e.bossSpawed) {
              e.spawnGap--;
              if (e.spawnGap <= 0) {
                e.triggerPlay = false;
                e.spawnGap = 120;
                e.putHeartTimer = 0;
                player.playing = true;
                head.playing = true;
                player.hurt();
                e.currEntities?.forEach((ent) => {
                  ent.playing = true;
                });
              }
            }
          } else {
            e.spawnGap--;
            if (e.spawnGap <= 0) {
              e.triggerPlay = false;
              e.spawnGap = 120;
              e.putHeartTimer = 0;
              player.playing = true;
              head.playing = true;
              player.hurt();
              e.currEntities?.forEach((ent) => {
                ent.playing = true;
              });
            }
          }
        }
      },
    },
    {
      increaseScore: (amnt) => {
        gm.score += amnt;
        gm.trigger("updateScoreIndicator");
      },
    },
    {
      decreaseScore: (amnt) => {
        gm.score -= amnt;
        gm.trigger("updateScoreIndicator");
      },
    },
  ]);

  waveBanner.text = "WAVE " + gm.currWave;

  return gm;
};

export const getGameManager = () => {
  return get("gm")?.[0];
};
