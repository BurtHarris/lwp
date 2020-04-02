/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable indent */
/* eslint-disable quotes */
export { render } from "./component";

export async function foo() {
  const { baz, ...rest } = { baz: 123, x: 1 };
  const berk = { y: 7, ...rest };

  const { x } = await import("./dependency");

  return await window.bar(baz, rest, x, berk);
}

export function fooz(bar) {
  return bar;
}

export class Foo {
  bar = 1337;

  baz() {
    return 5;
  }
}
