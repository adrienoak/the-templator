import mockFS from "mock-fs";
import { afterEach, assert, describe, expect, it, vi } from "vitest";
import { Vars } from "../../module/validator";
import { join, sep } from "node:path";
import { create_file, create_file_sync } from "./create-file";
import { read_file, read_file_sync } from "../../module/fs";
import { make_new_path } from "../../content";
import { contentParser } from "string-template-parse";

const cwd = process.cwd();
afterEach(() => {
  mockFS.restore();
});
describe("create-file", () => {
  describe("sync", () => {
    describe("dry_run_false", () => {
      it("works with simple values without with files with weird names", () => {
        const { arg, base_dir, in_dir, out_dir, clean_internal_path } = setup(
          5,
          true
        );

        const without_file_name = retrieve_file_name({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        mockFS({
          [without_file_name]: {},
        });

        const override = `Hello, there`;

        const new_path = create_file_sync({
          base_dir,
          in_dir,
          out_dir,
          content: override,
          vars: arg,
        });

        assert(new_path.isOk());

        const read_content = read_file_sync(new_path.get());

        assert(read_content.isOk());

        expect(read_content.get()).toBe(override);

        expect(join(out_dir, ...clean_internal_path)).toBe(new_path.get());

        mockFS.restore();
      });

      it("works with simple values without templates", () => {
        const { arg, base_dir, in_dir, out_dir } = setup(5);

        const without_file_name = retrieve_file_name({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        mockFS({
          [without_file_name]: {},
        });

        const override = `Hello, there`;

        const new_path = create_file_sync({
          base_dir,
          in_dir,
          out_dir,
          content: override,
          vars: arg,
        });

        assert(new_path.isOk());

        const read_content = read_file_sync(new_path.get());

        assert(read_content.isOk());

        expect(read_content.get()).toBe(override);

        mockFS.restore();
      });

      it("works with simple values", () => {
        const { arg, base_dir, in_dir, out_dir, first_key, first_var } =
          setup(5);

        const without_file_name = retrieve_file_name({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        mockFS({
          [without_file_name]: {},
        });

        const override = `{{${first_key}}}`;

        const new_path = create_file_sync({
          base_dir,
          in_dir,
          out_dir,
          content: override,
          vars: arg,
        });

        assert(new_path.isOk());

        const read_content = read_file_sync(new_path.get());

        assert(read_content.isOk());

        expect(read_content.get()).toBe(first_var);

        mockFS.restore();
      });

      it("works with  nested values and variables", () => {
        const { arg, base_dir, in_dir, out_dir, first_key, first_var } =
          setup();

        const without_file_name = retrieve_file_name({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        mockFS({
          [without_file_name]: {},
        });

        const override = `Hello there, how are you? {{${first_key}}}`;

        const new_path = create_file_sync({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
          content: override,
        });
        assert(new_path.isOk());

        const read_content = read_file_sync(new_path.get());

        assert(read_content.isOk());

        expect(read_content.get()).toBe(
          `Hello there, how are you? ${first_var}`
        );

        mockFS.restore();
      });
    });

    describe("dry_run_true", () => {
      it("works with  nested values and variables", () => {
        const { base_dir, in_dir, out_dir, arg, clean_internal_path } = setup();

        const mock = vi.fn();

        const new_path = create_file_sync(
          {
            base_dir,
            in_dir,
            out_dir,
            vars: arg,
            content: "Hello there",
          },
          {
            dry_run_option: true,
            create_file_func: mock,
          }
        );

        assert(new_path.isOk());
        expect(new_path.get()).toBe(join(out_dir, ...clean_internal_path));
        expect(mock).not.toHaveBeenCalled();
      });
    });
  });

  describe("async", () => {
    describe("dry_run_false", () => {
      it("works with simple values without with files with weird names", async () => {
        const { arg, base_dir, in_dir, out_dir, clean_internal_path } = setup(
          5,
          true
        );

        const without_file_name = retrieve_file_name({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        mockFS({
          [without_file_name]: {},
        });

        const override = `Hello, there`;

        const new_path = await create_file({
          base_dir,
          in_dir,
          out_dir,
          content: override,
          vars: arg,
        });

        assert(new_path.isOk());

        const read_content = await read_file(new_path.get());

        assert(read_content.isOk());

        expect(read_content.get()).toBe(override);

        expect(join(out_dir, ...clean_internal_path)).toBe(new_path.get());

        mockFS.restore();
      });

      it("works with simple values without templates", async () => {
        const { arg, base_dir, in_dir, out_dir } = setup(5);

        const without_file_name = retrieve_file_name({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        mockFS({
          [without_file_name]: {},
        });

        const override = `Hello, there`;

        const new_path = await create_file({
          base_dir,
          in_dir,
          out_dir,
          content: override,
          vars: arg,
        });

        assert(new_path.isOk());

        const read_content = await read_file(new_path.get());

        assert(read_content.isOk());

        expect(read_content.get()).toBe(override);

        mockFS.restore();
      });

      it("works with simple values", async () => {
        const { arg, base_dir, in_dir, out_dir, first_key, first_var } =
          setup(5);

        const without_file_name = retrieve_file_name({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        mockFS({
          [without_file_name]: {},
        });

        const override = `{{${first_key}}}`;

        const new_path = await create_file({
          base_dir,
          in_dir,
          out_dir,
          content: override,
          vars: arg,
        });

        assert(new_path.isOk());

        const read_content = await read_file(new_path.get());

        assert(read_content.isOk());

        expect(read_content.get()).toBe(first_var);

        mockFS.restore();
      });

      it("works with  nested values and variables", async () => {
        const { arg, base_dir, in_dir, out_dir, first_key, first_var } =
          setup();

        const without_file_name = retrieve_file_name({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        mockFS({
          [without_file_name]: {},
        });

        const override = `Hello there, how are you? {{${first_key}}}`;

        const new_path = await create_file({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
          content: override,
        });
        assert(new_path.isOk());

        const read_content = await read_file(new_path.get());

        assert(read_content.isOk());

        expect(read_content.get()).toBe(
          `Hello there, how are you? ${first_var}`
        );

        mockFS.restore();
      });
    });

    describe("dry_run_true", () => {
      it("works with  nested values and variables", async () => {
        const { base_dir, in_dir, out_dir, arg, clean_internal_path } = setup();

        const mock = vi.fn();

        const new_path = await create_file(
          {
            base_dir,
            in_dir,
            out_dir,
            vars: arg,
            content: "Hello there",
          },
          {
            dry_run_option: true,
            create_file_func: mock,
          }
        );

        assert(new_path.isOk());
        expect(new_path.get()).toBe(join(out_dir, ...clean_internal_path));
        expect(mock).not.toHaveBeenCalled();
      });
    });
  });
});

// path comes with a filename. this removes and gets just the folder path
function retrieve_file_name({
  base_dir,
  in_dir,
  out_dir,
  vars,
}: Parameters<typeof make_new_path>[0]) {
  const new_path_defined = make_new_path({
    base_dir,
    in_dir,
    out_dir,
    vars,
  });

  return new_path_defined.split(sep).slice(0, -1).join(sep);
}

function build_path(how_many: number, file_name?: string) {
  return new Array(how_many + 1).fill(1).map((el, i, { length: l }) => {
    if (l - 1 === i) {
      return file_name ? file_name : `path-${i}.js`;
    }

    return `path-${i + 1}`;
  });
}

function setup(how_many: number = 2, file_name?: boolean) {
  const first_key = "name";
  const first_var = "var";
  const arg: Vars = {
    [first_key]: first_var,
  };
  const out_str = "out";

  const base_dir = join(cwd, "folder");
  const internal_path = build_path(
    how_many,
    file_name ? `{{${first_key}}}.js` : undefined
  );

  const clean_internal_path = internal_path.map((e) => contentParser(e, arg));

  const in_dir = join(base_dir, ...internal_path);
  const out_dir = join(cwd, out_str);

  return {
    first_var,
    arg,
    out_dir,
    out_str,
    in_dir,
    base_dir,
    first_key,
    internal_path,
    clean_internal_path,
  };
}
