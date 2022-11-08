import { Result } from "@swan-io/boxed";
import { mkdir } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { IMakeDir, IMakeDirSync } from "./make-directory.types";

export const make_mkdir: IMakeDir.Func = (
  make_dir_func = mkdir as IMakeDir.MakeDirFunc
) => {
  return async ({ path, dry_run = false }, on_mkdir_hook) => {
    const on_result = () =>
      on_mkdir_hook ? on_mkdir_hook({ path, dry_run }) : () => {};

    if (!dry_run) {
      const written_result = await Result.fromPromise(
        make_dir_func(path, { recursive: true })
      );

      on_result();

      return written_result.map((val) => (val ? val : path));
    }

    on_result();

    return Result.Ok(path);
  };
};

export const make_mkdir_sync: IMakeDirSync.Func = (
  make_dir_func = mkdirSync as IMakeDirSync.MakeDirFunc
) => {
  return ({ path, dry_run = false }, on_mkdir_hook) => {
    const on_result = () =>
      on_mkdir_hook ? on_mkdir_hook({ path, dry_run }) : () => {};

    if (!dry_run) {
      const written_result = Result.fromExecution(() =>
        make_dir_func(path, { recursive: true })
      );

      on_result();

      return written_result.map((val) => (val ? val : path));
    }

    on_result();

    return Result.Ok(path);
  };
};
