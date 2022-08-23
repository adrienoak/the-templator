import { Result } from "@swan-io/boxed";
import type { WriteFileOptions } from "node:fs";
import { writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { file_exists } from "./file-exists";

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
