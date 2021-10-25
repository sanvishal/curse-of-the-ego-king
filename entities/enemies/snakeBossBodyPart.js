import { getGameManager } from "../../gameManager.js";
import {
  bossHealth,
  roomHeight,
  roomWidth,
  uiOffset,
} from "../../utils/constants.js";
import {
  clamp,
  cos,
  lengthdir_x,
  lengthdir_y,
  pointDirection,
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
import { getHealthManager } from "../ui/healthManager.js";

export const addSnakeBossBodyPart = ({
  x,
  y,
  isHead = false,
  tag,
  name,
  special = false,
}) => {
  let head = getHead();
  let player = getPlayer();
  let gm = getGameManager();
  let hm = getHealthManager();

  let bodyPart = add([
    sprite(special ? "sprSplSkeleHead" : "sprSkeleHead"),
    layer("game"),
    pos(x, y),
    { hitBox: null },
    area(),
    "boss",
    `${name}`,
    tag,
    origin("center"),
    {
      dir: 100,
      hspd: 0,
      vspd: 0,
      spd: 18,
      fric: 0.1,
      pushBack: false,
      pushBackDir: 0,
      pushBackTimer: 40,
      xscale: 1,
      yscale: 1,
      targetTimer: 400,
      isHurt: false,
      hurtFrame: 10,
      shootFireballTimer: 300,
      maxShootTimer: 300,
      dieWithPassion: false,
      baseScore: 25,
      specialBaseScore: 35,
      playing: true,
      special,
      normalFireRate: 1,
      specialFireRate: 0.5,
      hitByProjectile: false,
      isHead,
      parent: null,
      minClampDist: 10,
      turnDir: 0,
      turnTimer: 1,
      turnTimerTarget: 700,
    },
    {
      add: () => {
        for (let i = 0; i < 6; i++) {
          addDust({
            x: x + rand(-5, 5),
            y: y + rand(-5, 5),
            isSpawn: true,
            dir: -90,
            spd: 12,
          });
        }
      },
      update: (e) => {
        if (e.isHead) {
          e.hspd += lengthdir_x(e.spd, e.dir) * e.playing;
          e.vspd += lengthdir_y(e.spd, e.dir) * e.playing;

          e.hspd = lerp(e.hspd, 0, 0.2);
          e.vspd = lerp(e.vspd, 0, 0.2);

          e.move(e.hspd, e.vspd);
          e.dir = vec2(e.pos.x + e.hspd, e.pos.y + e.vspd).angle(e.pos);

          e.turnTimer++;
          if (e.turnTimer % e.turnTimerTarget === 0) {
            e.turnTimer = 1;
            e.turnTimerTarget = Math.floor(rand(600, 900));
            e.hspd = choose([-e.hspd]);
            e.vspd = choose([-e.vspd]);
          }
        } else {
          if (e.parent) {
            e.turnDir = vec2(e.pos).angle(e.parent.pos);
            let dist = vec2(e.parent.pos).dist(e.pos);
            e.pos.x =
              e.parent.pos.x +
              lengthdir_x(clamp(dist, 0, e.minClampDist), e.turnDir);
            e.pos.y =
              e.parent.pos.y +
              lengthdir_y(clamp(dist, 0, e.minClampDist), e.turnDir);
          }
        }

        // e.dir = rad2deg(rLerp(deg2rad(e.dir), deg2rad(dir), 0.1));
        // if (Math.random() < mapc(Math.max(xspd, yspd), 4, 10, 0.1, 0.5)) {
        //   addDust({ x: e.pos.x + rand(-3, 3), y: e.pos.y + rand(-3, 3) }).use(
        //     e.special ? color(0, 255, 0) : color(255, 0, 0)
        //   );
        // }
        if (e.isHead) {
          e.use(rotate(e.playing * (e.dir + 90) + wave(-15, 15, time() * 4)));
        } else {
          e.use(
            rotate(e.playing * (e.turnDir - 90) + wave(-15, 15, time() * 4))
          );
        }

        if (e.isHurt) {
          if (e.hurtFrame === 10) {
            if (e.isHead) {
              gm.bossHealth -= 1;
            }
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
          e.shootFireballTimer = e.maxShootTimer;
          e.xscale = 1.3;
          e.yscale = 1.3;
          addFireball({
            x: e.pos.x,
            y: e.pos.y,
            dir: vec2(
              player.pos.x + rand(-20, 20),
              player.pos.y + rand(-20, 20)
            ).angle(e.pos),
            spd: 25,
            special: e.special,
          });
        }

        if (gm.bossHealth <= 0) {
          gm.bossDead = true;
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
        bodyPart.isHurt = true;
        bodyPart.dieWithPassion = die?.dieWithPassion;
        bodyPart.hitByProjectile = die?.hitByProjectile;
      },
      die: () => {
        addCorpse({
          x: bodyPart.pos.x,
          y: bodyPart.pos.y,
          dir: bodyPart.pushBackDir,
          spd: head.spd * 4,
          poofSize: vec2(bodyPart.width, bodyPart.height),
          spr: "sprSkeleHead",
          dieWithPassion: bodyPart.dieWithPassion,
        });
        gm.combo++;
        gm.comboCoolDown = gm.maxCoolDown;
        gm.triggerCombo = true;
        let score = bodyPart.isHead ? hm.health * 500 * gm.combo : 0;
        addScoreBubble({
          x: head.pos.x,
          y: head.pos.y,
          amount: bodyPart.isHead ? score : "",
        });
        gm.increaseScore(score);
        if (bodyPart.hitBox) {
          destroy(bodyPart.hitBox);
        }
        destroy(bodyPart);
      },
    },
  ]);

  let hittable = addHittable({
    parent: bodyPart,
    width: 6,
    height: 6,
    damagesPlayer: true,
  });
  bodyPart.hitBox = hittable;

  return bodyPart;
};
