import { describe, expect, it, vi } from "vitest";
import { join } from "node:path";
import mockFS from "mock-fs";
import { read_file, read_file_sync } from "./read-file";

describe("read_file", () => {
  describe("sync", () => {
    it("actually runs fs module and reads file", () => {
      const file_name = "file.js";
      const file = join(process.cwd(), file_name);
      const content = "HELLO";
      mockFS({
        [file]: content,
      });

      const result = read_file_sync(file);

      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(content);

      mockFS.restore();
    });

    it("failes if file doesnt exist?", () => {
      const file_name = "file.js";
      const file = join(process.cwd(), file_name);
      const content = "HELLO";
      mockFS({
        [file + "hello"]: content,
      });

      const result = read_file_sync(file);

      expect(result.isError()).toBe(true);
      expect(result.value).toBeInstanceOf(Error);

      mockFS.restore();
    });

    it("fails if file doesnt exist?", () => {
      const read_file_mock = vi.fn();
      const file_name = "file.js";
      const file = join(process.cwd(), file_name);

      read_file_sync(file, read_file_mock);
      expect(read_file_mock).toHaveBeenCalledOnce();
      expect(read_file_mock).toHaveBeenCalledWith(file, { encoding: "utf-8" });
    });

    it("if injected function errors out, has mechanism to go around", () => {
      const read_file_mock = vi.fn().mockImplementation(() => {
        throw new Error("oopsie");
      });
      const file_name = "file.js";
      const file = join(process.cwd(), file_name);

      const result = read_file_sync(file, read_file_mock);
      expect(read_file_mock).toHaveBeenCalledOnce();
      expect(result.isError()).toBe(true);
    });
  });

  describe("async", () => {
    it("actually runs fs module and reads file", async () => {
      const file_name = "file.js";
      const file = join(process.cwd(), file_name);
      const content = "HELLO";
      mockFS({
        [file]: content,
      });

      const result = await read_file(file);

      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(content);

      mockFS.restore();
    });

    it("failes if file doesnt exist?", async () => {
      const file_name = "file.js";
      const file = join(process.cwd(), file_name);
      const content = "HELLO";
      mockFS({
        [file + "hello"]: content,
      });

      const result = await read_file(file);

      expect(result.isError()).toBe(true);
      expect(result.value).toBeInstanceOf(Error);

      mockFS.restore();
    });

    it("fails if file doesnt exist?", async () => {
      const read_file_mock = vi.fn();
      const file_name = "file.js";
      const file = join(process.cwd(), file_name);

      await read_file(file, read_file_mock);
      expect(read_file_mock).toHaveBeenCalledOnce();
      expect(read_file_mock).toHaveBeenCalledWith(file, { encoding: "utf-8" });
    });

    it("if injected function errors out, has mechanism to go around", async () => {
      const read_file_mock = vi.fn().mockRejectedValue(new Error("Oopsie"));

      const file_name = "file.js";
      const file = join(process.cwd(), file_name);

      const result = await read_file(file, read_file_mock);
      expect(read_file_mock).toHaveBeenCalledOnce();
      expect(result.isError()).toBe(true);
    });
  });
});
