import mockFS from "mock-fs";
import { join } from "node:path";
import { assert, describe, expect, it } from "vitest";
import { validate_args } from "./arg-validator";
import { in_dir_non_existant, out_dir_taken } from "./error-messages";
import { I_The_Templator } from "./types";

describe("positional", () => {
  it("if in_dir does not exist - it errors out", () => {
    mockFS({});

    const args: I_The_Templator = {
      in_dir: "path",
      out_dir: "path",
    };
    const result = validate_args(args);

    assert(result.isError());
    expect(result.getError()).toBe(in_dir_non_existant);

    mockFS.restore();
  });

  it("if out_dir is taken - it errors out", () => {
    const path = join(process.cwd(), "folder");
    const out_dir = join(process.cwd(), "folder2");
    mockFS({ [path]: {}, [out_dir]: {} });

    const args: I_The_Templator = {
      in_dir: path,
      out_dir: out_dir,
    };
    const result = validate_args(args);

    assert(result.isError());
    expect(result.getError()).toBe(out_dir_taken);

    mockFS.restore();
  });

  it("both are defined and correcty set it does not error out", () => {
    const path = join(process.cwd(), "folder");
    mockFS({ [path]: {} });

    const args: I_The_Templator = {
      in_dir: path,
      out_dir: "something_else",
    };
    const result = validate_args(args);

    assert(result.isOk());

    expect(result.get()).toEqual(args);

    mockFS.restore();
  });
});
