import { maxHealth } from "../../utils/constants.js";
import { clamp } from "../../utils/helpers.js";

export const addHealthManager = () => {
  let mgr = add([
    rect(10, 10),
    opacity(0),
    pos(center()),
    "healthManager",
    {
      maxHealth: maxHealth,
      health: maxHealth,
      healthArray: new Array(maxHealth).fill(true),
    },
    {
      decreaseHealth: (amnt) => {
        mgr.health -= amnt;
        mgr.health = clamp(mgr.health, 0, maxHealth);
        // sleepless code ftw
        for (let i = 0; i < maxHealth; i++) {
          if (i < mgr.health) {
            mgr.healthArray[i] = true;
          } else {
            mgr.healthArray[i] = false;
          }
        }
      },
    },
    {
      increaseHealth: (amnt) => {
        mgr.health += amnt;
        mgr.health = clamp(mgr.health, 0, maxHealth);
        // sleepless code ftw
        for (let i = 0; i < maxHealth; i++) {
          if (i < mgr.health) {
            mgr.healthArray[i] = true;
          } else {
            mgr.healthArray[i] = false;
          }
        }
      },
    },
  ]);

  return mgr;
};

export const getHealthManager = () => {
  return get("healthManager")?.[0];
};
