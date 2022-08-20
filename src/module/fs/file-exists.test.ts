import { describe, expect, it, vi } from "vitest";
import { file_exists } from "./file-exists";
import type { PathLike } from "node:fs";
import { join } from "node:path";
import mockFS from "mock-fs";

describe("file_exists", () => {
  it("actual calls fs and checks validity", () => {
    mockFS({ "file.js": "file" });

    const base_path = process.cwd();
    const fake_file = join(base_path, "file.js");

    const result = file_exists(fake_file);

    expect(result).toBe(true);

    mockFS.restore();
  });

  it("actual calls fs and checks validity", () => {
    mockFS({ "file2.js": "file" });

    const base_path = process.cwd();
    const fake_file = join(base_path, "file.js");

    const result = file_exists(fake_file);

    expect(result).toBe(false);

    mockFS.restore();
  });

  it("actual calls function passed as an argument", () => {
    const mock = vi.fn().mockImplementation((path: string) => false);

    const base_path = process.cwd();
    const fake_file = join(base_path, "file.js");

    const result = file_exists(fake_file, mock);

    expect(result).toBe(false);
    expect(mock).toHaveBeenCalledOnce();
    expect(mock).toHaveBeenCalledWith(fake_file);
  });
  it("actual calls fs and checks validity", () => {
    const mock = vi.fn().mockImplementation((path: string) => true);

    const base_path = process.cwd();
    const fake_file = join(base_path, "file.js");

    const result = file_exists(fake_file, mock);

    expect(result).toBe(true);
    expect(mock).toHaveBeenCalledOnce();
    expect(mock).toHaveBeenCalledWith(fake_file);
  });

  it("actual calls fs and checks validity", () => {
    const mock = vi.fn().mockImplementation((path: string) => {
      throw new Error("Oops");
    });

    const base_path = process.cwd();
    const fake_file = join(base_path, "file.js");

    const result = file_exists(fake_file, mock);

    expect(result).toBe(false);
    expect(mock).toHaveBeenCalledOnce();
    expect(mock).toHaveBeenCalledWith(fake_file);
  });
});
