import mockFS from "mock-fs";
import { join } from "node:path";
import { afterEach, assert, describe, expect, it, vi } from "vitest";
import { calc_path_existing } from "../../../utils";
import { make_mkdir, make_mkdir_sync } from "./make-directory";

const cwd = process.cwd();

describe("make_mkdir", () => {
  describe("async", () => {
    describe("with mocking fs", () => {
      afterEach(() => {
        mockFS.restore();
      });

      it("should work with right arguments", async () => {
        mockFS({});

        const path = join(cwd, "folder");
        const before_mkdir = calc_path_existing(path);

        const func = make_mkdir();
        const result = await func({ path });

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(true);
      });

      it("should work with right arguments and also in very nested environments", async () => {
        mockFS({});

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );
        const before_mkdir = calc_path_existing(path);

        const func = make_mkdir();
        const result = await func({ path });

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(true);
      });

      it("should not call function is dry_run is true", async () => {
        mockFS({});

        const path = join(cwd, "folder");

        const mock_func = vi.fn();

        const before_mkdir = calc_path_existing(path);

        const func = make_mkdir(mock_func);
        const result = await func({ path, dry_run: true });

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(false);

        expect(mock_func).not.toHaveBeenCalled();
      });

      it("should work with right arguments on_make_dir should have right arguments also", async () => {
        mockFS({});

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );
        const before_mkdir = calc_path_existing(path);
        const mock_func = vi.fn();

        const func = make_mkdir();
        const result = await func({ path }, mock_func);

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(true);
        expect(mock_func).toHaveBeenCalledOnce();
        expect(mock_func).toHaveBeenCalledWith({ path, dry_run: false });
      });

      it("should work with right arguments on_make_dir should have right arguments also (also with dry_run = true)", async () => {
        mockFS({});

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );
        const before_mkdir = calc_path_existing(path);
        const mock_func = vi.fn();

        const func = make_mkdir();
        const result = await func({ path, dry_run: true }, mock_func);

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(false);
        expect(mock_func).toHaveBeenCalledOnce();
        expect(mock_func).toHaveBeenCalledWith({ path, dry_run: true });
      });
    });

    describe("without real mocking fs", () => {
      it("should work with right arguments", async () => {
        const mock_mkdir = vi.fn();

        const path = join(cwd, "folder");

        const func = make_mkdir(mock_mkdir);
        const result = await func({ path });

        assert(result.isOk());
        expect(mock_mkdir).toHaveBeenCalledOnce();
        expect(mock_mkdir).toHaveBeenCalledWith(path, { recursive: true });
      });

      it("should work with right arguments and also in very nested environments", async () => {
        const mock_mkdir = vi.fn();

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir(mock_mkdir);
        const result = await func({ path });

        assert(result.isOk());
        expect(mock_mkdir).toHaveBeenCalledOnce();
        expect(mock_mkdir).toHaveBeenCalledWith(path, { recursive: true });
      });

      //
      it("should work with right arguments but never call the mock if dry_run = true", async () => {
        const mock_mkdir = vi.fn();

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir(mock_mkdir);
        const result = await func({ path, dry_run: true });

        assert(result.isOk());
        expect(mock_mkdir).not.toHaveBeenCalled();
      });

      //
      it("should work with right arguments but never call the mock if dry_run = true, but still calls on_mkdir", async () => {
        const mock_mkdir = vi.fn();
        const mock_on_mkdir = vi.fn();

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir(mock_mkdir);
        const result = await func(
          {
            path,
            dry_run: true,
          },
          mock_on_mkdir
        );

        assert(result.isOk());
        expect(mock_mkdir).not.toHaveBeenCalled();
        expect(mock_on_mkdir).toHaveBeenCalledOnce();
        expect(mock_on_mkdir).toHaveBeenCalledWith({ path, dry_run: true });
      });

      //
      it("should work with right arguments and still calls on_mkdir", async () => {
        const mock_mkdir = vi.fn();
        const mock_on_mkdir = vi.fn();

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir(mock_mkdir);
        const result = await func(
          {
            path,
          },
          mock_on_mkdir
        );

        assert(result.isOk());
        expect(mock_mkdir).toHaveBeenCalled();
        expect(mock_on_mkdir).toHaveBeenCalledOnce();
        expect(mock_on_mkdir).toHaveBeenCalledWith({ path, dry_run: false });
      });

      //
      it("should deal with errors", async () => {
        const err = new Error("Boom");
        const mock_mkdir = vi.fn().mockRejectedValue(err);

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir(mock_mkdir);
        const result = await func({
          path,
        });

        assert(result.isError());
        expect(result.getError()).toEqual(err);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(mock_mkdir).toHaveBeenCalled();
        expect(mock_mkdir).toHaveBeenCalledWith(path, { recursive: true });
      });

      //
    });
  });

  describe("sync", () => {
    describe("with mocking fs", () => {
      afterEach(() => {
        mockFS.restore();
      });

      it("should work with right arguments", () => {
        mockFS({});

        const path = join(cwd, "folder");
        const before_mkdir = calc_path_existing(path);

        const func = make_mkdir_sync();
        const result = func({ path });

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(true);
      });

      it("should work with right arguments and also in very nested environments", () => {
        mockFS({});

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );
        const before_mkdir = calc_path_existing(path);

        const func = make_mkdir_sync();
        const result = func({ path });

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(true);
      });

      it("should not call function is dry_run is true", () => {
        mockFS({});

        const path = join(cwd, "folder");

        const mock_func = vi.fn();

        const before_mkdir = calc_path_existing(path);

        const func = make_mkdir_sync(mock_func);
        const result = func({ path, dry_run: true });

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(false);

        expect(mock_func).not.toHaveBeenCalled();
      });

      it("should work with right arguments on_make_dir should have right arguments also", () => {
        mockFS({});

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );
        const before_mkdir = calc_path_existing(path);
        const mock_func = vi.fn();

        const func = make_mkdir_sync();
        const result = func({ path }, mock_func);

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(true);
        expect(mock_func).toHaveBeenCalledOnce();
        expect(mock_func).toHaveBeenCalledWith({ path, dry_run: false });
      });

      it("should work with right arguments on_make_dir should have right arguments also (also with dry_run = true)", () => {
        mockFS({});

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );
        const before_mkdir = calc_path_existing(path);
        const mock_func = vi.fn();

        const func = make_mkdir_sync();
        const result = func({ path, dry_run: true }, mock_func);

        const after_mkdir = calc_path_existing(path);

        assert(result.isOk());

        expect(before_mkdir).toBe(false);
        expect(after_mkdir).toBe(false);
        expect(mock_func).toHaveBeenCalledOnce();
        expect(mock_func).toHaveBeenCalledWith({ path, dry_run: true });
      });
    });

    describe("without real mocking fs", () => {
      it("should work with right arguments", () => {
        const mock_mkdir = vi.fn();

        const path = join(cwd, "folder");

        const func = make_mkdir_sync(mock_mkdir);
        const result = func({ path });

        assert(result.isOk());
        expect(mock_mkdir).toHaveBeenCalledOnce();
        expect(mock_mkdir).toHaveBeenCalledWith(path, { recursive: true });
      });

      it("should work with right arguments and also in very nested environments", () => {
        const mock_mkdir = vi.fn();

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir_sync(mock_mkdir);
        const result = func({ path });

        assert(result.isOk());
        expect(mock_mkdir).toHaveBeenCalledOnce();
        expect(mock_mkdir).toHaveBeenCalledWith(path, { recursive: true });
      });

      //
      it("should work with right arguments but never call the mock if dry_run = true", () => {
        const mock_mkdir = vi.fn();

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir_sync(mock_mkdir);
        const result = func({ path, dry_run: true });

        assert(result.isOk());
        expect(mock_mkdir).not.toHaveBeenCalled();
      });

      //
      it("should work with right arguments but never call the mock if dry_run = true, but still calls on_mkdir", () => {
        const mock_mkdir = vi.fn();
        const mock_on_mkdir = vi.fn();

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir_sync(mock_mkdir);
        const result = func(
          {
            path,
            dry_run: true,
          },
          mock_on_mkdir
        );

        assert(result.isOk());
        expect(mock_mkdir).not.toHaveBeenCalled();
        expect(mock_on_mkdir).toHaveBeenCalledOnce();
        expect(mock_on_mkdir).toHaveBeenCalledWith({ path, dry_run: true });
      });

      //
      it("should work with right arguments and still calls on_mkdir", () => {
        const mock_mkdir = vi.fn();
        const mock_on_mkdir = vi.fn();

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir_sync(mock_mkdir);
        const result = func(
          {
            path,
          },
          mock_on_mkdir
        );

        assert(result.isOk());
        expect(mock_mkdir).toHaveBeenCalled();
        expect(mock_on_mkdir).toHaveBeenCalledOnce();
        expect(mock_on_mkdir).toHaveBeenCalledWith({ path, dry_run: false });
      });

      //
      it("should deal with errors", () => {
        const err = new Error("Boom");
        const mock_mkdir = vi.fn().mockImplementation(() => {
          throw err;
        });

        const path = join(
          cwd,
          "folder",
          "another",
          "does",
          "not",
          "matter",
          "just",
          "an",
          "example"
        );

        const func = make_mkdir_sync(mock_mkdir);
        const result = func({
          path,
        });

        assert(result.isError());
        expect(result.getError()).toEqual(err);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(mock_mkdir).toHaveBeenCalled();
        expect(mock_mkdir).toHaveBeenCalledWith(path, { recursive: true });
      });

      //
    });
  });
});
