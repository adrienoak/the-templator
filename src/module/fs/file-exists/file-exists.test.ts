import { describe, expect, it, vi } from "vitest";
import { join } from "node:path";
import mockFS from "mock-fs";
import { file_exists } from "./index";
import { make_file_exists } from "./file-exists";

const base_path = process.cwd();

describe("make_file_exists", () => {
  describe("with fs mocking and no function mocking", () => {
    it("actual calls fs and checks validity. returns true if file is there", () => {
      const file = "file.js";
      const file_content = "file";

      mockFS({ [join(process.cwd(), file)]: file_content });

      const fake_file = join(base_path, file);

      const result = file_exists(fake_file);

      expect(result).toBe(true);

      mockFS.restore();
    });

    it("actual calls fs and checks validity. returns false if file is not there", () => {
      const file = "file2.js";
      const file_content = "file";

      mockFS({ [file]: file_content });

      const fake_file = join(base_path, file.slice(1));

      const result = file_exists(fake_file);

      expect(result).toBe(false);

      mockFS.restore();
    });

    it("actually calls fs and checks validity dealing with error", () => {
      const file = "file2.js";
      const file_content = "file";

      mockFS({ [file]: file_content });

      const fake_file = join(
        base_path,
        file.slice(1),
        "something_else",
        "literally_does_not_matter"
      );

      const result = file_exists(fake_file);

      expect(result).toBe(false);

      mockFS.restore();
    });

    it("actually calls fs and checks validity dealing with error, with on_file_exists", () => {
      const file = "file2.js";
      const file_content = "file";

      mockFS({ [file]: file_content });

      const fake_file = join(
        base_path,
        file.slice(1),
        "something_else",
        "literally_does_not_matter"
      );

      const mock = vi.fn();

      const result = file_exists(fake_file, mock);

      expect(result).toBe(false);
      expect(mock).toHaveBeenCalledOnce();

      expect(mock).toHaveBeenCalledWith(fake_file, false);

      mockFS.restore();
    });

    it("actually calls fs and checks validity on_success, with on_file_exists", () => {
      const file = "file.js";
      const file_content = "file";

      mockFS({ [join(process.cwd(), file)]: file_content });

      const fake_file = join(base_path, file);

      const mock = vi.fn();

      const result = file_exists(fake_file, mock);

      expect(result).toBe(true);
      expect(mock).toHaveBeenCalledOnce();

      expect(mock).toHaveBeenCalledWith(fake_file, true);

      mockFS.restore();
    });
  });

  describe("with function mock", () => {
    it("calls function with the right args", () => {
      const mock = vi.fn().mockImplementation(() => true);

      const fake_file = join(base_path, "file.js");

      const func = make_file_exists(mock);

      const result = func(fake_file);

      expect(result).toBe(true);
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(fake_file);
    });

    it("calls function with the right arguments, but if it returns false, then there is no file", () => {
      const mock = vi.fn().mockImplementation(() => false);

      const fake_file = join(base_path, "file.js");

      const func = make_file_exists(mock);

      const result = func(fake_file);

      expect(result).toBe(false);
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(fake_file);
    });

    it("deals with errors throws for some reason", () => {
      const mock = vi.fn().mockImplementation(() => {
        throw new Error("something is wrong");
      });

      const fake_file = join(base_path, "file.js");

      const func = make_file_exists(mock);

      const result = func(fake_file);

      expect(result).toBe(false);
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(fake_file);
    });

    it("on_file_exist in case of true", () => {
      const mock = vi.fn().mockImplementation(() => true);

      const fake_file = join(base_path, "file.js");

      const func = make_file_exists(mock);

      const mock_on_file_exists = vi.fn();

      const result = func(fake_file, mock_on_file_exists);

      expect(result).toBe(true);
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(fake_file);
      expect(mock_on_file_exists).toHaveBeenCalledOnce();
      expect(mock_on_file_exists).toHaveBeenCalledWith(fake_file, true);
    });

    it("on_file_exist in case of false", () => {
      const mock = vi.fn().mockImplementation(() => false);

      const fake_file = join(base_path, "file.js");

      const func = make_file_exists(mock);

      const mock_on_file_exists = vi.fn();

      const result = func(fake_file, mock_on_file_exists);

      expect(result).toBe(false);
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(fake_file);
      expect(mock_on_file_exists).toHaveBeenCalledOnce();
      expect(mock_on_file_exists).toHaveBeenCalledWith(fake_file, false);
    });

    it("on_file_exist in case of error", () => {
      const mock = vi.fn().mockImplementation(() => {
        throw new Error("something is wrong");
      });

      const fake_file = join(base_path, "file.js");

      const func = make_file_exists(mock);

      const mock_on_file_exists = vi.fn();

      const result = func(fake_file, mock_on_file_exists);

      expect(result).toBe(false);
      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(fake_file);
      expect(mock_on_file_exists).toHaveBeenCalledOnce();
      expect(mock_on_file_exists).toHaveBeenCalledWith(fake_file, false);
    });
  });
});
