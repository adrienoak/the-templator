import mockFS from "mock-fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  write_file,
  write_file_sync,
  Write_Func,
  Write_Func_Sync,
} from "./write-file";

describe("write_file", () => {
  it("without mocked function", async () => {
    const file = "file.js";
    mockFS({});

    const path = join(process.cwd(), file);
    const content = "test";
    const result = await write_file(path, content);
    const read = readFileSync(path, { encoding: "utf-8" });
    expect(read).toBe(content);
    expect(result.isOk()).toBe(true);
    mockFS.restore();
  });

  it("doesnt call mock if dry_run is true", async () => {
    const file = "file.js";
    const mock = vi.fn() as Write_Func;
    mockFS({ [file]: "here" });

    const path = join(process.cwd(), file);
    const content = "test";
    const result = await write_file(path, content, {
      dry_run: true,
      write_func: mock,
    });
    expect(result.isOk()).toBe(true);
    expect(mock).not.toHaveBeenCalledOnce();
    mockFS.restore();
  });

  it("calls mock if there is no dry run", async () => {
    const file = "file.js";
    const mock = vi.fn().mockImplementation(() => {});
    mockFS({ [file]: "here" });

    const path = join(process.cwd(), file);
    const content = "test";
    const result = await write_file(path, content, {
      write_func: mock,
    });
    expect(result.isOk()).toBe(true);
    expect(mock).toHaveBeenCalledOnce();
    mockFS.restore();
  });

  it("if injected function fails, returns an error", async () => {
    const file = "file.js";
    const mock = vi.fn().mockImplementation(() => {
      throw new Error();
    });
    mockFS({ [file]: "here" });

    const path = join(process.cwd(), file);
    const content = "test";
    const result = await write_file(path, content, {
      write_func: mock,
    });

    expect(result.isOk()).toBe(false);
    expect(mock).toHaveBeenCalledOnce();
    mockFS.restore();
  });
});

describe("write_file_sync", () => {
  it("without mocked function", () => {
    const file = "file.js";
    mockFS({});

    const path = join(process.cwd(), file);
    const content = "test";
    const result = write_file_sync(path, content);
    const read = readFileSync(path, { encoding: "utf-8" });
    expect(read).toBe(content);
    expect(result.isOk()).toBe(true);
    mockFS.restore();
  });

  it("doesnt call mock if dry_run is true", () => {
    const file = "file.js";
    const mock = vi.fn() as Write_Func_Sync;
    mockFS({ [file]: "here" });

    const path = join(process.cwd(), file);
    const content = "test";
    const result = write_file_sync(path, content, {
      dry_run: true,
      write_func: mock,
    });
    expect(result.isOk()).toBe(true);
    expect(mock).not.toHaveBeenCalledOnce();
    mockFS.restore();
  });

  it("calls mock if there is no dry run", () => {
    const file = "file.js";
    const mock = vi.fn().mockImplementation(() => {});
    mockFS({ [file]: "here" });

    const path = join(process.cwd(), file);
    const content = "test";
    const result = write_file_sync(path, content, {
      write_func: mock,
    });
    expect(result.isOk()).toBe(true);
    expect(mock).toHaveBeenCalledOnce();
    mockFS.restore();
  });

  it("if injected function fails, returns an error", () => {
    const file = "file.js";
    const mock = vi.fn().mockImplementation(() => {
      throw new Error();
    });
    mockFS({ [file]: "here" });

    const path = join(process.cwd(), file);
    const content = "test";
    const result = write_file_sync(path, content, {
      write_func: mock,
    });
    expect(result.isOk()).toBe(false);
    expect(mock).toHaveBeenCalledOnce();
    mockFS.restore();
  });
});
