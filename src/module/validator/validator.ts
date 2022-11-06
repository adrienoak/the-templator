import {
  ITemplator,
  I_The_Templator,
  the_templator_object_schema,
  the_templator_schema,
  Vars_Schema,
} from "./types";
import { validate_args, validator_of_args } from "./arg-validator";

export function validate(value: I_The_Templator) {
  return validator_of_args(value);
}

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
