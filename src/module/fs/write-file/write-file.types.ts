import { Result } from "@swan-io/boxed";
import type { WriteFileOptions } from "node:fs";
import { IMakeDir, IMakeDirSync, OnMkDirHook } from "../make-directory";

export type IMakeWriteFileArg = {
  path: string;
  content: string;
  dry_run?: boolean;
  on_write_content?: OnWriteContent;
};

export type IWriteFileArg = {
  path: string;
  content: string;
  dry_run?: boolean;
};

export type OnWriteContent = (
  opts: Omit<IMakeWriteFileArg, "on_write_content">
) => void;

type OnWriteFileHook = (opts: IWriteFileArg) => void;

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
    on_mkdir?: OnMkDirHook;
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
    on_mkdir?: OnMkDirHook;
  };
}

export type IWriteHooks = {
  on_write_file?: OnWriteFileHook;
  on_mkdir?: OnMkDirHook;
};

export namespace AsyncTest {
  export type WriteFileFunc = (
    file: string,
    data: string,
    options: WriteFileOptions
  ) => Promise<void>;

  export type Deps = {
    write_file_func?: WriteFileFunc;
    make_dir_func?: IMakeDir.MkDir;
  };

  export type WriteFile = (
    opts: IWriteFileArg,
    hooks?: IWriteHooks
  ) => Promise<Result<void, unknown>>;

  export type IHandleErrorArgs = IWriteHooks & {
    content: string;
    err: unknown;
    make_dir_func: IMakeDir.MkDir;
    path: string;
    write_file_func: WriteFileFunc;
  };

  export type Func = (dependencies?: Deps) => WriteFile;
}

export namespace SyncTest {
  export type WriteFileFunc = (
    file: string,
    data: string,
    options: WriteFileOptions
  ) => void;

  export type Deps = {
    write_file_func?: WriteFileFunc;
    make_dir_func?: IMakeDirSync.MkDir;
  };

  export type WriteFile = (
    opts: IWriteFileArg,
    hooks?: IWriteHooks
  ) => Result<void, unknown>;

  export type IHandleErrorArgs = IWriteHooks & {
    content: string;
    err: unknown;
    make_dir_func: IMakeDirSync.MkDir;
    path: string;
    write_file_func: WriteFileFunc;
  };

  export type Func = (dependencies?: Deps) => WriteFile;
}
