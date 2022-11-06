import { Result } from "@swan-io/boxed";
import { read_file } from "../module/fs";
import { I_The_Templator } from "../module/validator";
import { validator_of_args } from "../module/validator/arg-validator";
import { create_file, create_folder } from "../pkg/create";
import { get_all_files, get_all_folders } from "../pkg/get";
import { ITemplatorHooks } from "../types/hooks.types";

export async function the_templator(
  options: I_The_Templator,
  hooks: ITemplatorHooks = {}
): Promise<string[]> {
  const validate_args = validator_of_args(options).match({
    Error(error) {
      if (typeof error === "string") {
        throw new Error(error);
      }

      throw error;
    },
    Ok: (v) => v,
  });

  const { dry_run, in_dir, out_dir, number, vars = {} } = validate_args;

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
      create_folder({
        base_dir: in_dir,
        in_dir: folder,
        out_dir,
        vars,
        number,
        dry_run,
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
      const content = await read_file(file, hooks?.on_read_file);

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
            dry_run,
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
