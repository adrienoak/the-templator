export function make_is_dry_run_option(
  out_dir?: string | boolean,
  dry_run_option = false
) {
  if (typeof out_dir === "boolean") {
    return out_dir || dry_run_option;
  }

  return dry_run_option;
}
