export const loadResources = () => {
  loadSprite("bgTiles", "sprites/bgsmall.png");
  loadSpriteAtlas("sprites/spritesheet.png", {
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
      x: 0,
      y: 39,
      height: 10,
      width: 11 * 2,
      sliceX: 2,
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
  });
};
