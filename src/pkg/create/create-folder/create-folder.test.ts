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
import { make_create_folder, make_create_folder_sync } from "./create-folder";
import { make_new_path } from "../../../content";

const cwd = process.cwd();

describe("make_create_folder", () => {
  describe("mocking fs", () => {
    beforeEach(() => {
      mockFS();
    });

    afterEach(() => {
      mockFS.restore();
    });

    describe("with dry_run=false", () => {
      it("works with nested values", async () => {
        const { base_dir, in_dir, out_dir, first_nested, second_nested, arg } =
          setup(false);

        const func = make_create_folder();

        const new_path = await func({
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

        const func = make_create_folder();

        const new_path = await func({
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
      //
      it("calls hook if it is passed", async () => {
        const {
          base_dir,
          in_dir,
          out_dir,
          arg,
          first_nested,
          second_nested,
          first_var,
        } = setup();

        const func = make_create_folder();

        const mock_hook = vi.fn();

        const new_path = await func(
          {
            base_dir,
            in_dir,
            out_dir,
            vars: arg,
          },
          mock_hook
        );

        assert(new_path.isOk());
        expect(new_path.get()).toBe(
          join(out_dir, first_nested, second_nested, first_var)
        );

        expect(mock_hook).toHaveBeenCalledOnce();
        expect(mock_hook).toHaveBeenCalledWith({
          path: make_new_path({ base_dir, in_dir, out_dir, vars: arg }),
          dry_run: false,
        });
      });
      //
    });
    //

    describe("with dry_run=false", () => {
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

        const func = make_create_folder(mock);
        const new_path = await func({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
          dry_run: true,
        });

        assert(new_path.isOk());
        expect(new_path.get()).toBe(
          join(out_dir, first_nested, second_nested, first_var)
        );
        expect(mock).not.toHaveBeenCalled();
      });
    });
  });
  //
});

describe("make_create_folder_sync", () => {
  describe("mocking fs", () => {
    beforeEach(() => {
      mockFS();
    });

    afterEach(() => {
      mockFS.restore();
    });

    describe("with dry_run=false", () => {
      it("works with nested values", () => {
        const { base_dir, in_dir, out_dir, first_nested, second_nested, arg } =
          setup(false);

        const func = make_create_folder_sync();

        const new_path = func({
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

        const func = make_create_folder_sync();

        const new_path = func({
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
      //
      it("calls hook if it is passed", () => {
        const {
          base_dir,
          in_dir,
          out_dir,
          arg,
          first_nested,
          second_nested,
          first_var,
        } = setup();

        const func = make_create_folder_sync();

        const mock_hook = vi.fn();

        const new_path = func(
          {
            base_dir,
            in_dir,
            out_dir,
            vars: arg,
          },
          mock_hook
        );

        assert(new_path.isOk());
        expect(new_path.get()).toBe(
          join(out_dir, first_nested, second_nested, first_var)
        );

        expect(mock_hook).toHaveBeenCalledOnce();
        expect(mock_hook).toHaveBeenCalledWith({
          path: make_new_path({ base_dir, in_dir, out_dir, vars: arg }),
          dry_run: false,
        });
      });
      //
    });
    //

    describe("with dry_run=false", () => {
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

        const func = make_create_folder_sync(mock);
        const new_path = func({
          base_dir,
          in_dir,
          out_dir,
          vars: arg,
          dry_run: true,
        });

        assert(new_path.isOk());
        expect(new_path.get()).toBe(
          join(out_dir, first_nested, second_nested, first_var)
        );
        expect(mock).not.toHaveBeenCalled();
      });
    });
  });
  //
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
