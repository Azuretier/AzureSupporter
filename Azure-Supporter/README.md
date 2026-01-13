# Azure Supporter

__Azuret__のDiscordサーバーをサポートするための多機能Botです。
TypeScriptとdiscord.jsを使用して開発されています。

## 🚀 主な機能

現在、以下のコマンドを実装中・予定しています。

### 1. ロール選択パネル (`/select-role`)
サーバーメンバーが自分で役割（ロール）を選択できるパネルを表示します。
- ボタンやセレクトメニューを使用して、直感的にロールを付与・解除できます。
- 管理者は簡単に設定をカスタマイズ可能です。

### 2. ランクシステム (`/rank`)
サーバー内での活動量（メッセージ送信など）に応じてレベルが上がります。
- 現在の経験値（XP）、レベル、ランキング順位を確認できます。
- 活動を可視化することで、コミュニティの活性化を促します。

## 🛠 技術スタック
- **Language:** TypeScript
- **Library:** discord.js
- **Database:** Google Firestore (Firebase)
- **Dashboard:** 将来的にWebサイトからロール編集などを可能にする予定
- **Runtime:** Node.js

### インストール可能
   ```bash
   git clone https://github.com/Azuretier/Azure-Supporter.git
   cd Azure-Supporter
   ```
