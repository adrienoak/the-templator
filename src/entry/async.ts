import { Result } from "@swan-io/boxed";
import { read_file } from "../module/fs";
import { I_The_Templator, Vars_Schema, validator } from "../module/validator";
import { create_file_sync, create_folder, create_file } from "../pkg/create";
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
  const validated_args = validator(value, out_dir_arg, vars_arg, number_arg);

  if (validated_args.isError()) {
    const err = validated_args.getError();

    if (typeof err === "string") {
      throw new Error(err);
    }
    throw err;
  }

  const { in_dir, out_dir, number, vars } = validated_args.get();

  const folders_result = await get_all_folders(in_dir);

  if (folders_result.isError()) {
    const err = folders_result.getError();
    if (typeof err === "string") {
      throw new Error(err);
    }

    throw err;
  }

  const folders = folders_result.get();

  const create_folder_results = await Promise.all(
    folders.map((folder) =>
      create_folder(
        { base_dir: in_dir, in_dir: folder, out_dir, vars, number },
        { dry_run_option }
      )
    )
  );

  const create_folders_is_success = Result.all(create_folder_results);

  if (create_folders_is_success.isError()) {
    const err = create_folders_is_success.getError();
    throw err;
  }

  const files_result = await get_all_files(in_dir);

  if (files_result.isError()) {
    const err = files_result.getError();
    throw err;
  }

  const files = files_result.get();

  const create_files_result = await Promise.all(
    files.map(async (file) => {
      const content = await read_file(file);

      if (content.isError()) {
        return content;
      }

      return create_file(
        {
          content: content.get(),
          base_dir: in_dir,
          out_dir,
          vars,
          in_dir: file,
          number,
        },
        { dry_run_option }
      );
    })
  );

  const create_files_is_success = Result.all(create_files_result);

  if (create_files_is_success.isError()) {
    const err = create_files_is_success.getError();
    throw err;
  }

  const file_names = create_files_is_success.get();

  return file_names;
}

export { the_templator };
