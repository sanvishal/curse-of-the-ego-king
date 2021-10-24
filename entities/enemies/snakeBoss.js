import { lengthdir_x, lengthdir_y } from "../../utils/helpers.js";
import { addSnakeBossBodyPart } from "./snakeBossBodyPart.js";

export const addSnakeBoss = ({ x, y }) => {
  let snakeDeltaX = [0, 0];
  let snakeDeltaY = [0, 0];
  let snake = [];
  let parts = 5;

  let head = addSnakeBossBodyPart({ x, y, isHead: true });
  for (let i = 0; i < parts; i++) {
    let p = addSnakeBossBodyPart({ x: x, y: y });
    p.parent = head;
    head = p;
  }

  action(() => {
    // snakeDeltaX.push(head.pos.x);
    // snakeDeltaX.shift();
    // snakeDeltaY.push(head.pos.y);
    // snakeDeltaY.shift();
    // let delX = snakeDeltaX[1] - snakeDeltaX[0];
    // let delY = snakeDeltaY[1] - snakeDeltaY[0];
    // let v = vec2(delX, delY).normal();
    // p1.pos.x = v.x;
    // p1.pos.y = v.y;
    // console.log(p1.pos.x);
  });
};
