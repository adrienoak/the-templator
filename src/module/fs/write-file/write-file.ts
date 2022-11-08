import { Result } from "@swan-io/boxed";
import { writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { make_dir, make_dir_sync } from "../make-directory/index";
import {
  handle_error_write_file,
  handle_error_write_file_sync,
} from "./write-file.errors";
import { AsyncTest, SyncTest } from "./write-file.types";

export const make_write_file: AsyncTest.Func = (deps = {}) => {
  const { write_file_func = writeFile, make_dir_func = make_dir } = deps;

  return async ({ content, path, dry_run = false }, hooks = {}) => {
    const { on_mkdir, on_write_file } = hooks;
    const on_result = () =>
      on_write_file ? on_write_file({ content, path, dry_run }) : () => {};

    if (!dry_run) {
      const written_result = await Result.fromPromise(
        write_file_func(path, content, { encoding: "utf-8" })
      );

      if (written_result.isError()) {
        const another_test = await handle_error_write_file({
          content,
          err: written_result.getError(),
          make_dir_func,
          path,
          write_file_func,
          on_mkdir,
          on_write_file,
        });

        on_result();

        return another_test;
      }
    }

    on_result();

    return Result.Ok(undefined);
  };
};

export const make_write_file_sync: SyncTest.Func = (deps = {}) => {
  const { make_dir_func = make_dir_sync, write_file_func = writeFileSync } =
    deps;

  return ({ content, path, dry_run = false }, hooks = {}) => {
    const { on_mkdir, on_write_file } = hooks;

    const on_result = () =>
      on_write_file ? on_write_file({ content, path, dry_run }) : () => {};

    if (!dry_run) {
      const written_result = Result.fromExecution(() =>
        write_file_func(path, content, { encoding: "utf-8" })
      );

      if (written_result.isError()) {
        const another_test = handle_error_write_file_sync({
          content,
          err: written_result.getError(),
          make_dir_func,
          path,
          write_file_func,
          on_mkdir,
          on_write_file,
        });

        on_result();

        return another_test;
      }
    }

    on_result();

    return Result.Ok(undefined);
  };
};
