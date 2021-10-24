import { initKaboom } from "./init.js";
import { generateLevel } from "./levelGen.js";
import {
  clamp,
  getActualCenter,
  lengthdir_x,
  lengthdir_y,
  sin,
} from "./utils/helpers.js";
import { addPlayer } from "./entities/player.js";
import { addHead } from "./entities/head.js";
import { addChargerLine } from "./entities/charger.js";
import { loadResources } from "./loadResources.js";
import { roomHeight, roomWidth, uiOffset } from "./utils/constants.js";
import { addSingleHealth } from "./entities/ui/health.js";
import { addHealthManager } from "./entities/ui/healthManager.js";
import { addPoof } from "./entities/poof.js";
import { addHitLines } from "./entities/ui/hitLines.js";
import { addGameManager } from "./gameManager.js";
import { addScoreIndicator } from "./entities/ui/scoreIndicator.js";
import { addGameOverScreen } from "./entities/ui/gameOverScreen.js";
import { addCorpse } from "./entities/corpse.js";
import { addDust } from "./entities/dust.js";
import { addGhostDude } from "./entities/enemies/ghostDude.js";
import { addSkeleHead } from "./entities/enemies/skeleHead.js";
import { addFireball } from "./entities/fireball.js";
import { addHealthPickup } from "./entities/healthPickup.js";
import { addScoreBubble } from "./entities/scoreBubble.js";
import { addSnakeBoss } from "./entities/enemies/snakeBoss.js";

// general constants
let shootRadius = 40;
let healthBar = [];
let godMode = true;

// kabooooom!
initKaboom();

// load stuff
loadResources();

