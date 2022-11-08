import { Result } from "@swan-io/boxed";
import { dirname } from "node:path";
import { AsyncTest, SyncTest } from "./write-file.types";

export async function handle_error_write_file({
  content,
  err,
  make_dir_func,
  path,
  write_file_func,
  on_mkdir,
  on_write_file,
}: AsyncTest.IHandleErrorArgs): Promise<Result<void, unknown>> {
  const on_result = () =>
    on_write_file ? on_write_file({ content, path, dry_run: false }) : () => {};

  if ((err as NodeJS.ErrnoException)?.code?.match(/enoent/i)) {
    const dir = await make_dir_func({ path: dirname(path) }, on_mkdir);

    if (dir.isOk()) {
      const written_result = await Result.fromPromise(
        write_file_func(path, content, { encoding: "utf-8" })
      );

      return written_result;
    }
  }

  return Result.Error(err);
}

export function handle_error_write_file_sync({
  content,
  err,
  make_dir_func,
  path,
  write_file_func,
  on_mkdir,
  on_write_file,
}: SyncTest.IHandleErrorArgs): Result<void, unknown> {
  const on_result = () =>
    on_write_file ? on_write_file({ content, path, dry_run: false }) : () => {};

  if ((err as NodeJS.ErrnoException)?.code?.match(/enoent/i)) {
    const dir = make_dir_func({ path: dirname(path) }, on_mkdir);

    if (dir.isOk()) {
      const written_result = Result.fromExecution(() =>
        write_file_func(path, content, { encoding: "utf-8" })
      );

      return written_result;
    }
  }

  return Result.Error(err);
}
