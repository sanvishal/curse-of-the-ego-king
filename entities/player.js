import { getGameManager } from "../gameManager.js";
import {
  roomWidth,
  wallHeight,
  wallWidth,
  roomHeight,
  uiOffset,
  maxHealth,
} from "../utils/constants.js";
import {
  approach,
  clamp,
  floor,
  getActualCenter,
  lengthdir_x,
  lengthdir_y,
  minkDiff,
} from "../utils/helpers.js";
import { addDust } from "./dust.js";
import { getHead } from "./head.js";
import { getHealthManager } from "./ui/healthManager.js";

export const addPlayer = () => {
  let head = getHead();
  let hm = getHealthManager();

  let ring = add([
    sprite("sprRing", { anim: "loop" }),
    origin("center"),
    layer("game"),
    pos(center()),
    opacity(0),
    { xscale: 1, yscale: 1 },
    {
      update: (e) => {
        e.xscale = lerp(e.xscale, 1, 0.02);
        e.yscale = lerp(e.yscale, 1, 0.1);
        e.use(scale(vec2(e.xscale, e.yscale)));

        if (
          (e.xscale > 1 && e.xscale - 1 >= 0.1) ||
          (e.yscale > 1 && e.yscale - 1 >= 0.1)
        ) {
          e.use(color(200, 0, 5));
        } else {
          e.unuse("color");
        }
      },
    },
  ]);

  let player = add([
    // rect(16, 16),
    sprite("sprEgoKing", { anim: "idle" }),
    pos({
      x: getActualCenter().x,
      y: getActualCenter().y + 13,
    }),
    "player",
    layer("game"),
    area({ width: 16 - 8, height: 4, offset: vec2(0, 6) }),
    origin("center"),
    // color(255, 0, 0),
    {
      hspd: 0,
      vspd: 0,
      spd: 1,
      playerDeltaX: [0, 0],
      playerDeltaY: [0, 0],
      isHurt: false,
      invincibleTimer: 0,
      invincibleTime: 160,
      swaySpeed: 0.07,
      swayAmount: -10,
      t: 0.5,
      ang: 0,
      walkTimer: 0,
      activateRing: false,
      awayTimer: 0,
      playing: false,
      isDead: false,
      damagePlayerTrigger: false,
      damagePlayerTimer: 0,
    },
    {
      update: (e) => {
        let right = keyIsDown("right");
        let left = -keyIsDown("left");
        let up = -keyIsDown("up");
        let down = keyIsDown("down");

        let horizontal = right + left;
        let vertical = up + down;

        // lean the sprite
        if (horizontal || vertical) {
          if ((left && (up || down)) || left) {
            e.t += -1 * e.swaySpeed;
          } else if ((right && (up || down)) || right) {
            e.t += e.swaySpeed;
          }
        } else {
          e.t = approach(e.t, 0.5, e.swaySpeed);
        }

        e.t = clamp(e.t, 0, 1);
        e.ang = lerp(e.swayAmount, -e.swayAmount, e.t);
        e.use(rotate(e.ang));

        // prevent moving in diagonals with extra speed
        let diag = 1;
        if (horizontal !== 0 && vertical !== 0) {
          diag = 0.707;
        } else {
          diag = 1;
        }

        // push out the player out of head just at the bottom
        let myArea = e.worldArea();
        let headArea = head.worldArea();

        headArea.p1.y += 15;
        headArea.p1.x += 3;
        headArea.p2.x -= 3;

        const mk = minkDiff(myArea, headArea);

        if (head.spd <= 2) {
          if (testRectPoint(mk, vec2(0))) {
            let dist = Math.min(
              Math.abs(mk.p1.x),
              Math.abs(mk.p2.x),
              Math.abs(mk.p1.y),
              Math.abs(mk.p2.y)
            );

            const res = (() => {
              switch (dist) {
                case Math.abs(mk.p1.x):
                  return vec2(dist, 0);
                case Math.abs(mk.p2.x):
                  return vec2(-dist, 0);
                case Math.abs(mk.p1.y):
                  return vec2(0, dist);
                case Math.abs(mk.p2.y):
                  return vec2(0, -dist);
              }
            })();

            if (player.playing) {
              e.pos = e.pos.add(res);
            }
          }
        }

        if (head.spd >= 75 && e.playing) {
          e.damagePlayerTrigger = true;
          if (testRectPoint(mk, vec2(0)) && head.damagesPlayer) {
            if (e.invincibleTimer === 0) {
              e.hurt();
              hm.decreaseHealth(1);
              hm.trigger("updateHealthBar");
            }
          }
        } else {
          head.damagesPlayer = false;
          e.damagePlayerTrigger = false;
          e.damagePlayerTimer = 0;
        }

        if (e.damagePlayerTrigger) {
          e.damagePlayerTimer++;
          if (e.damagePlayerTimer >= 4) {
            e.damagePlayerTrigger = false;
            e.damagePlayerTimer = 0;
            head.damagesPlayer = true;
          }
        }

        if (e.isHurt) {
          e.invincibleTimer += 1;
          if (e.invincibleTimer % 10 <= 5) {
            e.use(color(195, 0, 0));
          } else {
            e.use(color(255, 255, 255));
          }
          if (e.invincibleTimer >= e.invincibleTime) {
            e.invincibleTimer = 0;
            e.isHurt = false;
            e.unuse("color");
          }
        } else {
          e.unuse("color");
        }

        e.pos.x += e.spd * horizontal * diag * e.playing;
        e.pos.y += e.spd * vertical * diag * e.playing;

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

        e.playerDeltaX.push(e.pos.x);
        e.playerDeltaX.shift();
        e.playerDeltaY.push(e.pos.y);
        e.playerDeltaY.shift();

        if (e.pos.dist(head.pos) > head.aoe && player.playing) {
          e.awayTimer += 1;
          e.activateRing = true;
          if (e.awayTimer % 200 === 0) {
            let hm = getHealthManager();
            e.hurt();
            hm.decreaseHealth(1);
            hm.trigger("updateHealthBar");
            ring.xscale = 1.5;
            ring.yscale = 1.5;
          }
        } else {
          e.awayTimer = 0;
          e.activateRing = false;
        }

        ring.pos = vec2(e.pos.x, e.pos.y + 8);
        if (e.activateRing) {
          ring.use(opacity(1));
        } else {
          ring.use(opacity(0));
        }

        e.use(z(e.pos.y));

        if (left) {
          e.flipX(true);
        }

        if (right) {
          e.flipX(false);
        }

        if (!(left || right || up || down) || (left && right) || (up && down)) {
          if (e.curAnim() !== "idle") {
            e.play("idle");
          }
          e.walkTimer = 0;
        } else {
          if (e.curAnim() !== "run") {
            e.play("run");
          }
          e.walkTimer += 1;
          if (e.walkTimer % floor(rand(7, 15)) === 0) {
            addDust({
              x: e.pos.x,
              y: e.pos.y + e.width / 2 - 2,
              dir: rand(-90 - 45, -90 + 45),
              spd: rand(0, 5),
            });
          }
        }
      },
      kick: () => {
        // player.triggerKickAnim = true;
      },
      hurt: (enemy) => {
        if (player.playing) {
          player.isHurt = true;
        }
      },
    },
  ]);
  return player;
};

export const getPlayer = () => {
  return get("player")?.[0];
};
