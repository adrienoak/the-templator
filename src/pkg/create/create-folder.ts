import { Result } from "@swan-io/boxed";
import { make_new_path } from "../../content";
import {
  make_directory,
  I_Make_Directory,
  I_Make_Directory_Sync,
  make_directory_sync,
} from "../../module/fs";
import { Vars } from "../../module/validator";

type I_Create_Folder = {
  base_dir: string;
  in_dir: string;
  vars?: Vars;
  out_dir: string;
  number?: number;
};

type Dry_Run_Option = { dry_run_option?: boolean };

type I_Create_Folder_Options = {
  make_dir_func?: I_Make_Directory;
} & Dry_Run_Option;

type I_Create_Folder_Options_Sync = {
  make_dir_func?: I_Make_Directory_Sync;
} & Dry_Run_Option;

export async function create_folder(
  create_folder_arg: I_Create_Folder,
  options: I_Create_Folder_Options = {}
): Promise<Result<string, unknown>> {
  const { base_dir, in_dir, out_dir, vars = {}, number } = create_folder_arg;
  const { dry_run_option = false, make_dir_func = make_directory } = options;

  const new_folder_path = make_new_path({
    base_dir,
    in_dir,
    out_dir,
    vars,
    number,
  });

  if (!dry_run_option) {
    const result = await make_dir_func(new_folder_path);

    if (result.isError()) {
      return result;
    }
  }

  return Result.Ok(new_folder_path);
}

export function create_folder_sync(
  create_folder_arg: I_Create_Folder,
  options: I_Create_Folder_Options_Sync = {}
): Result<string, unknown> {
  const { base_dir, in_dir, out_dir, vars = {} } = create_folder_arg;
  const { dry_run_option = false, make_dir_func = make_directory_sync } =
    options;

  const new_folder_path = make_new_path({ base_dir, in_dir, out_dir, vars });

  if (!dry_run_option) {
    const result = make_dir_func(new_folder_path);

    if (result.isError()) {
      return result;
    }
  }

  return Result.Ok(new_folder_path);
}
