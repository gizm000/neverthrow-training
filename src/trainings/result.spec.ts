import { ZodError } from "zod";
import { User } from "../entities/user.entity";

/**
 * 一番基本となるResult型について
 */
describe("userのテスト", () => {
  describe("createUser", () => {
    it("OK: ユーザーを作成できる", () => {
      const user = User.create({ name: "test", email: "test@example.com" });
      expect(user._unsafeUnwrap()).toMatchObject({
        id: expect.any(String),
        name: "test",
        email: "test@example.com",
      });
    });
    it("NG: メールアドレスが不正", () => {
      const user = User.create({ name: "test", email: "test" });
      const error = user._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(ZodError);
    });
  });
});
