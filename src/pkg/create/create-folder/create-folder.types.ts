import { Result } from "@swan-io/boxed";
import { IMakeDir, IMakeDirSync } from "../../../module/fs";
import { Vars } from "../../../module/validator";

export type ICreateFolderArgs = {
  base_dir: string;
  in_dir: string;
  out_dir: string;
  vars?: Vars;
  number?: number;
  dry_run?: boolean;
};

export namespace ICreateFolder {
  export type Create = (
    create_folder_args: ICreateFolderArgs
  ) => Promise<Result<string, unknown>>;

  export type Func = (create_folder_func?: IMakeDir.MkDir) => Create;
}

export namespace ICreateFolderSync {
  export type Create = (
    create_folder_args: ICreateFolderArgs
  ) => Result<string, unknown>;

  export type Func = (create_folder_func?: IMakeDirSync.MkDir) => Create;
}
