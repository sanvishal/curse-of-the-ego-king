import { getGameManager } from "../../gameManager.js";
import { roomHeight, roomWidth, uiOffset } from "../../utils/constants.js";
import {
  clamp,
  cos,
  getActualCenter,
  lengthdir_x,
  lengthdir_y,
  rLerp,
  sin,
} from "../../utils/helpers.js";
import { addCorpse } from "../corpse.js";
import { addDust } from "../dust.js";
import { addFireball } from "../fireball.js";
import { getHead } from "../head.js";
import { addHittable } from "../hittable.js";
import { getPlayer } from "../player.js";
import { addScoreBubble } from "../scoreBubble.js";

export const addSkeleHead = ({
  x,
  y,
  r,
  yspd = 1,
  xvary = 2,
  yvary = 2,
  xspd = 1,
}) => {
  let head = getHead();
  let player = getPlayer();
  let gm = getGameManager();

  let skeleHead = add([
    sprite("sprSkeleHead"),
    layer("game"),
    pos(x, y),
    { hitBox: null },
    area(),
    "skeleHead",
    origin("center"),
    {
      dir: 0,
      targetPos: vec2(0, 0),
      hspd: 0,
      vspd: 0,
      fric: 0.1,
      pushBack: false,
      pushBackDir: 0,
      pushBackTimer: 40,
      xscale: 1,
      yscale: 1,
      targetTimer: 400,
      health: 3,
      isHurt: false,
      hurtFrame: 10,
      shootFireballTimer: 300,
      maxShootTimer: 300,
      dieWithPassion: false,
      baseScore: 25,
      playing: false,
    },
    {
      add: () => {
        for (let i = 0; i < 6; i++) {
          addDust({
            x: x + cos(time() / xvary) * r + rand(-5, 5),
            y: y + sin(time() / yvary) * r + rand(-5, 5),
            isSpawn: true,
            dir: -90,
            spd: 12,
          });
        }
      },
      update: (e) => {
        let dir = e.pushBack ? e.pushBackDir : e.targetPos.angle(e.pos);
        e.dir = rad2deg(rLerp(deg2rad(e.dir), deg2rad(dir), 0.03));
        e.pos.x = x + cos((time() / xvary) * xspd) * r;
        e.pos.y = y + sin((time() / yvary) * yspd) * r;

        if (Math.random() < mapc(Math.max(xspd, yspd), 4, 10, 0.1, 0.5)) {
          addDust({ x: e.pos.x + rand(-3, 3), y: e.pos.y + rand(-3, 3) }).use(
            color(255, 0, 0)
          );
        }
        e.use(rotate(wave(-15, 15, time() * 4)));

        if (e.isHurt) {
          if (e.hurtFrame === 10) {
            e.health -= 1;
          }
          e.hurtFrame -= 1;
          e.use(color(200, 0, 0));
          if (e.hurtFrame <= 0) {
            e.hurtFrame = 10;
            e.isHurt = false;
            e.unuse("color");
          }
        }

        e.shootFireballTimer -= 1 * e.playing;
        if (e.shootFireballTimer <= 0) {
          if (e.shootFireballTimer === 0) {
            e.xscale = 1.3;
            e.yscale = 1.3;
            addFireball({
              x: e.pos.x,
              y: e.pos.y,
              dir: vec2(
                player.pos.x + rand(-20, 20),
                player.pos.y + rand(-20, 20)
              ).angle(e.pos),
              spd: 20,
            });
          }
          e.shootFireballTimer = e.maxShootTimer;
        }

        if (e.health <= 0) {
          e.die(e?.dieWithPassion);
        }

        if (e.pushBack) {
          e.pushBackTimer -= 1;
        }

        if (e.pushBackTimer <= 0) {
          if (e.spd <= 0.4) {
            e.pushBack = false;
            e.pushBackTimer = 40;
          }
        }

        e.xscale = lerp(e.xscale, 1, 0.1);
        e.yscale = lerp(e.yscale, 1, 0.1);
        e.use(scale(vec2(e.xscale, e.yscale)));

        e.pos.x = clamp(
          e.pos.x,
          uiOffset / 2 + e.width / 2 + 9,
          roomWidth - e.width / 2 + uiOffset / 2 - 9
        );
        e.pos.y = clamp(
          e.pos.y,
          e.height / 2 + uiOffset / 2 + 22,
          roomHeight - e.height / 2 + uiOffset / 4 + 6
        );
      },
      hurt: (die) => {
        skeleHead.isHurt = true;
        skeleHead.dieWithPassion = die?.dieWithPassion;
      },
      die: () => {
        addCorpse({
          x: skeleHead.pos.x,
          y: skeleHead.pos.y,
          dir: skeleHead.pushBackDir,
          spd: head.spd * 4,
          poofSize: vec2(skeleHead.width, skeleHead.height),
          spr: "sprSkeleHead",
          dieWithPassion: skeleHead.dieWithPassion,
        });
        let score = skeleHead.baseScore;
        if (head.hitWall) {
          score += 10;
        }
        if (skeleHead.dieWithPassion) {
          score += 5;
        }
        if (skeleHead.dieWithPassion && head.hitWall) {
          score += 15;
        }
        score = score * gm.combo;
        gm.combo++;
        gm.comboCoolDown = gm.maxCoolDown;
        gm.triggerCombo = true;
        addScoreBubble({
          x: head.pos.x,
          y: head.pos.y,
          amount: score,
        });
        gm.increaseScore(score);
        if (skeleHead.hitBox) {
          destroy(skeleHead.hitBox);
        }
        destroy(skeleHead);
      },
    },
  ]);

  console.log(skeleHead);

  let hittable = addHittable({
    parent: skeleHead,
    width: 6,
    height: 6,
    damagesPlayer: true,
  });
  skeleHead.hitBox = hittable;

  return skeleHead;
};
