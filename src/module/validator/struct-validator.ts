import { Result } from "@swan-io/boxed";
import { ZodError } from "zod";
import { ITemplator, I_The_Templator, the_templator_schema } from "./types";

export function validate_struct(
  arg: I_The_Templator
): Result<ITemplator, ZodError<I_The_Templator>> {
  return Result.fromExecution(() => the_templator_schema.parse(arg)) as Result<
    ITemplator,
    ZodError<ITemplator>
  >;
}
