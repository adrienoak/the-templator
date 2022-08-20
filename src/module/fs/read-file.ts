import { Result } from "@swan-io/boxed";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
type Encoding = Parameters<typeof readFile>[1];

type Read_File_Func_Sync = (source: string, encoding: Encoding) => string;
type Read_File_Func = (source: string, encoding: Encoding) => Promise<string>;

export async function read_file(
  source: string,
  read_file_func = readFile as Read_File_Func
) {
  const content = await Result.fromPromise(
    read_file_func(source, { encoding: "utf-8" })
  );

  return content;
}

export function read_file_sync(
  source: string,
  read_file_func = readFileSync as Read_File_Func_Sync
) {
  return Result.fromExecution(() =>
    read_file_func(source, { encoding: "utf-8" })
  );
}
