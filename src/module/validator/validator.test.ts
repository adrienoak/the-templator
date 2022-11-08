import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import mockFS from "mock-fs";
import { join } from "node:path";
import { I_The_Templator } from "./types";
import { validator } from "./validator";

describe("main_validator", () => {
  const path = join(process.cwd(), "folder");
  beforeEach(() => {
    mockFS({ [path]: {} });
  });

  afterEach(() => {
    mockFS.restore();
  });

  it("validates as an object", () => {
    mockFS({ [path]: {} });

    const args: I_The_Templator = {
      in_dir: path,
      out_dir: "something_else",
    };

    const result = validator(args);

    assert(result.isOk());

    expect(result.get()).toEqual({
      ...args,
      dry_run: false,
      number: 2,
      vars: {},
    });
  });

  it("calls on_file_exists_hook", () => {
    const out_dir = "something_else";

    const args: I_The_Templator = {
      in_dir: path,
      out_dir: out_dir,
      number: 2,
      vars: {},
    };
    const on_file_exists_hook = vi.fn();

    const result = validator({ in_dir: path, out_dir }, on_file_exists_hook);

    assert(result.isOk());

    expect(result.get()).toEqual({
      ...args,
      dry_run: false,
      number: 2,
      vars: {},
    });

    expect(on_file_exists_hook).toHaveBeenCalledTimes(2);
  });
});
