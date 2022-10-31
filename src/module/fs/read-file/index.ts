import { make_read_file, make_read_file_sync } from "./read-file";
export * from "./read-file.types";

export const read_file = make_read_file();

export const read_file_sync = make_read_file_sync();
