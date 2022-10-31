import { make_create_file, make_create_file_sync } from "./create-file";

export * from "./create-file.types";

export const create_file = make_create_file();
export const create_file_sync = make_create_file_sync();
