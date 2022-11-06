import {
  OnFileExists,
  OnMkDir,
  OnReadFile,
  OnWriteContent,
} from "../module/fs";

export interface ITemplatorHooks {
  on_read_file?: OnReadFile;
  on_mkdir?: OnMkDir;
  on_file_exists?: OnFileExists;
  on_write_file?: OnWriteContent;
}
