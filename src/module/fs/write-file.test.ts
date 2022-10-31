import mockFS from "mock-fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { calc_path_existing } from "../../utils";
import { file_exists } from "./file-exists";
import { read_file } from "./read-file";
import {
  make_write_file,
  write_file,
  write_file_sync,
  Write_Func_Sync,
} from "./write-file";

const base_path = process.cwd();

describe("make_write_file", () => {
  describe("with mocking fs", () => {
    afterEach(() => {
      mockFS.restore();
    });

    it("works correctly", async () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const exists_before = file_exists(path);

      mockFS({});

      const func = make_write_file();

      const result = await func({ path, content });
      const exists_after = file_exists(path);

      const after_file_content = await read_file(path);

      expect(exists_before).toBe(false);
      expect(exists_after).toBe(true);
      expect(after_file_content.isOk() && after_file_content.get()).toBe(
        content
      );

      expect(result.isOk()).toBe(true);
    });

    it("does not call the function if dry_run is true", async () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";
      const mock_func = vi.fn();

      const exists_before = file_exists(path);

      mockFS({});

      const func = make_write_file({ write_file_func: mock_func });

      const result = await func({ path, content, dry_run: true });
      const exists_after = file_exists(path);

      expect(exists_before).toBe(false);
      expect(exists_after).toBe(false);
      expect(mock_func).not.toHaveBeenCalled();

      expect(result.isOk()).toBe(true);
    });

    it("if path does not exist, mounts filepath until there", async () => {
      mockFS({});
      const file = "file.js";
      const path = join(base_path, "something-else", "something", file);

      const all_there_before = calc_path_existing(path);

      const content = "test";

      const func = make_write_file();

      const result = await func({
        path,
        content,
      });

      const read_content = await read_file(path);

      const all_there_after = calc_path_existing(path);

      expect(result.isOk()).toBe(true);
      expect(all_there_before).toBe(false);
      expect(all_there_after).toBe(true);
      expect(read_content.isOk() && read_content.get()).toBe(content);
    });
  });

  describe.todo("without mocking fs", () => {});
});

describe.skip("write_file", () => {
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
    const mock = vi.fn().mockRejectedValue(new Error());
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

  it("nested file inside multiple folders", async () => {
    const path1 = join(process.cwd(), "path", "path-enter");
    mockFS({ [path1]: "hello" });

    const content = "test";
    const result = await write_file(path1, content);

    expect(result.isOk()).toBe(true);
    mockFS.restore();
  });

  it("nested file inside multiple folders, fails if folder doesnt exist", async () => {
    const path1 = join(process.cwd(), "path", "path-enter");
    mockFS({});

    const content = "test";
    const result = await write_file(path1, content);

    expect(result.isOk()).toBe(false);
    mockFS.restore();
  });
});

describe.skip("write_file_sync", () => {
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
