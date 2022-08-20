import { Result } from "@swan-io/boxed";
import type { PathLike } from "node:fs";
import { existsSync } from "node:fs";

export type File_Exists = (path: PathLike) => boolean;

export function file_exists(
  path: string,
  file_exists_func: File_Exists = existsSync
) {
  const exists = Result.fromExecution(() => file_exists_func(path));

  return exists.isOk() && exists.get();
}
