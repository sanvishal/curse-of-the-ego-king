import { addDust } from "../dust.js";
import { getPlayer } from "../player.js";
import { getHealthManager } from "../ui/healthManager.js";

export const addSpike = ({ x, y }) => {
  let player = getPlayer();
  let hm = getHealthManager();
  let spike = add([
    sprite("sprSpike"),
    pos(x, y),
    "spike",
    "hazard",
    area({ scale: 0.6 }),
    layer("bg"),
    origin("center"),
    {
      toggleSpike: false,
      timer: 0,
      spikeOut: 40,
      spikeIn: 100,
      isHurting: false,
      playing: true,
    },
    {
      add: () => {
        for (let i = 0; i < 3; i++) {
          addDust({
            x: x + rand(-10, 10),
            y: y + rand(-10, 10),
            isSpawn: true,
            dir: -90,
            spd: 15,
          });
        }
      },
    },
    {
      update: (e) => {
        if (e.toggleSpike && e.playing) {
          e.timer++;
          if (e.timer >= e.spikeOut) {
            e.frame = 1;
            e.isHurting = true;
          }
          if (e.timer >= e.spikeIn) {
            e.frame = 0;
            e.toggleSpike = false;
            e.isHurting = false;
            e.timer = 0;
            if (e.isColliding(player)) {
              e.toggleSpike = true;
            }
          }
          if (
            player.invincibleTimer === 0 &&
            e.isHurting &&
            e.isColliding(player) &&
            e.playing
          ) {
            if (player.playing) {
              player.hurt();
              hm.decreaseHealth(1);
              hm.trigger("updateHealthBar");
            }
          }
        }
      },
    },
  ]);
  return spike;
};
