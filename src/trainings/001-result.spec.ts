import { Ok, err, ok } from "neverthrow";

describe("Result型を使ってみる", () => {
  it("足し算の結果がResult型で返ってくること", () => {
    // type Add = (a: number, b: number) => Result<number, never>;

    // andThenを使うとコードファーストで書いたときに戻り値の型がResult型になる
    const add = (a: number, b: number) => {
      return ok(null).andThen(() => {
        return ok(a + b);
      });
    };

    // OkはIResultをimplementsしているので、Result型を満たす
    const add2 = (a: number, b: number) => {
      return new Ok(a + b);
    };

    // これでも書ける
    const add3 = (a: number, b: number) => {
      return ok(a + b);
    };

    const result = add2(1, 2);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(3);

    const result2 = add3(1, 2);
    expect(result2.isOk()).toBe(true);
    expect(result2._unsafeUnwrap()).toBe(3);

    const result3 = add(1, 2);
    expect(result3.isOk()).toBe(true);
    expect(result3._unsafeUnwrap()).toBe(3);
  });

  it("除算の結果がResult型で返ってくること", () => {
    // type Divide = (a: number, b: number) => Result<number, DivisionByZeroError>;
    class DivisionByZeroError extends Error {
      constructor() {
        super("ゼロ除算はできません");
        this.name = "DivisionByZeroError";
      }
    }

    const divide = (a: number, b: number) => {
      return ok(null).andThen(() => {
        if (b === 0) {
          return err(new DivisionByZeroError());
        }
        return ok(a / b);
      });
    };

    // これだとResult型にならないので、戻り値の型が少しわかりにくい
    const divide2 = (a: number, b: number) => {
      if (b === 0) {
        return err(new DivisionByZeroError());
      }
      return ok(a / b);
    };

    const result = divide(4, 2);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(2);

    const errorResult = divide2(4, 0);
    expect(errorResult.isErr()).toBe(true);
    expect(errorResult._unsafeUnwrapErr()).toBeInstanceOf(DivisionByZeroError);
  });
});
