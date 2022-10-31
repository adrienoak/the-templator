import { Result } from "@swan-io/boxed";
import { make_new_path } from "../../../content";
import {
  make_dir,
  make_dir_sync,
  IMakeDir,
  IMakeDirSync,
} from "../../../module/fs/make-directory/index";
import { Vars } from "../../../module/validator";
import { ICreateFolder, ICreateFolderSync } from "./create-folder.types";

type I_Create_Folder = {
  base_dir: string;
  in_dir: string;
  vars?: Vars;
  out_dir: string;
  number?: number;
};

type Dry_Run_Option = { dry_run_option?: boolean };

type I_Create_Folder_Options = {
  make_dir_func?: IMakeDir.MkDir;
} & Dry_Run_Option;

type I_Create_Folder_Options_Sync = {
  make_dir_func?: IMakeDirSync.MkDir;
} & Dry_Run_Option;

export const make_create_folder: ICreateFolder.Func = (
  create_folder_func = make_dir
) => {
  return async ({
    base_dir,
    in_dir,
    out_dir,
    number,
    dry_run = false,
    vars = {},
  }) => {
    const new_folder_path = make_new_path({
      base_dir,
      in_dir,
      out_dir,
      vars,
      number,
    });

    if (!dry_run) {
      const result = await create_folder_func({
        path: new_folder_path,
      });

      if (result.isError()) {
        return result;
      }
    }

    return Result.Ok(new_folder_path);
  };
};

export const make_create_folder_sync: ICreateFolderSync.Func = (
  create_folder_func = make_dir_sync
) => {
  return ({
    base_dir,
    in_dir,
    out_dir,
    dry_run = false,
    number,
    vars = {},
  }) => {
    const new_folder_path = make_new_path({
      base_dir,
      in_dir,
      out_dir,
      vars,
      number,
    });

    if (!dry_run) {
      const result = create_folder_func({
        path: new_folder_path,
      });

      if (result.isError()) {
        return result;
      }
    }

    return Result.Ok(new_folder_path);
  };
};

export const create_folder_2 = make_create_folder();
export const create_folder_sync_2 = make_create_folder_sync();

export async function create_folder(
  create_folder_arg: I_Create_Folder,
  options: I_Create_Folder_Options = {}
): Promise<Result<string, unknown>> {
  const { base_dir, in_dir, out_dir, vars = {}, number } = create_folder_arg;
  const { dry_run_option = false, make_dir_func = make_dir } = options;

  const new_folder_path = make_new_path({
    base_dir,
    in_dir,
    out_dir,
    vars,
    number,
  });

  if (!dry_run_option) {
    const result = await make_dir_func({
      path: new_folder_path,
    });

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
  const { dry_run_option = false, make_dir_func = make_dir_sync } = options;

  const new_folder_path = make_new_path({ base_dir, in_dir, out_dir, vars });

  if (!dry_run_option) {
    const result = make_dir_func({ path: new_folder_path });

    if (result.isError()) {
      return result;
    }
  }

  return Result.Ok(new_folder_path);
}
