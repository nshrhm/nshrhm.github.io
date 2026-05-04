# 秋月ドライブ旅のしおり PWA風Webページ

## 開き方

1. ZIPを展開します。
2. まず `index.html` をブラウザで開きます。
3. `links.html` がリンク集ページです。

## PWA機能について

Service Workerによるオフラインキャッシュや「アプリ風に追加」は、通常 `file://` では動作しません。PWAとして使う場合は、HTTPSサーバーに置くか、ローカルで以下のように配信してください。

```bash
cd akizuki_shiori_pwa
python3 -m http.server 8080
```

その後、スマートフォンやPCのブラウザで `http://localhost:8080` または同一ネットワークの端末から開きます。

## 注意

店舗の営業時間・定休日・道路状況・天気は変わることがあります。出発前にリンク集から公式情報、Google Maps、JARTIC、気象庁を確認してください。
