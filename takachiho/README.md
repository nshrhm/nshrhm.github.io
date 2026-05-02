# 宮崎・高千穂・熊本城 旅のしおり

スマートフォン閲覧向けの静的PWA風サイトです。

## 使い方

1. ZIPを解凍します。
2. `index.html` を開くと通常のWebページとして閲覧できます。
3. PWAとしてホーム画面追加・オフラインキャッシュを使う場合は、フォルダごとWebサーバーに配置してください。
   - 例: ローカル確認なら `python3 -m http.server` を実行して `http://localhost:8000/` で開きます。

## ファイル構成

- `index.html`: 旅のしおり本体
- `links.html`: 公式リンク・ルート・食事・天気/交通リンク集
- `styles.css`: デザイン
- `app.js`: A/B分岐、チェックリスト保存、PWAインストール補助
- `sw.js`: Service Worker
- `manifest.webmanifest`: PWAマニフェスト
- `assets/`: アイコン・イラスト
