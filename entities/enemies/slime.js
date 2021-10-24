import { getGameManager } from "../../gameManager.js";
import { roomHeight, roomWidth, uiOffset } from "../../utils/constants.js";
import { clamp, lengthdir_x, lengthdir_y, rLerp } from "../../utils/helpers.js";
import { addCorpse } from "../corpse.js";
import { addDust } from "../dust.js";
import { getHead } from "../head.js";
import { addHittable } from "../hittable.js";
import { getPlayer } from "../player.js";
import { addScoreBubble } from "../scoreBubble.js";

export const addSlime = ({ x, y }) => {
  let player = getPlayer();
  let head = getHead();
  let gm = getGameManager();
  let spr = choose(["sprSlime1", "sprSlime2"]);
  let slime = add([
    sprite(spr, { anim: "slime" }),
    pos(x, y),
    { hitBox: null },
    origin("center"),
    {
      dir: 0,
      hspd: 0,
      vspd: 0,
      spd: 0.3,
      fric: 0.1,
      pushBack: false,
      pushBackDir: 0,
      pushBackTimer: 40,
      xscale: 1,
      yscale: 1,
      health: 2,
      isHurt: false,
      hurtFrame: 10,
      dieWithPassion: false,
      baseScore: 15,
      playing: false,
      hitByProjectile: false,
    },
    "slime",
    {
      add: () => {
        for (let i = 0; i < 6; i++) {
          addDust({
            x: x + rand(-10, 10),
            y: y + rand(-10, 10),
            isSpawn: true,
            dir: -90,
            spd: 15,
          });
        }
      },
      update: (e) => {
        e.spd -= e.fric;
        e.spd = clamp(e.spd, 0.3, 200);
        let dir = e.pushBack ? e.pushBackDir : player.pos.angle(e.pos);
        let dist = player.pos.dist(e.pos);
        e.dir = rad2deg(
          rLerp(deg2rad(e.dir), deg2rad(dir), dist < 20 ? 0.01 : 0.6)
        );
        e.hspd = lengthdir_x(e.spd, e.dir);
        e.vspd = lengthdir_y(e.spd, e.dir);
        e.pos.x += e.hspd * e.playing * (gm.speedUp ? 1.4 : 1);
        e.pos.y += e.vspd * e.playing * (gm.speedUp ? 1.4 : 1);

        if (e.pushBack) {
          e.pushBackTimer -= 1;
        }

        if (e.pushBackTimer <= 0) {
          if (e.spd <= 0.4) {
            e.pushBack = false;
            e.pushBackTimer = 40;
          }
        }

        if (e.hspd < 0) {
          e.flipX(true);
        } else {
          e.flipX(false);
        }

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

        if (e.health <= 0) {
          e.die(e?.dieWithPassion);
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
          e.width / 2 + uiOffset / 2 + 15,
          roomHeight - e.height / 2 + uiOffset / 4 + 4
        );
      },
      hurt: (die) => {
        slime.isHurt = true;
        slime.dieWithPassion = die?.dieWithPassion;
        slime.hitByProjectile = die?.hitByProjectile;
      },
      die: () => {
        addCorpse({
          x: slime.pos.x,
          y: slime.pos.y,
          dir: slime.pushBackDir,
          spd: head.spd * 4,
          poofSize: vec2(slime.width, slime.height),
          spr,
          dieWithPassion: slime.dieWithPassion,
        });
        let score = slime.baseScore;
        if (slime.dieWithPassion) {
          score += 5;
          gm.hitName = "SUPER SHOT +5";
        }
        if (head.hitWall) {
          score += 10;
          gm.hitName = "BACK SHOT +10";
        }
        if (slime.dieWithPassion && head.hitWall) {
          score += 15;
          gm.hitName = "SUPER BACK SHOT +15";
        }
        if (slime.hitByProjectile) {
          score += 20;
          gm.hitName = "DEFLECTED SHOT +15";
        }
        score = score * gm.combo + (gm.speedUp ? 10 : 0);
        gm.combo++;
        gm.comboCoolDown = gm.maxCoolDown;
        gm.triggerCombo = true;
        addScoreBubble({
          x: head.pos.x,
          y: head.pos.y,
          amount: score,
        });
        gm.increaseScore(score);
        if (slime.hitBox) {
          destroy(slime.hitBox);
        }
        destroy(slime);
      },
    },
  ]);

  let hittable = addHittable({
    parent: slime,
    width: 10,
    height: 5,
    offset: vec2(0, 2),
    damagesPlayer: true,
  });
  slime.hitBox = hittable;

  return slime;
};
