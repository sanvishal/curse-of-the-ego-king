import { roomHeight, roomWidth, uiOffset } from "./constants.js";

export function pointDirection(x1, y1, x2, y2) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

export function pointDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export function lengthdir_x(len, dir) {
  return Math.cos((dir * Math.PI) / 180) * len;
}

export function lengthdir_y(len, dir) {
  return Math.sin((dir * Math.PI) / 180) * len;
}

export function sin(v) {
  return Math.sin(v);
}

export function cos(v) {
  return Math.cos(v);
}

export function floor(v) {
  return Math.floor(v);
}

export function ceil(v) {
  return Math.ceil(v);
}

export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

export function approach(start, end, rate) {
  if (start > end) return Math.max(start - rate, end);
  else return Math.min(start + rate, end);
}

export function minkDiff(r1, r2) {
  return {
    p1: vec2(r1.p1.x - r2.p2.x, r1.p1.y - r2.p2.y),
    p2: vec2(r1.p2.x - r2.p1.x, r1.p2.y - r2.p1.y),
  };
}

export function rLerp(A, B, w) {
  let CS = (1 - w) * Math.cos(A) + w * Math.cos(B);
  let SN = (1 - w) * Math.sin(A) + w * Math.sin(B);
  return Math.atan2(SN, CS);
}

export function getActualCenter() {
  return {
    x: roomWidth / 2 + uiOffset / 2,
    y: roomHeight / 2 + uiOffset - uiOffset / 4,
  };
}

export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
