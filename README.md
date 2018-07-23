# akashic-analytics

**akashic-analytics** は、Akashic-Engineを利用したゲームコンテンツの利用状況に関する情報(プレイ数、スコア、滞在時間など)を GoogleAnalytics に送るためのライブラリです。
ただし、グローバル変数 `dataLayer` が存在する時のみ動作します。存在しない場合は、何の処理も行いません。

## 利用方法

1. 対象のゲームで **akashic-analytics** を `akashic install` します。
    * `akashic install akashic-analytics`
2. 対象のゲームのソース中で `GoogleAnalyticsService` を継承したクラスを作成します。
    * GTMで設定されているタグが受け取れるデータ構造のデータを返すように`createEventData`を実装します。
3. 以下の `GoogleAnalyticsService` の`send()`でGA に情報を送ります。また、以下のデフォルトで実装されているメソッドでも送ることができます。
    * `sendClick()`: 何かしらのボタンがクリックされたことを送信
    * `sendAdvance()`: ゲームの進行状況(ステージ番号)を送信
    * `sendClear()`: ゲームがクリアされたことを送信
    * `sendScore()`: ゲームのスコアを送信
4. 対象のAkashicコンテンツ側でGTMタグを埋め込む
  * 対象のAkashicコンテンツに新規ディレクトリ(例:innerhtml)を切って、そのディレクトリ下にGTMタグが書かれたhtmlファイル(例：gtm.html)を置く
  * 上記で作成したhtmlファイルを取り込んだhtmlをexportする
    * `akashic export html --output game --inject innerhtml/gtm.html`

## ビルド方法

**akashic-analytics** はTypeScriptで書かれたjsモジュールであるため、ビルドにはNode.jsが必要です。

`npm run build` によりビルドできます。

```sh
npm install
npm run build
```
