import { Result } from "@swan-io/boxed";
import { mkdirSync, writeFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { IMakeDir, IMakeDirSync } from "../make-directory/index";
import {
  handle_error_write_file,
  handle_error_write_file_sync,
} from "./write-file.errors";
import { IWriteFile, IWriteFileSync } from "./write-file.types";

export const make_write_file: IWriteFile.Func = (deps = {}) => {
  const {
    write_file_func = writeFile,
    make_dir_func = mkdir as IMakeDir.MakeDirFunc,
  } = deps;
  return async ({ content, path, dry_run = false, on_write_content }) => {
    const on_result = () =>
      on_write_content
        ? on_write_content({ content, path, dry_run })
        : () => {};

    if (!dry_run) {
      const write = () => write_file_func(path, content, { encoding: "utf-8" });

      const written_result = await Result.fromPromise(write());

      if (written_result.isError()) {
        const another_test = await handle_error_write_file({
          err: written_result.getError(),
          content,
          path,
          write_file_func,
          make_dir_func,
        });

        on_result();

        return another_test;
      }

      on_result();

      return written_result;
    }

    on_result();

    return Result.Ok(undefined);
  };
};

export const make_write_file_sync: IWriteFileSync.Func = (deps = {}) => {
  const {
    write_file_func = writeFileSync,
    make_dir_func = mkdirSync as IMakeDirSync.MakeDirFunc,
  } = deps;

  return ({ content, path, dry_run = false, on_write_content }) => {
    const on_result = () =>
      on_write_content
        ? on_write_content({ content, path, dry_run })
        : () => {};

    if (!dry_run) {
      const written_result = Result.fromExecution(() =>
        write_file_func(path, content, { encoding: "utf-8" })
      );

      if (written_result.isError()) {
        const another_test = handle_error_write_file_sync({
          err: written_result.getError(),
          content,
          make_dir_func,
          path,
          write_file_func,
        });

        on_result();

        return another_test;
      }

      on_result();

      return written_result;
    }

    on_result();

    return Result.Ok(undefined);
  };
};
