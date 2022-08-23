import { Result } from "@swan-io/boxed";
import { make_new_path } from "../../content";
import {
  I_Write_File,
  I_Write_File_Sync,
  write_file,
  write_file_sync,
} from "../../module/fs";
import { Vars } from "../../module/validator";
import { contentParser } from "string-template-parse";

type ICreateFileArgs = {
  base_dir: string;
  in_dir: string;
  out_dir: string;
  vars?: Vars;
  content: string;
  number?: number;
};

type Dry_Run_Option = { dry_run_option?: boolean };

type I_Create_File_Options = {
  create_file_func?: I_Write_File;
} & Dry_Run_Option;

type I_Create_File_Sync_Options = {
  create_file_func?: I_Write_File_Sync;
} & Dry_Run_Option;

export async function create_file(
  create_file_arg: ICreateFileArgs,
  options: I_Create_File_Options = {}
): Promise<Result<string, unknown>> {
  const {
    base_dir,
    in_dir,
    out_dir,
    vars = {},
    content,
    number,
  } = create_file_arg;

  const { dry_run_option = false, create_file_func = write_file } = options;

  const new_file_path = make_new_path({ base_dir, in_dir, out_dir, vars });

  if (!dry_run_option) {
    const result = await create_file_func(
      new_file_path,
      contentParser(content, vars, { number }),
      {
        dry_run: dry_run_option,
      }
    );

    if (result.isError()) {
      console.log("new_file_path:", new_file_path);
      return result as unknown as Result<string, unknown>;
    }
  }

  return Result.Ok(new_file_path);
}

export function create_file_sync(
  create_file_arg: ICreateFileArgs,
  options: I_Create_File_Sync_Options = {}
): Result<string, unknown> {
  const {
    base_dir,
    in_dir,
    out_dir,
    vars = {},
    content,
    number,
  } = create_file_arg;

  const { dry_run_option = false, create_file_func = write_file_sync } =
    options;

  const new_file_path = make_new_path({
    base_dir,
    in_dir,
    out_dir,
    vars,
    number,
  });

  if (!dry_run_option) {
    const result = create_file_func(
      new_file_path,
      contentParser(content, vars),
      {
        dry_run: dry_run_option,
      }
    );

    if (result.isError()) {
      return result as unknown as Result<string, unknown>;
    }
  }

  return Result.Ok(new_file_path);
}
