import { Result } from "@swan-io/boxed";
import type { WriteFileOptions } from "node:fs";
import { IMakeDir, IMakeDirSync, OnMkDir } from "../make-directory";

export type IMakeWriteFileArg = {
  path: string;
  content: string;
  dry_run?: boolean;
  on_write_content?: OnWriteContent;
};

export type OnWriteContent = (
  opts: Omit<IMakeWriteFileArg, "on_write_content">
) => void;

export namespace IWriteFileSync {
  export type WriteFileFunc = (
    file: string,
    data: string,
    options: WriteFileOptions
  ) => void;

  export type Deps = {
    write_file_func?: WriteFileFunc;
    make_dir_func?: IMakeDirSync.MakeDirFunc;
  };

  export type WriteFile = (opts: IMakeWriteFileArg) => Result<void, unknown>;

  export type Func = (dependencies?: Deps) => WriteFile;

  export type IHandleError = {
    err: unknown;
    write_file_func: WriteFileFunc;
    content: string;
    path: string;
    make_dir_func: IMakeDirSync.MakeDirFunc;
    on_mkdir?: OnMkDir;
  };
}

export namespace IWriteFile {
  export type WriteFileFunc = (
    file: string,
    data: string,
    options: WriteFileOptions
  ) => Promise<void>;

  export type Deps = {
    write_file_func?: WriteFileFunc;
    make_dir_func?: IMakeDir.MakeDirFunc;
  };

  export type WriteFile = (
    opts: IMakeWriteFileArg
  ) => Promise<Result<void, unknown>>;

  export type Func = (dependencies?: Deps) => WriteFile;

  export type IHandleError = {
    err: unknown;
    write_file_func: WriteFileFunc;
    content: string;
    path: string;
    make_dir_func: IMakeDir.MakeDirFunc;
    on_mkdir?: OnMkDir;
  };
}
