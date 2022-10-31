import type { PathLike } from "node:fs";

export type File_Exists = (path: PathLike) => boolean;

export type OnFileExists = (path: PathLike, exists: boolean) => void;

export type IMakeFileExists = (
  file_exists_func?: File_Exists
) => (path: PathLike, on_file_exists?: OnFileExists) => boolean;
