import { describe, expect, it, vi } from "vitest";
import { join, sep } from "node:path";
import mockFS from "mock-fs";
import { make_directory, make_directory_sync } from "./make-directory";
import { getAllFoldersSync } from "get-all-folders";

describe("make-directory", () => {
  describe("sync", () => {
    it("should go through mock", () => {
      mockFS({});

      const path = join(process.cwd(), "folder");

      const result = make_directory_sync(path);

      expect(result.isOk()).toBe(true);

      const folders = getAllFoldersSync({ basePath: process.cwd() });
      expect(folders.includes(path + sep)).toBe(true);

      mockFS.restore();
    });

    it("should go through mock and have nested impact also", () => {
      mockFS({});

      const path = join(process.cwd(), "folder");
      const nested_folder = join(path, "nested");

      const result = make_directory_sync(nested_folder);

      expect(result.isOk()).toBe(true);

      const folders = getAllFoldersSync({ basePath: process.cwd() });
      expect(folders.includes(path + sep)).toBe(true);
      expect(folders.includes(nested_folder + sep)).toBe(true);

      mockFS.restore();
    });

    it("should call mock correctly with right args", () => {
      const mock = vi.fn();

      const path = join(process.cwd(), "folder");
      const nested_folder = join(path, "nested");

      const result = make_directory_sync(nested_folder, mock);

      expect(result.isOk()).toBe(true);

      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(nested_folder, { recursive: true });
    });

    it("if mock fails should not throw and be caught by the result", () => {
      const err = new Error("Boom");
      const mock = vi.fn().mockImplementation(() => {
        throw err;
      });

      const path = join(process.cwd(), "folder");
      const nested_folder = join(path, "nested");

      const result = make_directory_sync(nested_folder, mock);

      expect(result.isOk()).toBe(false);

      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(nested_folder, { recursive: true });
      expect(result.value).toBeInstanceOf(Error);
      expect(result.value).toEqual(err);
    });
  });

  describe("async", () => {
    it("should go through mock", async () => {
      mockFS({});

      const path = join(process.cwd(), "folder");

      const result = await make_directory(path);

      expect(result.isOk()).toBe(true);

      const folders = getAllFoldersSync({ basePath: process.cwd() });
      expect(folders.includes(path + sep)).toBe(true);

      mockFS.restore();
    });

    it("should go through mock and have nested impact also", async () => {
      mockFS({});

      const path = join(process.cwd(), "folder");
      const nested_folder = join(path, "nested");

      const result = await make_directory(nested_folder);

      expect(result.isOk()).toBe(true);

      const folders = getAllFoldersSync({ basePath: process.cwd() });
      expect(folders.includes(path + sep)).toBe(true);
      expect(folders.includes(nested_folder + sep)).toBe(true);

      mockFS.restore();
    });

    it("should call mock correctly with right args", async () => {
      const mock = vi.fn();

      const path = join(process.cwd(), "folder");
      const nested_folder = join(path, "nested");

      const result = await make_directory(nested_folder, mock);

      expect(result.isOk()).toBe(true);

      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(nested_folder, { recursive: true });
    });

    it("if mock fails should not throw and be caught by the result", async () => {
      const err = new Error("Boom");
      const mock = vi.fn().mockRejectedValue(err);

      const path = join(process.cwd(), "folder");
      const nested_folder = join(path, "nested");

      const result = await make_directory(nested_folder, mock);

      expect(result.isOk()).toBe(false);

      expect(mock).toHaveBeenCalledOnce();
      expect(mock).toHaveBeenCalledWith(nested_folder, { recursive: true });
      expect(result.value).toBeInstanceOf(Error);
      expect(result.value).toEqual(err);
    });
  });
});
