import { Result } from "@swan-io/boxed";
import { make_new_path } from "../../../content";
import {
  make_dir,
  make_dir_sync,
} from "../../../module/fs/make-directory/index";
import { ICreateFolder, ICreateFolderSync } from "./create-folder.types";

export const make_create_folder: ICreateFolder.Func = (
  create_folder_func = make_dir
) => {
  return async (
    { base_dir, in_dir, out_dir, number, dry_run = false, vars = {} },
    on_mkdir_hook
  ) => {
    const new_folder_path = make_new_path({
      base_dir,
      in_dir,
      out_dir,
      vars,
      number,
    });

    if (!dry_run) {
      const result = await create_folder_func(
        {
          path: new_folder_path,
        },
        on_mkdir_hook
      );

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
  return (
    { base_dir, in_dir, out_dir, dry_run = false, number, vars = {} },
    on_mkdir_hook
  ) => {
    const new_folder_path = make_new_path({
      base_dir,
      in_dir,
      out_dir,
      vars,
      number,
    });

    if (!dry_run) {
      const result = create_folder_func(
        {
          path: new_folder_path,
        },
        on_mkdir_hook
      );

      if (result.isError()) {
        return result;
      }
    }

    return Result.Ok(new_folder_path);
  };
};
