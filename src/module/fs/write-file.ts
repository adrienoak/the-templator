import { Result } from "@swan-io/boxed";
import type { WriteFileOptions } from "node:fs";
import { writeFileSync, mkdirSync } from "node:fs";
import { writeFile, mkdir } from "node:fs/promises";
import {
  IMakeMkDir,
  make_directory,
  Make_Directory_Func,
  Make_Directory_Func_Sync,
  make_mkdir,
  make_mkdir_sync,
  OnMkDir,
} from "./make-directory";
import { dirname } from "node:path";

export type Write_Func_Sync = (
  file: string,
  data: string,
  options: WriteFileOptions
) => void;

export type Write_Func = (
  file: string,
  data: string,
  options: WriteFileOptions
) => Promise<void>;

export type IWrite_File_Sync_Config = {
  write_func?: Write_Func_Sync;
  dry_run?: boolean;
};

export type IWrite_File_Config = {
  write_func?: Write_Func;
  dry_run?: boolean;
};

export type I_Write_File = (
  path: string,
  content: string,
  options?: IWrite_File_Config
) => Promise<Result<void, unknown>>;

export type I_Write_File_Sync = (
  path: string,
  content: string,
  options?: IWrite_File_Sync_Config
) => Result<void, unknown>;

type IMakeWriteFileDependencies = {
  write_file_func?: Write_Func;
  make_dir_func?: Make_Directory_Func;
};

type IMakeWriteFileSyncDependencies = {
  write_file_func?: Write_Func_Sync;
  make_dir_func?: Make_Directory_Func_Sync;
};

export type IMakeWriteFile = (
  dependencies?: IMakeWriteFileDependencies
) => (opts: IMakeWriteFileArg) => Promise<Result<void, unknown>>;

export type IMakeWriteFileSync = (
  dependencies?: IMakeWriteFileSyncDependencies
) => (opts: IMakeWriteFileSyncArg) => Result<void, unknown>;

type IMakeWriteFileArg = {
  path: string;
  content: string;
  dry_run?: boolean;
  on_write_content?: OnWriteContent;
};

type IMakeWriteFileSyncArg = {
  path: string;
  content: string;
  dry_run: boolean;
  on_write_content: OnWriteContent;
};

type OnWriteContent = (
  opts: Omit<IMakeWriteFileArg, "on_write_content">
) => void;

export type IHandleErrorWriteFileArgs = {
  err: unknown;
  write_file_func: Write_Func;
  content: string;
  path: string;
  make_dir_func: Make_Directory_Func;
  on_mkdir?: OnMkDir;
};

export type IHandleErrorWriteFileSyncArgs = {
  err: unknown;
  write_file_func: Write_Func_Sync;
  content: string;
  path: string;
  make_dir_func: Make_Directory_Func_Sync;
  on_mkdir?: OnMkDir;
};

export function handle_error_write_file_sync({
  content,
  err,
  make_dir_func,
  path,
  write_file_func,
  on_mkdir,
}: IHandleErrorWriteFileSyncArgs): Result<void, unknown> {
  if ((err as NodeJS.ErrnoException)?.code?.match(/enoent/i)) {
    const make_dir = make_mkdir_sync(make_dir_func);

    const dir = make_dir({ path: dirname(path), on_mkdir });

    if (dir.isOk()) {
      return Result.fromExecution(() =>
        write_file_func(path, content, { encoding: "utf-8" })
      );
    }
  }

  return Result.Error(err);
}

export async function handle_error_write_file({
  err,
  content,
  make_dir_func,
  path,
  write_file_func,
  on_mkdir,
}: IHandleErrorWriteFileArgs): Promise<Result<void, unknown>> {
  if ((err as NodeJS.ErrnoException)?.code?.match(/enoent/i)) {
    const make_dir = make_mkdir(make_dir_func);

    const dir = await make_dir({ path: dirname(path), on_mkdir });

    if (dir.isOk()) {
      return Result.fromPromise(
        write_file_func(path, content, { encoding: "utf-8" })
      );
    }
  }

  return Result.Error(err);
}

export const make_write_file: IMakeWriteFile = (deps = {}) => {
  const {
    write_file_func = writeFile,
    make_dir_func = mkdir as Make_Directory_Func,
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

export const make_write_file_sync: IMakeWriteFileSync = (deps = {}) => {
  const {
    write_file_func = writeFileSync,
    make_dir_func = mkdirSync as Make_Directory_Func_Sync,
  } = deps;

  return ({ content, path, dry_run, on_write_content }) => {
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

export async function write_file(
  path: string,
  content: string,
  { dry_run = false, write_func = writeFile }: IWrite_File_Config = {}
): Promise<Result<void, unknown>> {
  if (!dry_run) {
    // this protects in case someone doesnt pass a promise. probably only me, but still protects me
    const written = await Result.fromPromise(
      write_func(path, content, { encoding: "utf-8" })
    );

    return written;
  }

  return Result.Ok(undefined);
}

export function write_file_sync(
  path: string,
  content: string,
  { dry_run = false, write_func = writeFileSync }: IWrite_File_Sync_Config = {}
): Result<void, unknown> {
  if (!dry_run) {
    const written = Result.fromExecution(() =>
      write_func(path, content, { encoding: "utf-8" })
    );

    return written;
  }

  return Result.Ok(undefined);
}
