# SSOT-5: 横断的関心事

> AI Development Platform のエラー処理・ログ・設定・エスカレーション規約

---

## 基本情報

| 項目 | 内容 |
|------|------|
| プロダクト名 | AI Development Platform |
| バージョン | v0.1.0 |
| 最終更新日 | 2026-02-02 |
| ステータス | Approved |

---

## 1. エラーハンドリング

### 1.1 エラーコード体系

| プレフィックス | カテゴリ | 例 |
|-------------|---------|-----|
| CLI_xxx | CLIコマンドエラー | CLI_001: 不正なコマンド |
| INIT_xxx | 初期化エラー | INIT_001: ディレクトリ既存 |
| DISC_xxx | ディスカバリーエラー | DISC_001: セッション不在 |
| GEN_xxx | 生成エラー | GEN_001: テンプレート不在 |
| PLAN_xxx | 計画エラー | PLAN_001: SSOT未生成 |
| RUN_xxx | 実行エラー | RUN_001: タスク依存未解決 |
| AUD_xxx | 監査エラー | AUD_001: 対象ファイル不在 |
| AI_xxx | AI APIエラー | AI_001: API認証失敗 |
| FS_xxx | ファイルシステムエラー | FS_001: 書き込み権限なし |

### 1.2 エラー表示形式

```
Error [CLI_001]: 不正なコマンドです
  コマンド: framework foo
  利用可能: init, discover, generate, plan, run, audit, status

  ヒント: framework --help でコマンド一覧を確認できます
```

### 1.3 エラーハンドリング原則

- エラーは必ずキャッチし、ユーザーに読みやすい形式で表示する
- スタックトレースはデフォルト非表示（`--verbose` で表示）
- AI APIエラーはリトライ（最大3回、指数バックオフ）
- ファイルシステムエラーは即座にユーザーに通知
- エラーログは `.framework/logs/` に記録

---

## 2. ログ

### 2.1 ログレベル

| レベル | 用途 | 表示条件 |
|-------|------|---------|
| ERROR | 処理続行不可 | 常に表示 |
| WARN | 注意が必要 | 常に表示 |
| INFO | 進捗情報 | デフォルト表示 |
| DEBUG | 詳細情報 | `--verbose` 時 |
| TRACE | AI入出力 | `--trace` 時 |

### 2.2 ログ出力先

| 出力先 | 内容 |
|-------|------|
| stdout | INFO以上のユーザー向けメッセージ |
| stderr | ERROR/WARN |
| `.framework/logs/` | 全レベル（ファイル） |

### 2.3 AI入出力ログ

AI APIとの通信はすべて記録する。

```typescript
interface AILog {
  timestamp: string;
  command: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  duration: number;       // ms
  status: 'success' | 'error' | 'retry';
  // プロンプト・レスポンスは --trace 時のみファイルに保存
}
```

---

## 3. 設定管理

### 3.1 設定ファイル優先順位

```
1. コマンドライン引数（最優先）
2. 環境変数（FRAMEWORK_xxx）
3. プロジェクト設定（.framework/project.json）
4. グローバル設定（~/.config/ai-dev-framework/config.json）
5. デフォルト値
```

### 3.2 環境変数

| 変数名 | 必須 | 説明 | デフォルト |
|-------|------|------|----------|
| ANTHROPIC_API_KEY | YES | Claude API キー | - |
| FRAMEWORK_AI_MODEL | NO | 使用モデル | claude-sonnet-4-20250514 |
| FRAMEWORK_AI_TEMPERATURE | NO | 温度パラメータ | 0 |
| FRAMEWORK_AI_MAX_TOKENS | NO | 最大トークン | 4096 |
| FRAMEWORK_LOG_LEVEL | NO | ログレベル | info |
| FRAMEWORK_AUTO_COMMIT | NO | 自動コミット | false |

### 3.3 .framework/project.json のデフォルト値

```json
{
  "name": "",
  "version": "0.1.0",
  "phase": -1,
  "status": "initialized",
  "techStack": {
    "framework": "next.js",
    "language": "typescript",
    "ui": "react",
    "testing": "vitest",
    "hosting": "vercel"
  },
  "config": {
    "aiProvider": "anthropic",
    "aiModel": "claude-sonnet-4-20250514",
    "autoCommit": false,
    "escalationMode": "strict"
  }
}
```

---

## 4. エスカレーションプロトコル

> 根拠: 21_AI_ESCALATION.md

### 4.1 トリガー条件（MUST停止）

| ID | トリガー | 例 |
|----|---------|-----|
| T1 | SSOTに記載がない仕様判断が必要 | 未定義のエラーケース |
| T2 | SSOT記載が曖昧で複数解釈可能 | 「適切に処理する」 |
| T3 | 技術的選択肢が複数あり判断不可 | ライブラリ選定 |
| T4 | SSOTと既存実装が矛盾 | 型定義の不一致 |
| T5 | 規約に未定義のケース | 命名規則の例外 |
| T6 | 変更の影響範囲が不明 | 共有モジュールの変更 |
| T7 | ビジネス判断が必要 | 優先度の変更 |

### 4.2 禁止行動

- 推測で進める
- デフォルト値を勝手に選択
- TODO/FIXMEで先送り
- 仕様にない機能を追加

### 4.3 エスカレーション形式

```typescript
interface EscalationMessage {
  triggerId: string;     // T1-T7
  context: string;       // 何をしていた時に発生したか
  question: string;      // 明確な質問
  options: {
    id: number;
    description: string;
    impact: string;      // この選択の影響
  }[];
  recommendation: string; // 推奨とその理由
  impactScope: string;   // 影響範囲
}
```

---

## 5. セキュリティ

### 5.1 APIキー管理

- APIキーは環境変数またはシステムキーチェーンで管理
- `.framework/` にAPIキーを保存しない
- ログにAPIキーを出力しない（マスク処理）

### 5.2 ファイルアクセス

- CLIはプロジェクトディレクトリ内のみ操作
- `.framework/` 外のシステムファイルへの書き込み禁止
- 生成コードのセキュリティ監査を自動実行（17_CODE_AUDIT §4）

---

## 6. パフォーマンス

### 6.1 AI API呼び出し

- ストリーミングレスポンスをデフォルト使用（UX向上）
- リトライ: 最大3回、指数バックオフ（2s, 4s, 8s）
- タイムアウト: 120秒

### 6.2 ファイル操作

- 大量ファイル生成時は並列書き込み（最大5並列）
- テンプレート展開はメモリ上で実行

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|----------|---------|-------|
| 2026-02-02 | v0.1.0 | 初版作成 | AI |
