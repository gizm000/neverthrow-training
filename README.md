# Neverthrowの練習用リポジトリ


throwによる大域脱出を避けて安全なプログラミングを満喫するために役立つNeverthrowですが、慣れるのに少し時間がかかるという意見もあります。  
本リポジトリではTypeScript + jestで練習しやすい環境を用意することで、開発者がNeverthrowに慣れられることを期待します。  

## さいしょに

ソフトウェアにおいて、ドメインをできるだけ忠実にコードに落とし込むことで、違和感のない理にかなったコード設計ができます。  
ドメインをコードに落とし込む際に重要になるものの一つに「ドメインエラー」があります。  
たとえば、Xではポストに対してリプライできるユーザーを制限することができます。  
つまり、「ユーザーが他人のポストに対してリプライする」ユースケースでは、下記のようなドメインエラーが発生する可能性があります。

```ts
/**
 * ドメイン上の制約で発生した例外のサンプル
 * リプライを制限された投稿に対して、リプライしようとすると発生する
 */
class NotPermittedToReply extends Error {
  constructor(message = "この投稿にはリプライできません") {
    super(message);
  }
}
```

「ユーザーがポストに対してリプライする」ユースケースのコードはどのようになるでしょう？  
できる限り単純化して書いてみます。  

```ts
async function replyToPost(postId: string, replierId: string, replyMessage: string) {
  const post = await getPostById(postId);
  const repliedPost = post.reply(replierId, replyMessage);
  await savePost(repliedPost)
  // あれ、NotPermittedToReplyはどこで発生するの？？🤯
}
```

上記のコードでは、実は `post.reply` を実行すると前述の `NotPermittedToReply` が投げられる可能性があります。  
しかし、そのことは `Post` クラスの実装を見ないと明らかではなく、TypeScriptの型システムでは補足できません。  

```ts
class Post {
  public reply(replierId: string, replyMessage: string) {
    // このドメインエラーが発生し得ることが呼び出し元からはわからない😕
    if (...) {
      throw new NotPermittedToReply()
    }
  }
}

async function replyToPost(postId: string, replierId: string, replyMessage: string) {
  const post = await getPostById(postId);
  // ドメインエラーが発生し得ることを確認した上で、try catchを書かないといけない😕
  try {
    const repliedPost = post.reply(replierId, replyMessage);
  } catch (e) {
    if (e instanceof NotPermittedToReply) {
      // ドメインエラーに応じた処理が必要であればここに記載する
    }
  }
  await savePost(repliedPost)
}
```

素早く、適切に価値を届けられるソフトウェアを構築していきたい開発者にとって、頭を悩ませる課題です。  
フロントエンドでこのドメインエラー発生時にユーザーに対して特別なフィードバックを表示する必要があるのに、500エラーでレスポンスが返ってしまって判断できなくなっているかもしれません。より悪いケースでは、開発環境ではエラーメッセージが丸め込まれないからと、レスポンスのエラーメッセージをもとにフロントエンドでフィードバック処理を書いてしまっているかもしれません。開発環境以外では正常に動きません...怖いですね。  
こうしたドメインエラーが起こる可能性を明らかにするための手法として、Result型があります。  

Result型は関数型言語で好んで利用される手法で、最近ではRustで採用されて注目を浴びており、ご存じの方も多いかもしれません。  
TypeScriptでこのResult型を実現するライブラリのひとつに、Neverthrowがあります。  
このNeverthrowを活用することで、ドメインエラーをうまくモデリングすることができます。  
一方で、これまでResult型や関数合成の経験が全くないエンジニアからすると、すこし難解であるという意見もあります。  
私としてはNeverthrowは関数型言語の経験がなくてもResult型や関数合成の恩恵に与れる優れたライブラリだと思っており、より多くの人に使ってもらいたいと考えています。  

```ts
// Neverthrowを使った例
// 下記の実装ではResult型を利用した関数合成を行っている
// 途中の関数でエラーが発生した場合は後続処理はスキップされて、エラーが返却される
// TypeScriptの型定義としても、エラーが発生し得ることが表現される

class Post {
  public reply(replierId: string, replyMessage: string) {
    if (...) {
      // ドメインエラーをthrowせずに、Result型のエラー型としてReturnする
      return Err(new NotPermittedToReply())
    }
  }
}

function replyToPost(postId: string, replierId: string, replyMessage: string) {
  return getPostById(postId).map(
    (post) => ({
      post,
      replierId,
      replyMessage
    }))
    // もしこの中でエラーが返却された場合、savePostはスキップされてエラーがそのまま返却される
    .andThen(post.reply)
    .andThen(savePost)
}
```

Neverthrow関連の情報へのリンク
- [NeverThrow 🙅](https://github.com/supermacro/neverthrow)
- [neverthrow の全機能リファレンス](https://zenn.dev/akineko/articles/3d366bb1fb26f8)
- [【TypeScript】try-catchはもう不要！？NeverThrowを使ったエラーハンドリング](https://nakamuuu.blog/typescript-how-to-use-neverthrow/)


## 使い方

パッケージのインストール `pnpm install` 

DB(sqlite3)の準備 `pnpm migrate` 

jestが動くことの確認 `pnpm test`


`trainings` ディレクトリ配下に練習用のファイルを用意しています。  

- [001-result.spec.ts](./src/trainings/001-result.spec.ts)
- [002-map.spec.ts](./src/trainings/002-map.spec.ts)
- [003-mapErr.spec.ts](./src/trainings/003-mapErr.spec.ts)
- [004-andThen.spec.ts](./src/trainings/004-andThen.spec.ts)
- [005-orElse.spec.ts]
- [006-match.spec.ts]
- [007-combine.spec.ts]
- [008-combineWithAllErrors.spec.ts]
- [009-okAsync.spec.ts]
- [010-errAsync.spec.ts]
- [011-asyncAndThen.spec.ts]
- [012-fromThrowable.spec.ts]
- [013-fromSafePromise.spec.ts]
- [014-fromPromise.spec.ts]


