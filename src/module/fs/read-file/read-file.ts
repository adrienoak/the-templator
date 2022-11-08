import { Result } from "@swan-io/boxed";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { IReadFile, IReadFileSync } from "./read-file.types";

export const make_read_file: IReadFile.Func = (
  read_file_func = readFile as IReadFile.IReadFileFunc
) => {
  return async (source, on_read_file_hook) => {
    const content = await Result.fromPromise(
      read_file_func(source, { encoding: "utf-8" })
    );

    if (on_read_file_hook) {
      on_read_file_hook(source);
    }

    return content;
  };
};

export const make_read_file_sync: IReadFileSync.Func = (
  read_file_func = readFileSync as IReadFileSync.IReadFileFunc
) => {
  return (source, on_read_file_hook) => {
    const content = Result.fromExecution(() =>
      read_file_func(source, { encoding: "utf-8" })
    );

    if (on_read_file_hook) {
      on_read_file_hook(source);
    }

    return content;
  };
};

export const read_file = make_read_file();

export const read_file_sync = make_read_file_sync();
