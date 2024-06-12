import { err, ok } from "neverthrow";

/**
 * サンプル関数
 * - 引数がnumber以外の場合は例外を返します
 * - 引数が正の数の場合はtrueを返します
 * - 引数が負の数の場合はfalseを返します
 */
export function isPositive(a: number | string) {
  if (typeof a === "string") {
    return err(new UnexpectedType());
  }
  return ok(a > 0);
}

export class UnexpectedType extends Error {
  constructor() {
    super("数値を渡しなさい！");
  }
}

export async function 
