export const loadResources = () => {
  loadSprite("bgTiles", "sprites/bgsmall.png");
  loadSpriteAtlas("sprites/spritesheet.png", {
    sprTitle: {
      x: 67,
      y: 50,
      width: 91,
      height: 28,
    },
    sprEgoKing: {
      x: 0,
      y: 0,
      width: 16 * 9,
      height: 16,
      sliceX: 9,
      anims: {
        idle: { from: 0, to: 4 },
        run: { from: 5, to: 8, speed: 13 },
      },
    },
    sprWitch: {
      x: 246,
      y: 40,
      width: 20,
      height: 17,
    },
    sprWiggle: {
      x: 268,
      y: 40,
      width: 20,
      height: 20,
    },
    sprHead: {
      x: 0,
      y: 17,
      width: 22 * 14,
      height: 22,
      sliceX: 14,
      anims: { roll: { from: 0, to: 13 } },
    },
    sprSlime1: {
      x: 145,
      y: 0,
      width: 16 * 5,
      height: 10,
      sliceX: 5,
      anims: {
        slime: { from: 0, to: 4, loop: true, pingpong: true },
      },
    },
    sprSlime2: {
      x: 226,
      y: 0,
      width: 16 * 5,
      height: 10,
      sliceX: 5,
      anims: {
        slime: { from: 0, to: 4, loop: true, pingpong: true },
      },
    },
    sprHeart: {
      x: 2,
      y: 40,
      height: 10,
      width: 10,
    },
    sprDust: {
      x: 23,
      y: 41,
      height: 5 * 3,
      width: 5 * 8,
      sliceX: 8,
      sliceY: 3,
      anims: {
        poof1: { from: 0, to: 7, speed: 16 },
        poof2: { from: 8, to: 15, speed: 14 },
        poof3: { from: 16, to: 23, speed: 13 },
      },
    },
    sprRing: {
      x: 65,
      y: 40,
      height: 7,
      width: 17 * 5,
      sliceX: 5,
      anims: {
        loop: { from: 0, to: 4, loop: true, speed: 20 },
      },
    },
    sprSkeleHead: {
      x: 1,
      y: 51,
      width: 10,
      height: 9,
    },
    sprSplSkeleHead: {
      x: 12,
      y: 52,
      width: 10,
      height: 9,
    },
    sprFireball: {
      x: 162,
      y: 41,
      width: 7,
      height: 7,
    },
    sprSplFireball: {
      x: 162,
      y: 49,
      width: 8,
      height: 8,
    },
    sprProjPoof: {
      x: 170,
      y: 41,
      width: 7 * 2,
      height: 7,
      sliceX: 2,
      anims: {
        poof: { from: 0, to: 1, speed: 8 },
      },
    },
    sprSpike: {
      x: 192,
      y: 40,
      width: 16 * 2,
      height: 16,
      sliceX: 2,
    },
    sprBlock: {
      x: 226,
      y: 40,
      width: 17,
      height: 17,
    },
    sprGhostDude: {
      x: 1,
      y: 63,
      width: 12,
      height: 11,
    },
  });
};
