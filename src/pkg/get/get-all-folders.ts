import { Result } from "@swan-io/boxed";
import { getAllFolders, getAllFoldersSync } from "get-all-folders";

export async function get_all_folders(in_dir: string) {
  return Result.fromPromise(
    getAllFolders({
      basePath: in_dir,
      dot: true,
    })
  );
}

export function get_all_folders_sync(in_dir: string) {
  return Result.fromExecution(() =>
    getAllFoldersSync({ basePath: in_dir, dot: true })
  );
}
