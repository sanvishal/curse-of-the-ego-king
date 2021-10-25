import { getGameManager } from "../../gameManager.js";
import { bossHealth, roomWidth } from "../../utils/constants.js";
import {
  getActualCenter,
  lengthdir_x,
  lengthdir_y,
} from "../../utils/helpers.js";
import { addLetterPickUp } from "../letterPickUp.js";
import { addGhostDude } from "./ghostDude.js";
import { addSkeleHead } from "./skeleHead.js";
import { addSlime } from "./slime.js";
import { addSnakeBossBodyPart } from "./snakeBossBodyPart.js";

export const addSnakeBoss = ({ x, y }) => {
  let snake = [];
  let parts = 5;
  let gm = getGameManager();
  let word = ["S", "O", "R", "R", "Y"];

  let head = addSnakeBossBodyPart({
    x,
    y,
    isHead: true,
    tag: "skeleHeadBossHead",
    name: "part0",
    special: true,
  });
  head.parent = null;
  snake.push(head);
  // holy shit linked lists boss ftw!!!!!!
  let p = null;
  for (let i = 0; i < parts - 1; i++) {
    p = addSnakeBossBodyPart({
      x: x,
      y: y,
      tag: "skeleHeadBoss",
      name: "part" + (i + 1),
    });
    p.parent = head;
    head = p;
    snake.push(p);
  }
  // console.log(head.playing);

  let timer = 0;
  let curr = 0;
  action(() => {
    timer++;
    if (timer >= 0 && timer <= 100 && timer % 5 === 0 && curr < parts) {
      snake[curr].xscale = 1.4;
      snake[curr].yscale = 1.4;
      curr++;
    }
    if (timer >= 100) {
      timer = 0;
      curr = 0;
    }
  });

  action(() => {
    // last minute sphagetti code!
    if (gm.bossHealth <= bossHealth * 0.8) {
      let p = get("part4");
      if (p?.length) {
        addSlime({
          x: head.pos.x + rand(-20, 20),
          y: head.pos.y + rand(-20, 20),
        }).playing = true;
        addSlime({
          x: head.pos.x + rand(-20, 20),
          y: head.pos.y + rand(-20, 20),
        }).playing = true;
        let letterToUse = word.splice(
          Math.floor(Math.random() * word.length),
          1
        )?.[0];
        addLetterPickUp({
          x: p[0].pos.x,
          y: p[0].pos.y,
          letter: letterToUse,
        });
        p[0].hurt({ dieWithPassion: true });
        p[0].die();
      }
    }
    if (gm.bossHealth <= bossHealth * 0.6) {
      let p = get("part3");
      if (p?.length) {
        addSkeleHead({
          x: getActualCenter().x - 100,
          y: getActualCenter().y - 90,
          r: 1,
        }).playing = true;
        addSkeleHead({
          x: getActualCenter().x + 100,
          y: getActualCenter().y - 90,
          r: 1,
        }).playing = true;
        addSkeleHead({
          x: getActualCenter().x - 100,
          y: getActualCenter().y + 90,
          r: 1,
        }).playing = true;
        addSkeleHead({
          x: getActualCenter().x + 100,
          y: getActualCenter().y + 90,
          r: 1,
        }).playing = true;
        let letterToUse = word.splice(
          Math.floor(Math.random() * word.length),
          1
        )?.[0];
        addLetterPickUp({
          x: p[0].pos.x,
          y: p[0].pos.y,
          letter: letterToUse,
        });
        p[0].hurt({ dieWithPassion: true });
        p[0].die();
      }
    }
    if (gm.bossHealth <= bossHealth * 0.4) {
      let p = get("part2");
      if (p?.length) {
        addGhostDude({
          x: p[0].pos.x + rand(-6, 6),
          y: p[0].pos.y + rand(-6, 6),
        }).playing = true;
        addGhostDude({
          x: p[0].pos.x + rand(-6, 6),
          y: p[0].pos.y + rand(-6, 6),
        }).playing = true;
        addGhostDude({
          x: p[0].pos.x + rand(-6, 6),
          y: p[0].pos.y + rand(-6, 6),
        }).playing = true;
        let letterToUse = word.splice(
          Math.floor(Math.random() * word.length),
          1
        )?.[0];
        addLetterPickUp({
          x: p[0].pos.x,
          y: p[0].pos.y,
          letter: letterToUse,
        });
        p[0].hurt({ dieWithPassion: true });
        p[0].die();
      }
    }
    if (gm.bossHealth <= bossHealth * 0.1) {
      let p = get("part1");
      if (p?.length) {
        addSkeleHead({
          x: getActualCenter().x - 210,
          y: getActualCenter().y,
          r: 100,
          xspd: 0,
          yvary: 5,
          xvary: 1,
          yspd: 6,
          special: true,
        }).playing = true;
        addSkeleHead({
          x: getActualCenter().x + 5,
          y: getActualCenter().y,
          r: 100,
          xspd: 0,
          yvary: -5,
          yspd: -6,
          xvary: 1,
          special: true,
        }).playing = true;
        addSkeleHead({
          x: getActualCenter().x,
          y: getActualCenter().y + 100,
          r: 100,
          xspd: 6,
          yvary: 1,
          yspd: 0,
          xvary: -5,
          special: true,
        }).playing = true;
        addSkeleHead({
          x: getActualCenter().x,
          y: getActualCenter().y - 100,
          r: 100,
          xspd: -6,
          yvary: 1,
          yspd: 0,
          xvary: 5,
          special: true,
        }).playing = true;
        let letterToUse = word.splice(
          Math.floor(Math.random() * word.length),
          1
        )?.[0];
        addLetterPickUp({
          x: p[0].pos.x,
          y: p[0].pos.y,
          letter: letterToUse,
        });
        p[0].hurt({ dieWithPassion: true });
        p[0].die();
      }
    }

    if (gm.bossHealth <= 0) {
      let p = get("part0");
      // console.log(p.isHead);
      if (p?.length) {
        let letterToUse = word.splice(
          Math.floor(Math.random() * word.length),
          1
        )?.[0];
        addLetterPickUp({
          x: p[0].pos.x,
          y: p[0].pos.y,
          letter: letterToUse,
        });
        p[0].playing = false;
      }
    }
  });

  return snake;
};

export const getSnakeBosss = () => {
  return get("skeleHeadBossHead")?.[0];
};
