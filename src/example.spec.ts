import { UnexpectedType, isPositive } from "./example";

describe("ok, errの使い方", () => {
  it("okの判定", () => {
    const ret = isPositive(1);
    expect(ret.isOk()).toBeTruthy();
  });
  it("okの値の参照", () => {
    const ret = isPositive(1);
    if (ret.isOk()) {
      expect(ret.value).toBeTruthy();
    }
  });
  it("errの判定", () => {
    const ret = isPositive("1");
    expect(ret.isErr()).toBeTruthy();
  });
  it("errの値の参照", () => {
    const ret = isPositive("1");
    if (ret.isErr()) {
      expect(ret.error).toBeInstanceOf(UnexpectedType);
    }
  });
});
