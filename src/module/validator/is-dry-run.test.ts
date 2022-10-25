import { describe, expect, it } from "vitest";
import { make_is_dry_run_option } from "./is-dry-run";

type Arg =
  | [string | boolean | undefined, undefined | boolean]
  | [string, boolean | undefined]
  | [boolean]
  | [string, boolean];

type TestCases = {
  args: Arg;
  result: boolean;
};

const test_cases: TestCases[] = [
  {
    args: [undefined, undefined],
    result: false,
  },
  {
    args: ["q2e3", undefined],
    result: false,
  },
  {
    args: [false, undefined],
    result: false,
  },
  {
    args: [false],
    result: false,
  },
  {
    args: [true],
    result: true,
  },
  {
    args: ["true", true],
    result: true,
  },
];

describe("is_dry_run", () => {
  for (const tc of test_cases) {
    it(`should get ${tc.result} if it receives ${tc.args}`, () => {
      expect(make_is_dry_run_option(...tc.args)).toBe(tc.result);
    });
  }
});
