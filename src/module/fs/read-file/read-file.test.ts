import mockFS from "mock-fs";
import { join } from "node:path";
import { afterEach, assert, describe, expect, it, vi } from "vitest";
import { make_read_file, make_read_file_sync } from "./read-file";

const base_path = process.cwd();

describe("make_read_file", () => {
  describe("with mocking filesystem", () => {
    afterEach(() => {
      mockFS.restore();
    });

    it("runs correctly, if everything is correct (arguments and paths, and all that jazz)", async () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);

      const content = "Hello";

      mockFS({
        [file]: content,
      });

      const func = make_read_file();

      const result = await func(file);

      assert(result.isOk());
      expect(result.get()).toBe(content);
    });

    it("deals with error in result class in case something is not there? ", async () => {
      mockFS({});

      const file_name = "file.js";
      const file = join(base_path, file_name);

      const func = make_read_file();

      const result = await func(file);

      assert(result.isError());
    });

    it("calls on_read if passed", async () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);
      const mock = vi.fn();

      const content = "Hello";

      mockFS({
        [file]: content,
      });

      const func = make_read_file();

      const result = await func(file, mock);

      assert(result.isOk());
      expect(result.get()).toBe(content);
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(file);
    });
  });

  describe("wihout mocking filesystem", () => {
    it("runs correctly, if everything is correct (arguments and paths, and all that jazz)", async () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);

      const mock_read_file = vi.fn();

      const func = make_read_file(mock_read_file);

      const result = await func(file);

      assert(result.isOk());
      expect(mock_read_file).toHaveBeenCalledOnce();
      expect(mock_read_file).toHaveBeenCalledWith(file, { encoding: "utf-8" });
    });

    it("deals with error in result class in case something is not there? ", async () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);
      const err_example = new Error("oh oh");

      const mock_read_file = vi.fn().mockRejectedValue(err_example);

      const func = make_read_file(mock_read_file);

      const result = await func(file);

      assert(result.isError());
      expect(result.getError()).toEqual(err_example);
      expect(mock_read_file).toHaveBeenCalled();
    });

    it("calls on_read if passed", async () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);
      const mock = vi.fn();
      const mock_read_file = vi.fn();

      const func = make_read_file(mock_read_file);

      const result = await func(file, mock);

      assert(result.isOk());
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(file);
      expect(mock_read_file).toHaveBeenCalledOnce();
    });
  });
});

describe("make_read_file_sync", () => {
  describe("with mocking filesystem", () => {
    afterEach(() => {
      mockFS.restore();
    });

    it("runs correctly, if everything is correct (arguments and paths, and all that jazz)", () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);

      const content = "Hello";

      mockFS({
        [file]: content,
      });

      const func = make_read_file_sync();

      const result = func(file);

      assert(result.isOk());
      expect(result.get()).toBe(content);
    });

    it("deals with error in result class in case something is not there? ", () => {
      mockFS({});

      const file_name = "file.js";
      const file = join(base_path, file_name);

      const func = make_read_file_sync();

      const result = func(file);

      assert(result.isError());
    });

    it("calls on_read if passed", () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);
      const mock = vi.fn();

      const content = "Hello";

      mockFS({
        [file]: content,
      });

      const func = make_read_file_sync();

      const result = func(file, mock);

      assert(result.isOk());
      expect(result.get()).toBe(content);
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(file);
    });
  });

  describe("wihout mocking filesystem", () => {
    it("runs correctly, if everything is correct (arguments and paths, and all that jazz)", () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);

      const mock_read_file = vi.fn();

      const func = make_read_file_sync(mock_read_file);

      const result = func(file);

      assert(result.isOk());
      expect(mock_read_file).toHaveBeenCalledOnce();
      expect(mock_read_file).toHaveBeenCalledWith(file, { encoding: "utf-8" });
    });

    it("deals with error in result class in case something is not there? ", () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);
      const err_example = new Error("oh oh");

      const mock_read_file = vi.fn().mockImplementation(() => {
        throw err_example;
      });

      const func = make_read_file_sync(mock_read_file);

      const result = func(file);

      assert(result.isError());
      expect(result.getError()).toEqual(err_example);
      expect(mock_read_file).toHaveBeenCalled();
    });

    it("calls on_read if passed", () => {
      const file_name = "file.js";
      const file = join(base_path, file_name);
      const mock = vi.fn();
      const mock_read_file = vi.fn();

      const func = make_read_file_sync(mock_read_file);

      const result = func(file, mock);

      assert(result.isOk());
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(file);
      expect(mock_read_file).toHaveBeenCalledOnce();
    });
  });
});
