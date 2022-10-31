import { Result } from "@swan-io/boxed";
import { IWriteFile, IWriteFileSync } from "../../../module/fs";
import { Vars } from "../../../module/validator";

export type ICreateFileArgs = {
  base_dir: string;
  in_dir: string;
  out_dir: string;
  content: string;
  vars?: Vars;
  number?: number;
  dry_run?: boolean;
};
export namespace ICreateFile {
  export type Create = (
    create_file_args: ICreateFileArgs
  ) => Promise<Result<string, unknown>>;

  export type Func = (create_file_func?: IWriteFile.WriteFile) => Create;
}

export namespace ICreateFileSync {
  export type Create = (
    create_file_args: ICreateFileArgs
  ) => Result<string, unknown>;

  export type Func = (create_file_func?: IWriteFileSync.WriteFile) => Create;
}
