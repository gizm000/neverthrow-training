import { err, ok } from "neverthrow";

describe("mapを使ってみる", () => {
  it("Result型の値をmapで変換する", () => {
    // type Add = (a: number, b: number) => Result<number, never>;

    const add = (a: number, b: number) => {
      return ok(a + b);
    };

    // mapを使うと、Result型の正常時の値を変換できる
    const result = add(1, 2).map((value) => {
      return value * 2;
    });

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(6);
  });

  it("mapで定義した変換はエラー発生時には実行されない", () => {
    // type Divide = (a: number, b: number) => Result<number, DivisionByZeroError>;
    class DivisionByZeroError extends Error {
      constructor() {
        super("ゼロ除算はできません");
        this.name = "DivisionByZeroError";
      }
    }

    const divide = (a: number, b: number) => {
      if (b === 0) {
        return err(new DivisionByZeroError());
      }
      return ok(a / b);
    };

    // ゼロ除算でエラーになる
    const result = divide(1, 0).map((value) => {
      // divide関数実行時にエラーになっているので、この処理は実行されない！
      return value * 2;
    });

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().name).toBe("DivisionByZeroError");
  });
});
