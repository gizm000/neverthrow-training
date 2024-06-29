import { err, ok } from "neverthrow";

describe("Result型のandThenメソッドを使ってみる", () => {
  it("andThenで関数を合成する", () => {
    const add = (a: number, b: number) => {
      return ok(a + b);
    };

    // 引数を2倍にする関数
    const double = (value: number) => {
      return ok(value * 2);
    };

    // Result型を返却する関数同士は、andThenで合成できる
    // もし引数の型が合わない場合は型エラーになる
    const result = add(1, 2).andThen(double);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(6);
  });

  it("andThenでエラーが発生した場合、エラーが返却される", () => {
    const add = (a: number, b: number) => {
      return ok(a + b);
    };

    // 引数を2倍にする関数　ただし20を超えるとエラー
    const double = (value: number) => {
      const answer = value * 2;
      if (answer > 20) {
        return err(`${answer}は20を超えています`);
      }
      return ok(answer);
    };

    // andThenで関数を合成する
    const result = add(3, 3)
      .andThen(double)
      .andThen(double) // <-- ここでエラーになる
      .andThen(double)
      .andThen(double);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe("24は20を超えています");
  });
});
