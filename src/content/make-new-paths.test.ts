import { describe, expect, it } from "vitest";
import { join, basename } from "node:path";
import { Vars_Schema } from "../module/validator";
import { make_new_path } from "./make-new-path";

describe("make-new-paths", () => {
  it("identifies similarities", () => {
    const [key] = ["name"];
    const [value] = ["name"];
    const arg: Vars_Schema = { [key]: value };
    const folder = "folder";
    const folder2 = "folder2";
    const out = "out";
    const base = join(process.cwd(), folder);

    const out_dir = join(process.cwd(), out);
    const in_dir = join(base, `{{${key}}}`, folder2);
    const new_path = make_new_path({
      base_dir: base,
      in_dir,
      out_dir,
      vars: arg,
    });
    expect(new_path).toBe(join(out_dir, value, folder2));
  });

  it("identifies similarities", () => {
    const [first_key, second_key] = ["name", "file"];
    const [first_var, second_var] = ["var", "heya"];
    const arg: Vars_Schema = {
      [first_key]: first_var,
      [second_key]: second_var,
    };
    const cwd = process.cwd();
    const folder = "folder2";
    const out_str = "out";
    const base = join(cwd, "whatever");

    const base_out_dir = join(cwd, out_str);
    const base_in_dir = join(base, `{{${first_key}}}`, folder, second_key);
    const in_dir = join(base_in_dir, `{{${second_key}}}`);
    const new_path = make_new_path({
      base_dir: base,
      in_dir,
      out_dir: base_out_dir,
      vars: arg,
    });
    const out = join(base_out_dir, first_var, folder, second_key, second_var);
    expect(out).toBe(new_path);
  });

  it("deals with dotfiles", () => {
    const [first_key, second_key] = ["name", "file"];
    const [first_var, second_var] = ["var", "heya"];
    const arg: Vars_Schema = {
      [first_key]: first_var,
      [second_key]: second_var,
    };
    const cwd = process.cwd();
    const folder = "folder";
    const folder2 = "folder2";
    const out_str = "out";
    const base = join(cwd, folder);

    const base_out_dir = join(cwd, out_str);
    const base_in_dir = join(base, `.{{${first_key}}}`, folder2, second_key);
    const in_dir = join(base_in_dir, `{{${second_key}}}`);
    const new_path = make_new_path({
      base_dir: base,
      in_dir,
      out_dir: base_out_dir,
      vars: arg,
    });
    const out = join(
      base_out_dir,
      "." + first_var,
      folder2,
      second_key,
      second_var
    );
    expect(out).toBe(new_path);
  });

  it("deals with dotfiles if it has an underscore before", () => {
    const [first_key, second_key] = ["name", "file"];
    const [first_var, second_var] = ["var", "heya"];
    const arg: Vars_Schema = {
      [first_key]: first_var,
      [second_key]: second_var,
    };
    const cwd = process.cwd();
    const folder = "folder";
    const folder2 = "folder2";
    const out_str = "out";
    const base = join(cwd, folder);

    const base_out_dir = join(cwd, out_str);
    const base_in_dir = join(base, `_{{${first_key}}}`, folder2, second_key);
    const in_dir = join(base_in_dir, `{{${second_key}}}`);
    const new_path = make_new_path({
      base_dir: base,
      in_dir,
      out_dir: base_out_dir,
      vars: arg,
    });

    const out = join(
      base_out_dir,
      "_" + first_var,
      folder2,
      second_key,
      second_var
    );
    expect(out).toBe(new_path);
  });
});
