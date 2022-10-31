import { Result } from "@swan-io/boxed";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { the_templator_sync } from "../src";

const auto_delete =
  process.argv.length === 3 && process.argv[2] === "auto_delete";

function delete_stuff() {
  Result.fromExecution(() =>
    rmSync(join(process.cwd(), "trash"), { force: false, recursive: true })
  );
}

async function main() {
  delete_stuff();
  try {
    const data = the_templator_sync({
      in_dir: join(process.cwd(), "template", "views", "auth"),
      out_dir: join(process.cwd(), "trash", "test"),
      vars: { name: "project" },
    });

    console.log("Data: ", data);

    if (auto_delete) {
      delete_stuff();
    }
  } catch (error) {
    console.log("error:", error);
    console.log("error data: ", (error as Error).stack);
  }
}

main();
