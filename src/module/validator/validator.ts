import { Result } from "@swan-io/boxed";
import { ZodError } from "zod";
import { file_exists, OnFileExistsHook } from "../fs";
import { in_dir_non_existant, out_dir_taken } from "./error-messages";
import { validate_struct } from "./struct-validator";
import { ITemplator, I_The_Templator } from "./types";

export function validator(
  value: I_The_Templator,
  on_file_exists?: OnFileExistsHook
): Result<ITemplator, string | ZodError> {
  const arg = validate_struct(value);

  if (arg.isError()) {
    return Result.Error(arg.getError());
  }

  const { in_dir, out_dir } = arg.get();

  const in_dir_exists = file_exists(in_dir, on_file_exists);

  if (!in_dir_exists) {
    return Result.Error(in_dir_non_existant);
  }

  const out_dir_exists = file_exists(out_dir, on_file_exists);

  if (out_dir_exists) {
    return Result.Error(out_dir_taken);
  }

  return arg;
}
