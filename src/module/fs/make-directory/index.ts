import { make_mkdir, make_mkdir_sync } from "./make-directory";

export * from "./make-directory.types";

export const make_dir = make_mkdir();
export const make_dir_sync = make_mkdir_sync();
