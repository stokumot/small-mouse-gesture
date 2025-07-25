# Small Mouse Gesture

ブラウザ操作を快適にするための軽量なマウスジェスチャーを提供するChrome拡張機能です。
公開されているエクステンションでは余計な機能がもりもりのものが多いので、自前で用意したものになります。

## 機能

- **タブを閉じる**: 右クリックしながらマウスを `↓` `←` と動かします。
- **名前を付けて画像を保存**: 画像の上で右クリックしながらマウスを `↓` `→` と動かします。

## インストール方法

1. このリポジトリをダウンロードし、任意の場所に展開します。
2. Chromeブラウザを開き、アドレスバーに `chrome://extensions` と入力して拡張機能管理ページを開きます。
3. ページの右上にある **「デベロッパー モード」** のスイッチをオンにします。
4. **「パッケージ化されていない拡張機能を読み込む」** ボタンをクリックします。
5. ファイル選択ダイアログで、このリポジトリを展開したフォルダを選択します。


## ファイル構成

- `manifest.json`: 拡張機能の構成ファイル
- `src/background.js`: イベントを処理するバックグラウンドスクリプト
- `src/content.js`: Webページに挿入され、マウスイベントを検知するスクリプト
- `src/trail.js`: 軌跡描画とキャンバス管理を行うスクリプト

### 対応ジェスチャー

| ジェスチャー | 機能 | 説明 |
|--------------|------|------|
| `DL` | タブを閉じる | 下→左の動作で現在のタブを閉じる |
| `DR` | 名前を付けて画像を保存 | 画像上で下→右の動作で画像を保存 |

## 開発について

このプロジェクトは以下の構成で開発されています：

- **Manifest V3**: 最新のChrome拡張機能仕様に準拠
- **モジュール設計**: 機能別にファイルを分割し、保守性を向上
- **権限最小化**: 必要最小限の権限のみを要求

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

