import { Result } from "@swan-io/boxed";
import { ZodError } from "zod";
import {
  ITemplator,
  I_The_Templator,
  the_templator_object_schema,
  the_templator_schema,
} from "./types";

export function validate_struct(
  arg: I_The_Templator
): Result<I_The_Templator, ZodError<I_The_Templator>> {
  return Result.fromExecution(() =>
    the_templator_object_schema.parse(arg)
  ) as Result<I_The_Templator, ZodError<I_The_Templator>>;
}

export function validate_struct2(
  arg: I_The_Templator
): Result<ITemplator, ZodError<I_The_Templator>> {
  return Result.fromExecution(() => the_templator_schema.parse(arg)) as Result<
    ITemplator,
    ZodError<ITemplator>
  >;
}
