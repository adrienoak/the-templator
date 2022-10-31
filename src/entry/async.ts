import { Result } from "@swan-io/boxed";
import { read_file } from "../module/fs";
import {
  I_The_Templator,
  make_is_dry_run_option,
  validator,
  Vars_Schema,
} from "../module/validator";
import { create_file, create_folder_2 } from "../pkg/create";
import { get_all_files, get_all_folders } from "../pkg/get";

async function the_templator(
  options: I_The_Templator,
  dry_run_option?: boolean
): Promise<string[]>;
async function the_templator(
  in_dir: string,
  out_dir: string,
  vars?: Vars_Schema,
  number?: number,
  dry_run_option?: boolean
): Promise<string[]>;
async function the_templator(
  value: I_The_Templator | string,
  out_dir_arg?: boolean | string,
  vars_arg?: Vars_Schema,
  number_arg?: number,
  dry_run_option = false
): Promise<string[]> {
  const validated_args = validator(
    value,
    out_dir_arg,
    vars_arg,
    number_arg
  ).match({
    Error(error) {
      if (typeof error === "string") {
        throw new Error(error);
      }

      throw error;
    },
    Ok: (v) => v,
  });

  const { in_dir, out_dir, number, vars = {} } = validated_args;
  const is_dry_run = make_is_dry_run_option(out_dir_arg, dry_run_option);

  const folders_result = await get_all_folders(in_dir);

  const folders = folders_result.match({
    Error(err) {
      if (typeof err === "string") {
        throw new Error(err);
      }

      throw err;
    },
    Ok: (v) => v,
  });

  const create_folder_results = await Promise.all(
    folders.map((folder) =>
      create_folder_2({
        base_dir: in_dir,
        in_dir: folder,
        out_dir,
        vars,
        number,
        dry_run: is_dry_run,
      })
    )
  );

  const create_folders_is_success = Result.all(create_folder_results);

  if (create_folders_is_success.isError()) {
    const err = create_folders_is_success.getError();

    throw err;
  }

  const files_result = await get_all_files(in_dir);

  const files = files_result.match({
    Error(error) {
      throw error;
    },
    Ok: (v) => v,
  });

  const create_files_result = await Promise.all(
    files.map(async (file) => {
      const content = await read_file(file);

      return content.match({
        Error(error) {
          return Promise.resolve(Result.Error(error));
        },
        Ok(content) {
          return create_file({
            content,
            out_dir,
            base_dir: in_dir,
            vars,
            number,
            in_dir: file,
            dry_run: is_dry_run,
          });
        },
      });
    })
  );

  return Result.all(create_files_result).match({
    Error(error) {
      console.log("error:", error);
      throw error;
    },
    Ok: (v) => v,
  });
}

export { the_templator };
