import { assert, describe, expect, it } from "vitest";
import mockFS from "mock-fs";
import { join } from "node:path";
import { I_The_Templator } from "./types";
import { validator } from "./validator";

describe("main_validator", () => {
  it("validates as an object", () => {
    const path = join(process.cwd(), "folder");
    mockFS({ [path]: {} });

    const args: I_The_Templator = {
      in_dir: path,
      out_dir: "something_else",
    };
    const result = validator(args);
    console.log("result:", result);

    assert(result.isOk());

    expect(result.get()).toEqual(args);

    mockFS.restore();
  });

  it("validates as positional arguments", () => {
    const path = join(process.cwd(), "folder");
    mockFS({ [path]: {} });

    const args: I_The_Templator = {
      in_dir: path,
      out_dir: "something_else",
      number: 2,
      vars: {},
    };
    const result = validator(path, "something_else");

    assert(result.isOk());

    expect(result.get()).toEqual(args);

    mockFS.restore();
  });
});
