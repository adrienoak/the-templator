import { Result } from "@swan-io/boxed";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { the_templator, the_templator_sync } from "./entry";

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
    const data = await the_templator_sync({
      in_dir: join(process.cwd(), "template", "json", "auth"),
      out_dir: join(process.cwd(), "trash"),
      vars: { fancy: "project-name" },
    });

    console.log("Data: ", data);

    if (auto_delete) {
      delete_stuff();
    }
  } catch (error) {
    console.log("error:", error);
  }
}

main();

export * from "./entry";
