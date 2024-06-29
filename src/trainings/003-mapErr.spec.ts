import { Result, err, ok } from "neverthrow";

describe("Result型のmapErrメソッドを使ってみる", () => {
  it("Result型のエラーをmapErrで変換する", () => {
    type Divide = (a: number, b: number) => Result<number, DivisionByZeroError>;
    class DivisionByZeroError extends Error {
      constructor() {
        super("ゼロ除算はできません");
        this.name = "DivisionByZeroError";
      }
    }
    const divide: Divide = (a, b) => {
      if (b === 0) {
        return err(new DivisionByZeroError());
      }
      return ok(a / b);
    };
    // ゼロ除算でエラーになる
    const result = divide(1, 0).mapErr((err) => {
      return "エラーが発生しました: " + err.name;
    });
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(
      "エラーが発生しました: DivisionByZeroError"
    );
  });
});
