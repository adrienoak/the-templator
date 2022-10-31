import { describe, expect, it } from "vitest";
import { remove_dots } from "./remove_dot";

describe("remove_dots", () => {
  it("does not remove underscore from the middle", () => {
    const str = "env_.env";
    expect(remove_dots(str)).toBe(str);
  });
  it("removes underscore (if it has dot after it) from the begining", () => {
    const str = "_.env_.env";
    expect(remove_dots(str)).toBe(str.slice(1));
  });
  it("removes underscore from the begining", () => {
    const str = "_env_.env";
    expect(remove_dots(str)).toBe(str);
  });
});
