import mockFS from "mock-fs";
import { join } from "node:path";
import { afterEach, assert, describe, expect, it, vi } from "vitest";
import { calc_path_existing } from "../../../utils";
import { file_exists } from "../file-exists";
import { read_file, read_file_sync } from "../read-file";
import { make_write_file, make_write_file_sync } from "./write-file";

const base_path = process.cwd();

describe("make_write_file", () => {
  describe("with mocking fs", () => {
    afterEach(() => {
      mockFS.restore();
    });

    it("works correctly", async () => {
      mockFS({});
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const exists_before = file_exists(path);

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
      mockFS({});
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";
      const mock_func = vi.fn();

      const exists_before = file_exists(path);

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

  describe("without mocking fs", () => {
    it("works correctly", async () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const mock = vi.fn();

      const func = make_write_file({ write_file_func: mock });

      const result = await func({ path, content });

      assert(result.isOk());
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(path, content, { encoding: "utf-8" });
    });

    it("if it initially errors out with a unreachable path, it first creates the paths", async () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const write_file_func = vi.fn().mockRejectedValueOnce({ code: "enoent" });
      const make_dir_func = vi.fn();

      const func = make_write_file({ write_file_func, make_dir_func });

      const result = await func({ path, content });

      assert(result.isOk());
      expect(make_dir_func).toHaveBeenCalledOnce();
      expect(write_file_func).toHaveBeenCalledTimes(2);
      expect(write_file_func).toHaveBeenCalledWith(path, content, {
        encoding: "utf-8",
      });
    });

    //
    it("if it initially errors out with some other error, it should just be handled by the Result", async () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const write_file_func = vi.fn().mockRejectedValueOnce(new Error());
      const make_dir_func = vi.fn();

      const func = make_write_file({ write_file_func, make_dir_func });

      const result = await func({ path, content });

      assert(result.isError());
      expect(make_dir_func).not.toHaveBeenCalled();
      expect(write_file_func).toHaveBeenCalledOnce();
      expect(write_file_func).toHaveBeenCalledWith(path, content, {
        encoding: "utf-8",
      });
    });

    //
    it("no function ever gets called in case of dry_run=true", async () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const write_file_func = vi.fn().mockRejectedValueOnce(new Error());
      const make_dir_func = vi.fn();

      const func = make_write_file({ write_file_func, make_dir_func });

      const result = await func({ path, content, dry_run: true });

      assert(result.isOk());
      expect(make_dir_func).not.toHaveBeenCalled();
      expect(write_file_func).not.toHaveBeenCalled();
    });

    //
  });
});

describe("make_write_file_sync", () => {
  describe("with mocking fs", () => {
    afterEach(() => {
      mockFS.restore();
    });

    it("works correctly", () => {
      mockFS({});
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const exists_before = file_exists(path);

      const func = make_write_file_sync();

      const result = func({ path, content });
      const exists_after = file_exists(path);

      const after_file_content = read_file_sync(path);

      expect(exists_before).toBe(false);
      expect(exists_after).toBe(true);
      expect(after_file_content.isOk() && after_file_content.get()).toBe(
        content
      );

      expect(result.isOk()).toBe(true);
    });

    it("does not call the function if dry_run is true", () => {
      mockFS({});
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";
      const mock_func = vi.fn();

      const exists_before = file_exists(path);

      const func = make_write_file_sync({ write_file_func: mock_func });

      const result = func({ path, content, dry_run: true });
      const exists_after = file_exists(path);

      expect(exists_before).toBe(false);
      expect(exists_after).toBe(false);
      expect(mock_func).not.toHaveBeenCalled();

      expect(result.isOk()).toBe(true);
    });

    it("if path does not exist, mounts filepath until there", () => {
      mockFS({});
      const file = "file.js";
      const path = join(base_path, "something-else", "something", file);

      const all_there_before = calc_path_existing(path);

      const content = "test";

      const func = make_write_file_sync();

      const result = func({
        path,
        content,
      });

      const read_content = read_file_sync(path);

      const all_there_after = calc_path_existing(path);

      expect(result.isOk()).toBe(true);
      expect(all_there_before).toBe(false);
      expect(all_there_after).toBe(true);
      expect(read_content.isOk() && read_content.get()).toBe(content);
    });
  });

  describe("without mocking fs", () => {
    it("works correctly", () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const mock = vi.fn();

      const func = make_write_file_sync({ write_file_func: mock });

      const result = func({ path, content });

      assert(result.isOk());
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(path, content, { encoding: "utf-8" });
    });

    it("if it initially errors out with a unreachable path, it first creates the paths", () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const write_file_func = vi.fn().mockImplementationOnce(() => {
        throw { code: "enoent" };
      });
      const make_dir_func = vi.fn();

      const func = make_write_file_sync({ write_file_func, make_dir_func });

      const result = func({ path, content });

      assert(result.isOk());
      expect(make_dir_func).toHaveBeenCalledOnce();
      expect(write_file_func).toHaveBeenCalledTimes(2);
      expect(write_file_func).toHaveBeenCalledWith(path, content, {
        encoding: "utf-8",
      });
    });

    //
    it("if it initially errors out with some other error, it should just be handled by the Result", () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const write_file_func = vi.fn().mockImplementationOnce(() => {
        throw new Error();
      });
      const make_dir_func = vi.fn();

      const func = make_write_file_sync({ write_file_func, make_dir_func });

      const result = func({ path, content });

      assert(result.isError());
      expect(make_dir_func).not.toHaveBeenCalled();
      expect(write_file_func).toHaveBeenCalledOnce();
      expect(write_file_func).toHaveBeenCalledWith(path, content, {
        encoding: "utf-8",
      });
    });

    //
    it("no function ever gets called in case of dry_run=true", () => {
      const file = "file.js";
      const path = join(base_path, file);
      const content = "test";

      const write_file_func = vi.fn().mockImplementation(() => {
        throw new Error();
      });
      const make_dir_func = vi.fn();

      const func = make_write_file_sync({ write_file_func, make_dir_func });

      const result = func({ path, content, dry_run: true });

      assert(result.isOk());
      expect(make_dir_func).not.toHaveBeenCalled();
      expect(write_file_func).not.toHaveBeenCalled();
    });

    //
  });
});
