import { Option } from "@swan-io/boxed";
import { sep, join } from "node:path";
import { file_exists } from "../module/fs";

export function calc_path_existing(path: string) {
  const arr = path.split(sep);

  const every = arr.reduce((acc, val) => {
    return acc.flatMap((curr_path): Option<string> => {
      const new_path = join(curr_path, val);
      const exists = file_exists(join(curr_path, val));

      return exists ? Option.Some(new_path) : Option.None();
    });
  }, Option.Some(sep));

  return every.isSome();
}
