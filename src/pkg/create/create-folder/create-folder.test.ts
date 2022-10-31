import mockFS from "mock-fs";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Vars } from "../../../module/validator";
import { join } from "node:path";
import { create_folder, create_folder_sync } from "./create-folder";

const cwd = process.cwd();
describe("create-folder", () => {
  beforeEach(() => {
    mockFS();
  });

  afterEach(() => {
    mockFS.restore();
  });

  describe("async", () => {
    describe("dry_run_false", () => {
      it("works with  nested values", async () => {
        const { base_dir, in_dir, out_dir, first_nested, second_nested, arg } =
          setup(false);

        const new_path = await create_folder({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        assert(new_path.isOk());
        expect(new_path.get()).toBe(join(out_dir, first_nested, second_nested));
      });
      it("works with  nested values and variables", async () => {
        const {
          base_dir,
          in_dir,
          out_dir,
          arg,
          first_nested,
          second_nested,
          first_var,
        } = setup();

        const new_path = await create_folder({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        assert(new_path.isOk());
        expect(new_path.get()).toBe(
          join(out_dir, first_nested, second_nested, first_var)
        );
      });
    });

    describe("dry_run_true", () => {
      it("works with  nested values and variables", async () => {
        const {
          base_dir,
          in_dir,
          out_dir,
          arg,
          first_nested,
          second_nested,
          first_var,
        } = setup();

        const mock = vi.fn();

        const new_path = await create_folder(
          {
            base_dir,
            in_dir,
            out_dir,
            vars: arg,
          },
          {
            dry_run_option: true,
            make_dir_func: mock,
          }
        );

        assert(new_path.isOk());
        expect(new_path.get()).toBe(
          join(out_dir, first_nested, second_nested, first_var)
        );
        expect(mock).not.toHaveBeenCalled();
      });
    });
  });

  describe("sync", () => {
    describe("dry_run_false", () => {
      it("works with  nested values", () => {
        const { base_dir, in_dir, out_dir, first_nested, second_nested, arg } =
          setup(false);

        const new_path = create_folder_sync({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        assert(new_path.isOk());
        expect(new_path.get()).toBe(join(out_dir, first_nested, second_nested));
      });
      it("works with  nested values and variables", () => {
        const {
          base_dir,
          in_dir,
          out_dir,
          arg,
          first_nested,
          second_nested,
          first_var,
        } = setup();

        const new_path = create_folder_sync({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
        });

        assert(new_path.isOk());
        expect(new_path.get()).toBe(
          join(out_dir, first_nested, second_nested, first_var)
        );
      });
    });

    describe("dry_run_true", () => {
      it("works with  nested values and variables", () => {
        const {
          base_dir,
          in_dir,
          out_dir,
          arg,
          first_nested,
          second_nested,
          first_var,
        } = setup();

        const mock = vi.fn();

        const new_path = create_folder_sync(
          {
            base_dir,
            in_dir,
            out_dir,
            vars: arg,
          },
          {
            dry_run_option: true,
            make_dir_func: mock,
          }
        );

        assert(new_path.isOk());
        expect(new_path.get()).toBe(
          join(out_dir, first_nested, second_nested, first_var)
        );
        expect(mock).not.toHaveBeenCalled();
      });
    });
  });
});

function setup(with_var = true) {
  const first_key = "name";
  const first_var = "var";
  const arg: Vars = {
    [first_key]: first_var,
  };
  const out_str = "out";

  const [first_nested, second_nested] = ["path-1", "path-2"];

  const base_dir = join(cwd, "folder");
  const in_dir = join(
    base_dir,
    first_nested,
    second_nested,
    with_var ? `{{${first_key}}}` : ""
  );
  const out_dir = join(cwd, out_str);

  return {
    first_var,
    arg,
    out_dir,
    out_str,
    in_dir,
    base_dir,
    first_nested,
    second_nested,
  };
}
