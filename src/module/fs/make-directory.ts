import { Result } from "@swan-io/boxed";
import { mkdir } from "node:fs/promises";
import { mkdirSync } from "node:fs";

type Recursive = Parameters<typeof mkdirSync>[1];

export type Make_Directory_Func_Sync = (
  path: string,
  options: Recursive
) => string;

export type Make_Directory_Func = (
  path: string,
  options: Recursive
) => Promise<string>;

export type I_Make_Directory_Sync = (
  path: string,
  make_dir_func?: Make_Directory_Func_Sync
) => Result<string, unknown>;

export function make_directory_sync(
  path: string,
  make_dir_func = mkdirSync as Make_Directory_Func_Sync
) {
  const make_dir_result = Result.fromExecution(() =>
    make_dir_func(path, { recursive: true })
  );

  return make_dir_result;
}

export type I_Make_Directory = (
  path: string,
  make_dir_func?: Make_Directory_Func
) => Promise<Result<string, unknown>>;

export type OnMkDir = (args: Omit<IMkDirArg, "on_mkdir">) => void;

type IMkDirArg = {
  path: string;
  on_mkdir?: OnMkDir;
  dry_run?: boolean;
};

export type IMakeMkDir = (
  make_dir_func?: Make_Directory_Func
) => (mkdir_args: IMkDirArg) => Promise<Result<string, unknown>>;

export type IMakeMkDirSync = (
  make_dir_func?: Make_Directory_Func_Sync
) => (mkdir_args: IMkDirArg) => Result<string, unknown>;

export const make_mkdir: IMakeMkDir = (
  make_dir_func = mkdir as Make_Directory_Func
) => {
  return async ({ path, dry_run = false, on_mkdir }) => {
    const on_result = () => (on_mkdir ? on_mkdir({ path, dry_run }) : () => {});

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

export const make_mkdir_sync: IMakeMkDirSync = (
  make_dir_func = mkdirSync as Make_Directory_Func_Sync
) => {
  return ({ path, dry_run = false, on_mkdir }) => {
    const on_result = () => (on_mkdir ? on_mkdir({ path, dry_run }) : () => {});

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

export function make_directory(
  path: string,
  make_dir_func = mkdir as Make_Directory_Func
) {
  const make_dir_result = Result.fromPromise(
    make_dir_func(path, { recursive: true })
  );
  return make_dir_result;
}
