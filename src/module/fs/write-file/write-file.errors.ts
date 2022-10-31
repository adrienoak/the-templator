import { Result } from "@swan-io/boxed";
import { make_mkdir, make_mkdir_sync } from "../make-directory/make-directory";
import { IWriteFile, IWriteFileSync } from "./write-file.types";
import { dirname } from "node:path";

export function handle_error_write_file_sync({
  content,
  err,
  make_dir_func,
  path,
  write_file_func,
  on_mkdir,
}: IWriteFileSync.IHandleError): Result<void, unknown> {
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
}: IWriteFile.IHandleError): Promise<Result<void, unknown>> {
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
