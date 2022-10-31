import { Result } from "@swan-io/boxed";
import { read_file_sync } from "../module/fs";
import {
  I_The_Templator,
  make_is_dry_run_option,
  validator,
  Vars_Schema,
} from "../module/validator";
import { create_file_sync, create_folder_sync_2 } from "../pkg/create";
import { get_all_files_sync, get_all_folders_sync } from "../pkg/get";

function the_templator_sync(
  options: I_The_Templator,
  dry_run_option?: boolean
): string[];
function the_templator_sync(
  in_dir: string,
  out_dir: string,
  vars?: Vars_Schema,
  number?: number,
  dry_run_option?: boolean
): string[];
function the_templator_sync(
  value: I_The_Templator | string,
  out_dir_arg?: boolean | string,
  vars_arg?: Vars_Schema,
  number_arg?: number,
  dry_run_option?: boolean
) {
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

  const folders_result = get_all_folders_sync(in_dir);

  const folders = folders_result.match({
    Error(error) {
      if (typeof error === "string") {
        throw new Error(error);
      }

      throw error;
    },
    Ok: (v) => v,
  });

  // const folders = get_all_folders_sync(in_dir).match({
  //   Error(error) {
  //     if (typeof error === "string") {
  //       throw new Error(error);
  //     }

  //     throw error;
  //   },
  //   Ok: (v) => v,
  // });

  const create_folder_results = folders.map((folder) =>
    create_folder_sync_2({
      base_dir: in_dir,
      in_dir: folder,
      out_dir,
      vars,
      number,
      dry_run: is_dry_run,
    })
  );

  const create_folders_is_success = Result.all(create_folder_results);

  if (create_folders_is_success.isError()) {
    const err = create_folders_is_success.getError();

    throw err;
  }

  const files_result = get_all_files_sync(in_dir);

  const files = files_result.match({
    Error(error) {
      throw error;
    },
    Ok: (v) => v,
  });

  const create_files_result = files.map((file) => {
    const content = read_file_sync(file);

    return content.match({
      Error(error) {
        return Result.Error(error);
      },
      Ok(content) {
        return create_file_sync({
          content,
          in_dir: file,
          base_dir: in_dir,
          vars,
          number,
          out_dir,
          dry_run: is_dry_run,
        });
      },
    });
  });

  // const files = get_all_files_sync(in_dir)
  //   .match({
  //     Error(error) {
  //       throw error;
  //     },
  //     Ok: (v) => v,
  //   })
  //   .map((file) => {
  //     const content = read_file_sync(file);

  //     return content.match({
  //       Error(error) {
  //         return Result.Error(error);
  //       },
  //       Ok(content) {
  //         return create_file_sync({
  //           content,
  //           out_dir,
  //           base_dir: in_dir,
  //           number,
  //           vars,
  //           in_dir: file,
  //         });
  //       },
  //     });
  //   });

  return Result.all(create_files_result).match({
    Error(error): any {
      // throw error;
    },
    Ok(value) {
      return value;
    },
  });
}

export { the_templator_sync };
