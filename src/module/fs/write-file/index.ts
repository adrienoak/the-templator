export * from "./write-file.errors";
export * from "./write-file.types";

import { make_write_file, make_write_file_sync } from "./write-file";

export const write_file_sync = make_write_file_sync();
export const write_file = make_write_file();
