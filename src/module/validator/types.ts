import { z } from "zod";
import {
  invalid_in_dir_type,
  required_error_in_dir,
  invalid_out_dir_type,
  required_error_out_dir,
  invalid_vars_type,
  invalid_number_type,
  positive_number_error,
  non_int_number_error,
  number_too_small,
} from "./error-messages";

const in_dir_schema = z
  .string({
    invalid_type_error: invalid_in_dir_type,
    required_error: required_error_in_dir,
  })
  .min(1);

const out_dir_schema = z
  .string({
    invalid_type_error: invalid_out_dir_type,
    required_error: required_error_out_dir,
  })
  .min(1);

const vars_schema = z
  .record(z.string(), z.string(), {
    invalid_type_error: invalid_vars_type,
  })
  .default({})
  .optional();

export type Vars_Schema = z.infer<typeof vars_schema>;

const number_curlies_schema = z
  .number({
    invalid_type_error: invalid_number_type,
  })
  .positive({ message: positive_number_error })
  .int({
    message: non_int_number_error,
  })
  .min(2, { message: number_too_small })
  .default(2)
  .optional();

export const the_templator_object_schema = z.object({
  in_dir: in_dir_schema,
  out_dir: out_dir_schema,
  vars: vars_schema,
  number: number_curlies_schema,
});

export type I_The_Templator = z.infer<typeof the_templator_object_schema>;
