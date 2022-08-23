import { Result } from "@swan-io/boxed";
import { getAllFiles, getAllFilesSync } from "get-all-files-in-path";

export function get_all_files(in_dir: string) {
  return Result.fromPromise(
    getAllFiles({
      basePath: in_dir,
      dot: true,
    })
  );
}

export function get_all_files_sync(in_dir: string) {
  return Result.fromExecution(() =>
    getAllFilesSync({
      basePath: in_dir,
      dot: true,
    })
  );
}
