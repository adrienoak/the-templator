import { contentParser } from "string-template-parse";
import { sep, join } from "node:path";
import { Vars } from "../module/validator";
import { remove_dots } from "./remove_dot";

function content_parser(vars: Vars, number?: number) {
  return (content: string) => {
    return contentParser(content, vars, { number });
  };
}

export type I_Make_New_Path = {
  base_dir: string;
  in_dir: string;
  out_dir: string;
  vars: Vars;
  number?: number;
};

export function make_new_path({
  base_dir,
  in_dir,
  out_dir,
  vars,
  number = 2,
}: I_Make_New_Path) {
  const parsed_content = in_dir
    .split(base_dir)
    .join("")
    .split(sep)
    .map(content_parser(vars, number))
    .map(remove_dots)
    .map(content_parser(vars, number))
    .join(sep);

  return join(out_dir, parsed_content);
}
