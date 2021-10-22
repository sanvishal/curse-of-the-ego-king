import { initKaboom } from "./init.js";
import { generateLevel } from "./levelGen.js";
import {
  pointDirection,
  clamp,
  pointDistance,
  minkDiff,
} from "./utils/helpers.js";
import { addPlayer } from "./entities/player.js";
import { addHead } from "./entities/head.js";
import { addChargerLine } from "./entities/charger.js";
import { addHittable } from "./entities/hittable.js";
import { loadResources } from "./loadResources.js";
import {
  maxHealth,
  roomHeight,
  roomWidth,
  uiOffset,
} from "./utils/constants.js";
import { addSlime } from "./entities/enemies/slime.js";
import { addSingleHealth } from "./entities/ui/health.js";
import { addHealthManager } from "./entities/ui/healthManager.js";
import { addSkeleHead } from "./entities/enemies/skeleHead.js";
import { addPoof } from "./entities/poof.js";
import { addHitLines } from "./entities/ui/hitLines.js";

// general constants
let shootRadius = 40;
let healthBar = [];

// kabooooom!
initKaboom();

// load stuff
loadResources();

// add bg
add([
  layer("bg"),
  sprite("bgTiles", { width: 256, height: 256 }),
  pos(uiOffset / 2, uiOffset - uiOffset / 4),
]);

// add health manager
let healthManager = addHealthManager();

// generates a border level
generateLevel();

// create stuff
let head = addHead();
let player = addPlayer();
let { _, charger } = addChargerLine();

console.log(
  addSkeleHead({
    x: roomWidth / 2 + uiOffset / 2,
    y: roomHeight / 2 + uiOffset - uiOffset / 4,
  })
);

addSlime({
  x: roomWidth / 2 + uiOffset / 2,
  y: roomHeight / 2 + uiOffset - uiOffset / 4,
});

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

function sleep(k) {
  // let t = new Date().valueOf() + k;
  // while (new Date().valueOf() < t) {}
  debug.paused = true;
  setTimeout(() => {
    debug.paused = false;
  }, k);
}

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
    sleep(50);
    shake(1);
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
    a.parent.hurt({ dieWithPassion: true });
    a.parent.health -= 5;
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
    healthManager.decreaseHealth(1);
    healthManager.trigger("updateHealthBar");
  }
});

player.collides("projectile", (a) => {
  let pos = a.pos;
  destroy(a);
  if (player.invincibleTimer === 0) {
    addPoof({ x: pos.x, y: pos.y });
    player.hurt();
    healthManager.decreaseHealth(1);
    healthManager.trigger("updateHealthBar");
  }
});

healthManager.on("updateHealthBar", () => {
  healthManager.healthArray.forEach((health, idx) => {
    healthBar[idx].toggle(health);
  });
});

// power up charger for kick
keyDown("z", () => {
  let dist = player.pos.dist(head.pos);
  if (dist < shootRadius) {
    charger.charge += 1;
    charger.charge = clamp(charger.charge, 0, charger.maxCharge);
  }
});

// kick head with charged power
keyRelease("z", () => {
  let dist = player.pos.dist(head.pos);
  if (dist < shootRadius) {
    let dir = head.pos.angle(player.pos);
    head.shoot(dir, mapc(charger.charge, 0, charger.maxCharge, 0, 150));
  }
});

// reset head
keyPress("r", () => {
  head.pos = center();
  head.resetSpeed();
});

// focus canvas
ready(() => {
  if (!focused()) {
    focus();
  }
});

keyPress("f", (c) => {
  fullscreen(!isFullscreen());
});
