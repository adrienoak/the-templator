import { Result } from "@swan-io/boxed";
import { z, ZodError } from "zod";
import { file_exists } from "../fs";
import { in_dir_non_existant, out_dir_taken } from "./error-messages";
import { validate_struct, validate_struct2 } from "./struct-validator";
import { ITemplator, I_The_Templator } from "./types";

export function validator_of_args(
  value: I_The_Templator
): Result<ITemplator, string | ZodError> {
  const arg = validate_struct2(value);

  if (arg.isError()) {
    return Result.Error(arg.getError());
  }

  const { in_dir, out_dir } = arg.get();

  const in_dir_exists = file_exists(in_dir);

  if (!in_dir_exists) {
    return Result.Error(in_dir_non_existant);
  }

  const out_dir_exists = file_exists(out_dir);

  if (out_dir_exists) {
    return Result.Error(out_dir_taken);
  }

  return arg;
}

export function validate_args(
  value: I_The_Templator
): Result<I_The_Templator, string | ZodError> {
  const arg = validate_struct(value);
  if (arg.isError()) {
    return Result.Error(arg.getError());
  }

  const { in_dir, out_dir } = arg.get();

  const in_dir_exists = file_exists(in_dir);

  if (!in_dir_exists) {
    return Result.Error(in_dir_non_existant);
  }

  const out_dir_exists = file_exists(out_dir);

  if (out_dir_exists) {
    return Result.Error(out_dir_taken);
  }

  return arg;
}
