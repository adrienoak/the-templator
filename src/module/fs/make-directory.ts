import { Result } from "@swan-io/boxed";
import { mkdir } from "node:fs/promises";
import { mkdirSync } from "node:fs";

type Recursive = Parameters<typeof mkdirSync>[1];

type Make_Directory_Func_Sync = (path: string, options: Recursive) => string;
type Make_Directory_Func = (
  path: string,
  options: Recursive
) => Promise<string>;

export function make_directory_sync(
  path: string,
  make_dir_func = mkdirSync as Make_Directory_Func_Sync
) {
  const make_dir_result = Result.fromExecution(() =>
    make_dir_func(path, { recursive: true })
  );

  return make_dir_result;
}

export function make_directory(
  path: string,
  make_dir_func = mkdir as Make_Directory_Func
) {
  const make_dir_result = Result.fromPromise(
    make_dir_func(path, { recursive: true })
  );
  return make_dir_result;
}
