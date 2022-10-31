import { Result } from "@swan-io/boxed";
import type { PathLike } from "node:fs";
import { existsSync } from "node:fs";

export type File_Exists = (path: PathLike) => boolean;

export type OnFileExists = (path: PathLike, exists: boolean) => void;

export type IMakeFileExists = (
  file_exists_func?: File_Exists
) => (path: PathLike, on_file_exists?: OnFileExists) => boolean;

export const make_file_exists: IMakeFileExists = (
  file_exists_func = existsSync
) => {
  return (path, on_file_exists) => {
    const exists = Result.fromExecution(() => file_exists_func(path));

    const result = exists.isOk() && exists.get();

    if (on_file_exists) {
      on_file_exists(path, result);
    }

    return result;
  };
};

export const file_exists = make_file_exists();
