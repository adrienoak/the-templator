import { assert, describe, expect, it } from "vitest";
import {
  non_int_number_error,
  number_too_small,
  positive_number_error,
  invalid_vars_type,
} from "./error-messages";
import { validate_struct } from "./struct-validator";

describe("validate struct", () => {
  it("should fail if no in_dir gets passed", () => {
    // @ts-expect-error
    const result = validate_struct({ in_dir: "" });
    expect(result.isError()).toBe(true);
    assert(result.isError());
    const err = result.getError().format();

    expect(err.in_dir?._errors).toHaveLength(1);
    expect(err.out_dir?._errors).toHaveLength(1);
  });

  it("should fail if no in_dir gets passed", () => {
    // @ts-expect-error
    const result = validate_struct({ in_dir: "as" });
    expect(result.isError()).toBe(true);
    assert(result.isError());
    const err = result.getError().format();

    expect(err.out_dir?._errors).toHaveLength(1);
  });

  it("should fail if no out_dir gets passed", () => {
    // @ts-expect-error
    const result = validate_struct({ out_dir: "as" });
    expect(result.isError()).toBe(true);
    assert(result.isError());
    const err = result.getError().format();

    expect(err.in_dir?._errors).toHaveLength(1);
  });

  it("should fail if no out_dir gets passed", () => {
    // @ts-expect-error
    const result = validate_struct({ out_dir: "as" });
    expect(result.isError()).toBe(true);
    assert(result.isError());
    const err = result.getError().format();

    expect(err.in_dir?._errors).toHaveLength(1);
  });

  it("should fail if wrong ammount of numbers", () => {
    const result = validate_struct({
      out_dir: "as",
      in_dir: "asdflkj",
      number: 1.1,
    });

    expect(result.isError()).toBe(true);
    assert(result.isError());
    const err = result.getError().format();

    expect(err.number?._errors).toHaveLength(2);
    expect(err.number?._errors[0]).toBe(non_int_number_error);
    expect(err.number?._errors[1]).toBe(number_too_small);
  });
  it("should fail if negative numbers", () => {
    const result = validate_struct({
      out_dir: "as",
      in_dir: "asdflkj",
      number: -1,
    });

    expect(result.isError()).toBe(true);
    assert(result.isError());
    const err = result.getError().format();

    expect(err.number?._errors).toHaveLength(2);
    expect(err.number?._errors[0]).toBe(positive_number_error);
    expect(err.number?._errors[1]).toBe(number_too_small);
  });

  it("should fail if negative and floating numbers", () => {
    const result = validate_struct({
      out_dir: "as",
      in_dir: "asdflkj",
      number: -1.1,
    });

    expect(result.isError()).toBe(true);
    assert(result.isError());
    const err = result.getError().format();

    expect(err.number?._errors).toHaveLength(3);
    expect(err.number?._errors[0]).toBe(positive_number_error);
    expect(err.number?._errors[1]).toBe(non_int_number_error);
    expect(err.number?._errors[2]).toBe(number_too_small);
  });
  it("should fail if vars are not right type", () => {
    const result = validate_struct({
      out_dir: "as",
      in_dir: "asdflkj",
      //   @ts-expect-error
      vars: {
        [1]: true,
        [2]: true,
      },
    });

    assert(result.isError());
    const err = result.getError().format();
    expect(Object.keys(err.vars!)?.length).toBeGreaterThanOrEqual(2);
    // console.dir(err.vars, { depth: null });
  });

  it("should fail if vars are not right type", () => {
    const result = validate_struct({
      out_dir: "as",
      in_dir: "asdflkj",
      //   @ts-expect-error
      vars: "",
    });

    assert(result.isError());
    const err = result.getError().format();
    expect(err.vars?._errors[0]).toBe(invalid_vars_type);
  });
});