scene("game", () => {
  // init layers
  layers(["fxbg", "bg", "corpse", "dust", "game", "ui", "uiOverlay"], "game");

  // add fxbg for fx
  let fxBg = add([
    rect(roomWidth + uiOffset, roomHeight + uiOffset),
    layer("fxbg"),
    origin("topleft"),
    color(255, 255, 255),
    opacity(0),
    {
      triggerfx: false,
      flashTimer: 0,
    },
    {
      update: (e) => {
        if (e.triggerfx) {
          e.flashTimer++;
          if (e.flashTimer >= 60) {
            e.flashTimer = 0;
            e.triggerfx = false;
          }
          if (e.flashTimer % 10 < 5) {
            e.use(opacity(0.25));
          } else {
            e.use(opacity(0));
          }
        } else {
          e.use(opacity(0));
        }
      },
    },
  ]);

  // add bg
  add([
    layer("bg"),
    sprite("bgTiles", { width: 256, height: 256 }),
    pos(uiOffset / 2, uiOffset - uiOffset / 4),
  ]);

  // add game manager
  let gm = addGameManager(fxBg);
  gm.fxBg = fxBg;
  addScoreIndicator({
    x: roomWidth + uiOffset / 2,
    y: uiOffset / 2,
  });

  // add health manager
  let healthManager = addHealthManager();

  // generates a border level
  generateLevel();

  // create stuff
  let head = addHead();
  let player = addPlayer();
  let { _, charger } = addChargerLine();

  healthBar = [];
  healthManager.healthArray.forEach((health, i) => {
    healthBar.push(
      addSingleHealth({
        x: uiOffset / 2 + 10 + 16 * i,
        y: uiOffset / 4 + 5,
        i,
        initHealth: health,
      })
    );
  });

  collides("hitBox", "hitBox", (a, b) => {
    a.parent.pushBack = true;
    a.parent.pushBackDir = a.pos.angle(b.pos);
    if (!a.parent.is("skeleHeadBoss")) {
      a.parent.spd = 1;
    }
  });

  let gameOverScreen = addGameOverScreen();

  // bounce off walls
  head.collides("wall", (a, b) => {
    shake(0.5);
    if (a.dir === "topdown") {
      head.vspd = -head.vspd;
      head.spd /= 1.6;
      head.hitWall = true;
    } else if (a.dir === "leftright") {
      head.hspd = -head.hspd;
      head.spd /= 1.6;
      head.hitWall = true;
    }
  });

  collides("wall", "corpse", (a, b) => {
    b.spd = 0;
    b.hspd = 0;
    b.vspd = 0;
  });

  const sleep = (k) => {
    // let t = new Date().valueOf() + k;
    // while (new Date().valueOf() < t) {}
    debug.paused = true;
    setTimeout(() => {
      debug.paused = false;
    }, k);
  };

  head.collides("block", (a) => {
    a.xscale = 1.5;
    a.yscale = 1.5;
    head.hitWall = true;
    if (Math.abs(head.hspd) > Math.abs(head.vspd)) {
      head.hspd = -head.hspd;
    } else {
      head.vspd = -head.vspd;
    }
  });

  collides("skeleHeadBossHead", "wall", (a, b) => {
    a.xscale = 1.5;
    a.yscale = 1.5;
    if (b.dir === "topdown") {
      a.vspd = -a.vspd;
    } else if (b.dir === "leftright") {
      a.hspd = -a.hspd;
    }
  });

  collides("hitBox", "block", (a, b) => {
    a.parent.pushBack = true;
    if (Math.abs(a.parent.hspd) > Math.abs(a.parent.vspd)) {
      a.parent.pushBackDir = 180 - a.parent.dir;
    } else {
      a.parent.pushBackDir = -a.parent.dir;
    }

    if (a.parent.is("ghostDude") && a.parent.shooting) {
      if (Math.abs(a.parent.hspd) > Math.abs(a.parent.vspd)) {
        a.parent.dirToShoot = 180 - a.parent.dirToShoot;
      } else {
        a.parent.dirToShoot = -a.parent.dirToShoot;
      }
      a.parent.xscale = 1.2;
      a.parent.yscale = 1.2;
    }
    b.xscale = 1.2;
    b.yscale = 1.2;

    a.parent.spd = 1;
  });

  head.collides("hitBox", (a) => {
    if (head.spd === 0) {
      if (a.parent.is("ghostDude")) {
        head.spd = 50;
        head.dir = a.parent.dir;
        if (Math.abs(a.parent.hspd) > Math.abs(a.parent.vspd)) {
          a.parent.dirToShoot = 180 - a.parent.dirToShoot;
        } else {
          a.parent.dirToShoot = -a.parent.dirToShoot;
        }
        return;
      }
    }
    if (head.spd >= 0 && head.spd <= 10) {
      head.spd /= 3;
      if (a.parent.is("ghostDude")) {
        head.dir = a.parent.dir;
        if (Math.abs(a.parent.hspd) > Math.abs(a.parent.vspd)) {
          a.parent.dirToShoot = 180 - a.parent.dirToShoot;
        } else {
          a.parent.dirToShoot = -a.parent.dirToShoot;
        }
      }
      return;
    }
    if (head.spd <= 70 && head.spd >= 10) {
      // reduce head speed
      head.spd /= 3;
      // push the hittable back
      a.parent.pushBack = true;
      // on which dir to push back?
      a.parent.pushBackDir = head.dir;
      // how much speed to push?
      a.parent.spd = mapc(head.spd * 3, 0, 70, 1.4, 1.6);
      // glub
      a.parent.xscale = 1.5;
      a.parent.yscale = 1.5;
      // hurt em
      a.parent.hurt();
      if (Math.abs(head.hspd) > Math.abs(head.vspd)) {
        head.hspd = -head.hspd;
      } else {
        head.vspd = -head.vspd;
      }
      if (a.parent.is("ghostDude")) {
        if (Math.abs(a.parent.hspd) > Math.abs(a.parent.vspd)) {
          a.parent.dirToShoot = 180 - a.parent.dirToShoot;
        } else {
          a.parent.dirToShoot = -a.parent.dirToShoot;
        }
      }
      return;
    }
    if (head.spd >= 70) {
      addHitLines({ x: head.pos.x, y: head.pos.y });
      sleep(70);
      shake(2);
      if (!head.hitWall) {
        head.spd /= 1.3;
      } else {
        head.spd *= 1.3;
      }
      a.parent.pushBack = true;
      a.parent.pushBackDir = head.dir;
      a.parent.spd = mapc(head.spd * 3, 0, 70, 1.4, 1.6);
      a.parent.xscale = 1.5;
      a.parent.yscale = 1.5;
      if (a.parent.is("ghostDude")) {
        a.parent.hurt({ dieWithPassion: true });
        a.parent.health -= 3;
        if (a.parent.shootTimer >= a.parent.triggerShootTimer - 50) {
          a.parent.health -= 6;
        }
        if (a.parent.shooting) {
          a.parent.hurt({ dieWithPassion: true, specialHit: true });
          a.parent.health -= 16;
        }
      } else {
        a.parent.hurt({ dieWithPassion: true });
        a.parent.health -= 5;
      }
      if (a.parent.health >= 0) {
        if (Math.abs(head.hspd) > Math.abs(head.vspd)) {
          head.hspd = -head.hspd;
        } else {
          head.vspd = -head.vspd;
        }
      }
      return;
    }
  });

  head.collides("projectile", (a) => {
    if (!a.special) {
      addPoof({ x: a.pos.x, y: a.pos.y });
      destroy(a);
    } else if (head.spd >= 50) {
      addHitLines({ x: a.pos.x, y: a.pos.y });
      shake(0.5);
      gm.hitName = "DEFLECTED!";
      a.isDeflected = true;
      // a.deflectDir = head.dir;
      if (Math.abs(head.hspd) > Math.abs(head.vspd)) {
        a.xDir = -1;
      } else {
        a.yDir = -1;
      }
      a.defSpd = mapc(head.spd, 10, 100, 3, 10);
    }
  });

  keyPress("x", (v) => {
    addFireball({
      x: mousePos().x,
      y: mousePos().y,
      special: true,
      spd: 1,
      dir: 0,
    });
  });

  collides("enemy", "projectile", (a, b) => {
    if (b.special && b.isDeflected) {
      addHitLines({ x: a.pos.x, y: a.pos.y });
      shake(0.5);
      sleep(65);
      addPoof({ x: a.pos.x, y: a.pos.y });
      destroy(b);
      a.parent.hurt({ dieWithPassion: true, hitByProjectile: true });
      a.parent.health -= 1;
      gm.hitName = "DEFLECT HIT!";
    }
  });

  player.collides("enemy", () => {
    if (player.invincibleTimer === 0) {
      player.hurt();
      if (player.playing) {
        healthManager.decreaseHealth(1);
        healthManager.trigger("updateHealthBar");
      }
    }
  });

  player.collides("spike", (a) => {
    a.toggleSpike = true;
  });

  player.collides("projectile", (a) => {
    let pos = a.pos;
    destroy(a);
    if (player.invincibleTimer === 0 && !a.isDeflected) {
      addPoof({ x: pos.x, y: pos.y });
      if (player.playing) {
        player.hurt();
        healthManager.decreaseHealth(1);
        healthManager.trigger("updateHealthBar");
      }
    }
  });

  player.collides("healthPickup", (a) => {
    healthManager.increaseHealth(1);
    healthManager.trigger("updateHealthBar");
    destroy(a);
    player.hurt();
    addScoreBubble({
      x: player.pos.x,
      y: player.pos.y,
      amount: "<3",
    });
  });

  healthManager.on("updateHealthBar", () => {
    healthManager.healthArray.forEach((health, idx) => {
      healthBar[idx].toggle(health);
    });
    if (healthManager.health <= 0 && !godMode) {
      player.isDead = true;
      gm.playerIsDead = true;
      addHitLines({ x: player.pos.x, y: player.pos.y, n: 11 });
      for (let i = 0; i < 10; i++) {
        addDust({
          x: player.pos.x + rand(-player.width, player.width),
          y: player.pos.y + rand(-player.height, player.height),
          isSpawn: true,
        });
      }
      player.use(opacity(0));
      player.playing = false;
      player.activateRing = false;
      let playerCorpse = addCorpse({
        x: player.pos.x,
        y: player.pos.y,
        dir: rand(0, 360),
        spd: 4,
        poofSize: vec2(player.width, player.height),
        spr: "sprEgoKing",
        dieWithPassion: true,
        isPlayer: true,
      });
      playerCorpse.use(layer("uiOverlay"));
      playerCorpse.use(z(100000000));
      sleep(200);
      every("enemy", (e) => {
        e.parent.playing = false;
      });
      gameOverScreen.fadeIn();
    }
  });
  // gameOverScreen.fadeIn();

  // power up charger for kick
  keyDown("z", () => {
    let dist = player.pos.dist(head.pos);
    if (dist < shootRadius) {
      player.spd = 0.6;
      charger.charge += 0.5;
      charger.charge = clamp(charger.charge, 0, charger.maxCharge);
    } else {
      charger.charge = 0;
    }
  });

  addSnakeBoss({ x: getActualCenter().x + 50, y: getActualCenter().y });

  // kick head with charged power
  keyRelease("z", () => {
    let dist = player.pos.dist(head.pos);
    player.spd = 1;
    if (dist < shootRadius) {
      let dir = head.pos.angle(player.pos);
      head.shoot(dir, mapc(charger.charge, 0, charger.maxCharge, 0, 150));
      player.kick();
    }
  });

  // reset head
  keyPress("r", () => {
    head.pos = center();
    head.resetSpeed();
    go("game");
  });

  keyPress("f", (c) => {
    fullscreen(!isFullscreen());
  });
});

go("game");

// focus canvas
ready(() => {
  if (!focused()) {
    focus();
  }
});
