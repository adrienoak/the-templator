import { Result } from "@swan-io/boxed";
import { make_new_path } from "../../../content";

import { write_file, write_file_sync } from "../../../module/fs";
import { contentParser } from "string-template-parse";
import { ICreateFile, ICreateFileSync } from "./create-file.types";

export const make_create_file_sync: ICreateFileSync.Func = (
  create_file_func = write_file_sync
) => {
  return ({
    base_dir,
    content,
    in_dir,
    out_dir,
    dry_run = false,
    number,
    vars = {},
  }) => {
    const new_file_path = make_new_path({
      base_dir,
      in_dir,
      out_dir,
      vars,
      number,
    });

    if (!dry_run) {
      const result = create_file_func({
        path: new_file_path,
        content: contentParser(content, vars, { number }),
        dry_run,
      });

      if (result.isError()) {
        return result as unknown as Result<string, unknown>;
      }
    }

    return Result.Ok(new_file_path);
  };
};

export const make_create_file: ICreateFile.Func = (
  create_file_func = write_file
) => {
  return async ({
    base_dir,
    content,
    in_dir,
    out_dir,
    dry_run = false,
    number,
    vars = {},
  }) => {
    const new_file_path = make_new_path({ base_dir, in_dir, out_dir, vars });

    if (!dry_run) {
      const result = await create_file_func({
        path: new_file_path,
        content: contentParser(content, vars, { number }),
        dry_run,
      });

      if (result.isError()) {
        return result as unknown as Result<string, unknown>;
      }
    }

    return Result.Ok(new_file_path);
  };
};
