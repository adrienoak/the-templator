import { Result } from "@swan-io/boxed";
import { readFile } from "node:fs/promises";

type Encoding = Parameters<typeof readFile>[1];

export type OnReadFileHook = (source: string) => void;

export namespace IReadFile {
  export type IReadFileFunc = (
    source: string,
    encoding: Encoding
  ) => Promise<string>;

  export type Read = (
    source: string,
    on_read_file?: OnReadFileHook
  ) => Promise<Result<string, unknown>>;

  export type Func = (read_file_func?: IReadFileFunc) => Read;
}

export namespace IReadFileSync {
  export type IReadFileFunc = (source: string, encoding: Encoding) => string;

  export type Read = (
    source: string,
    on_read_file?: OnReadFileHook
  ) => Result<string, unknown>;

  export type Func = (read_file_func?: IReadFileFunc) => Read;
}
