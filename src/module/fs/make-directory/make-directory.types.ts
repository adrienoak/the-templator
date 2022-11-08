import type { Result } from "@swan-io/boxed";
import { mkdirSync } from "node:fs";

type Recursive = Parameters<typeof mkdirSync>[1];

export type OnMkDirHook = (args: IMkDirArg) => void;

type IMkDirArg = {
  path: string;
  dry_run?: boolean;
};

export namespace IMakeDir {
  export type MakeDirFunc = (
    path: string,
    options: Recursive
  ) => Promise<string>;

  export type MkDir = (
    mkdir_args: IMkDirArg,
    on_make_dir_hook?: OnMkDirHook
  ) => Promise<Result<string, unknown>>;

  export type Func = (make_dir_func?: MakeDirFunc) => MkDir;
}

export namespace IMakeDirSync {
  export type MakeDirFunc = (path: string, options: Recursive) => string;

  export type MkDir = (
    mkdir_args: IMkDirArg,
    on_mkdir_hook?: OnMkDirHook
  ) => Result<string, unknown>;

  export type Func = (make_dir_func?: MakeDirFunc) => MkDir;
}
