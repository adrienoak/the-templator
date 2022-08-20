import { I_The_Templator, Vars_Schema, validator } from "../module/validator";

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
  out_dir?: boolean | string,
  vars?: Vars_Schema,
  number?: number,
  dry_run_option = false
): Promise<string[]> {
  const validated_args = validator(value, out_dir, vars, number);

  return [""];
}

export { the_templator };
