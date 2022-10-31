import { Option } from "@swan-io/boxed";

type Func<T> = (...args: any) => T;
export function make_promise<T>(
  func: (...args: any) => T | Promise<T>
): Promise<T> {
  return new Promise((res, rej) => {
    try {
      return res(func());
    } catch (err) {
      return rej(err);
    }
  });
}
