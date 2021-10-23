import { initKaboom } from "./init.js";
import { generateLevel } from "./levelGen.js";
import { clamp, getActualCenter, sin } from "./utils/helpers.js";
import { addPlayer } from "./entities/player.js";
import { addHead } from "./entities/head.js";
import { addChargerLine } from "./entities/charger.js";
import { loadResources } from "./loadResources.js";
import { roomWidth, uiOffset } from "./utils/constants.js";
import { addSingleHealth } from "./entities/ui/health.js";
import { addHealthManager } from "./entities/ui/healthManager.js";
import { addPoof } from "./entities/poof.js";
import { addHitLines } from "./entities/ui/hitLines.js";
import { addGameManager } from "./gameManager.js";
import { addScoreIndicator } from "./entities/ui/scoreIndicator.js";
import { addGameOverScreen } from "./entities/ui/gameOverScreen.js";
import { addCorpse } from "./entities/corpse.js";
import { addDust } from "./entities/dust.js";
import { addBlock } from "./entities/block.js";
import { addGhostDude } from "./entities/enemies/ghostDude.js";

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
  layers(["bg", "corpse", "dust", "game", "ui", "uiOverlay"], "game");

  // add bg
  add([
    layer("bg"),
    sprite("bgTiles", { width: 256, height: 256 }),
    pos(uiOffset / 2, uiOffset - uiOffset / 4),
  ]);

  // add game manager
  let gm = addGameManager();
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
    a.parent.spd = 1;
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

  addGhostDude({ x: getActualCenter().x + 70, y: getActualCenter().y });

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

  collides("hitBox", "block", (a) => {
    a.parent.pushBack = true;
    if (Math.abs(a.parent.hspd) > Math.abs(a.parent.vspd)) {
      a.parent.pushBackDir = 180 - a.parent.dir;
    } else {
      a.parent.pushBackDir = -a.parent.dir;
    }

    a.parent.spd = 1;
  });

  head.collides("hitBox", (a) => {
    if (head.spd >= 0 && head.spd <= 10) {
      head.spd /= 3;
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
        if (a.parent.shooting) {
          a.parent.hurt({ dieWithPassion: true, specialHit: true });
          a.parent.health -= 10;
        }
      } else {
        a.parent.hurt({ dieWithPassion: true });
        a.parent.health -= 5;
      }
      return;
    }
  });

  head.collides("projectile", (a) => {
    addPoof({ x: a.pos.x, y: a.pos.y });
    destroy(a);
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
    if (player.invincibleTimer === 0) {
      addPoof({ x: pos.x, y: pos.y });
      if (player.playing) {
        player.hurt();
        healthManager.decreaseHealth(1);
        healthManager.trigger("updateHealthBar");
      }
    }
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
      player.spd = 0.69;
      charger.charge += 1;
      charger.charge = clamp(charger.charge, 0, charger.maxCharge);
    } else {
      charger.charge = 0;
    }
  });

  // kick head with charged power
  keyRelease("z", () => {
    let dist = player.pos.dist(head.pos);
    player.spd = 1;
    if (dist < shootRadius) {
      let dir = head.pos.angle(player.pos);
      head.shoot(dir, mapc(charger.charge, 0, charger.maxCharge, 0, 150));
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
