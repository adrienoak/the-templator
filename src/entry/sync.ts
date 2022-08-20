import { I_The_Templator, validator, Vars_Schema } from "../module/validator";

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
  out_dir?: boolean | string,
  vars?: Vars_Schema,
  number?: number,
  dry_run_option?: boolean
) {
  const validated_args = validator(value, out_dir, vars, number);

  return [""];
}

export { the_templator_sync };
