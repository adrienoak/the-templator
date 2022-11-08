import { Result } from "@swan-io/boxed";
import { AsyncTest, IWriteHooks, SyncTest } from "../../../module/fs";
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
    create_file_args: ICreateFileArgs,
    hooks?: IWriteHooks
  ) => Promise<Result<string, unknown>>;

  export type Func = (create_file_func?: AsyncTest.WriteFile) => Create;
}

export namespace ICreateFileSync {
  export type Create = (
    create_file_args: ICreateFileArgs,
    hooks?: IWriteHooks
  ) => Result<string, unknown>;

  export type Func = (create_file_func?: SyncTest.WriteFile) => Create;
}
