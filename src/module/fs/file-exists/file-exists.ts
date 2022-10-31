import { Result } from "@swan-io/boxed";
import { existsSync } from "node:fs";
import type { IMakeFileExists } from "./file-exists.types";

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
