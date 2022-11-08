import { Result } from "@swan-io/boxed";
import { IMakeDir, IMakeDirSync, OnMkDirHook } from "../../../module/fs";
import { Vars } from "../../../module/validator";

type ICreateFolderArgs = {
  base_dir: string;
  in_dir: string;
  out_dir: string;
  vars?: Vars;
  number?: number;
  dry_run?: boolean;
};

export namespace ICreateFolder {
  type Create = (
    create_folder_args: ICreateFolderArgs,
    hook?: OnMkDirHook
  ) => Promise<Result<string, unknown>>;

  export type Func = (create_folder_func?: IMakeDir.MkDir) => Create;
}

export namespace ICreateFolderSync {
  type Create = (
    create_folder_args: ICreateFolderArgs,
    hook?: OnMkDirHook
  ) => Result<string, unknown>;

  export type Func = (create_folder_func?: IMakeDirSync.MkDir) => Create;
}
