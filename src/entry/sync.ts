import { Result } from "@swan-io/boxed";
import { read_file_sync } from "../module/fs";
import { I_The_Templator } from "../module/validator";
import { validator } from "../module/validator";
import { create_file_sync, create_folder_sync } from "../pkg/create";
import { get_all_files_sync, get_all_folders_sync } from "../pkg/get";

function the_templator_sync(options: I_The_Templator): string[] {
  const validated_args = validator(options).match({
    Error(error) {
      if (typeof error === "string") {
        throw new Error(error);
      }

      throw error;
    },
    Ok: (v) => v,
  });

  const { in_dir, out_dir, number, vars = {}, dry_run } = validated_args;

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

  const create_folder_results = folders.map((folder) =>
    create_folder_sync({
      base_dir: in_dir,
      in_dir: folder,
      out_dir,
      vars,
      number,
      dry_run,
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
          dry_run,
        });
      },
    });
  });

  return Result.all(create_files_result).match({
    Error(error): any {
      throw error;
    },
    Ok(value) {
      return value;
    },
  });
}

export { the_templator_sync };
