import { I_The_Templator, Vars_Schema } from "./types";
import { validate_args } from "./arg-validator";

export function validator(
  value: I_The_Templator | string,
  out_dir?: string | boolean,
  vars: Vars_Schema = {},
  number: number = 2
) {
  if (typeof value === "object") {
    const validate_result = validate_args(value);

    return validate_result;
  }

  const validate_result = validate_args({
    in_dir: value as string,
    out_dir: out_dir as string,
    vars,
    number,
  });

  return validate_result;
}
