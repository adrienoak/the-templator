import { Result } from "@swan-io/boxed";

async function test() {
  return new Promise((r) => setTimeout(() => r(1), 1000));
}
async function main() {
  const res = await Result.fromPromise(test());
  console.log("res:", res);
  const withStuff = Result.fromExecution(witherror);
  console.log("withStuff:", withStuff.isError());
}

function witherror(): string {
  throw new Error("OOpsie");
}

main();

export * from "./entry";
