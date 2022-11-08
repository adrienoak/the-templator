import {
  OnFileExistsHook,
  OnMkDirHook,
  OnReadFileHook,
  OnWriteContent,
} from "../module/fs";

export interface ITemplatorHooks {
  on_read_file?: OnReadFileHook;
  on_mkdir?: OnMkDirHook;
  on_file_exists?: OnFileExistsHook;
  on_write_file?: OnWriteContent;
}
