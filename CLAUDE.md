# CLAUDE.md - プロジェクト指示書（Claude Code用）

> Claude Code はこのファイルを自動で読み込みます。
> このリポジトリはCLIツール＋ダッシュボードの実装のみです。
> フレームワーク仕様書（SSOT）は ai-dev-framework リポジトリにあります。

---

## SSOT の所在

```
ai-dev-framework リポジトリ = 唯一の真実（SSOT）
  → フレームワーク仕様書（00〜24）
  → テンプレート・チェックリスト
  → docs/standards/ のすべて

ai-dev-platform リポジトリ = CLIツール＋ダッシュボード
  → フレームワークの実装のみ
  → docs/standards/ は持たない（framework init/update で取得）
```

---

## AI中断プロトコル（最優先ルール）

以下の場合、即座に作業を中断しユーザーに質問すること:

1. SSOTに記載がない仕様判断が必要な時
2. SSOTの記載が曖昧で複数解釈が可能な時
3. 技術的な選択肢が複数あり判断できない時
4. SSOTと既存実装が矛盾している時
5. 制約・規約に未定義のケースに遭遇した時
6. 変更の影響範囲が判断できない時
7. ビジネス判断が必要な時

「推測で進める」「とりあえず仮で」は禁止。
参照: ai-dev-framework/21_AI_ESCALATION.md

## プロジェクト概要

| 項目 | 内容 |
|------|------|
| プロダクト名 | AI Development Platform |
| 概要 | AI開発フレームワークのCLIツール＋ダッシュボード。ディスカバリーからデプロイまでの開発ライフサイクル全体を自動化 |
| 技術スタック | Next.js 15 / React 19 / TypeScript / Vitest / Vercel |
| リポジトリ | ai-dev-platform |
| フレームワーク仕様 | ai-dev-framework（SSOT） |

---

## 最重要ルール

```
1. 仕様書がない機能は実装しない
2. 実装前に必ず ai-dev-framework の該当仕様書を読む
3. 仕様と実装の乖離を見つけたら報告する
4. フレームワーク仕様書はこのリポジトリには配置しない（SSOTは ai-dev-framework）
```

---

## CLI コマンド一覧

| コマンド | 対応仕様書 | 説明 |
|---------|-----------|------|
| `framework init` | 09_TOOLCHAIN | プロジェクト初期化＋フレームワーク取得 |
| `framework discover` | 08_DISCOVERY_FLOW | アイデア検証 |
| `framework generate` | 10_GENERATION_CHAIN | SSOT自動生成 |
| `framework plan` | 14_IMPLEMENTATION_ORDER | 実装計画 |
| `framework audit` | 13, 16, 17 | SSOT/プロンプト/コード監査 |
| `framework run` | 06_FULL_LIFECYCLE | フェーズ実行 |
| `framework status` | 06_FULL_LIFECYCLE | 進捗表示 |
| `framework retrofit` | - | 既存プロジェクトの移行 |
| `framework update` | - | フレームワーク仕様書の更新 |

---

## ディレクトリ構造

```
src/
├── cli/                  ← CLIツール (framework init/discover/generate/...)
│   ├── commands/         ← コマンド定義
│   └── lib/              ← エンジン・ユーティリティ
├── dashboard/            ← Next.js ダッシュボードアプリ
│   ├── app/              ← App Router ページ
│   ├── components/       ← UIコンポーネント
│   └── lib/              ← ユーティリティ
├── lib/                  ← 共有ライブラリ
├── types/                ← TypeScript 型定義
├── integrations/         ← GitHub Projects, Discord連携
└── __tests__/            ← テスト
```

---

## Agent Teams（CLI パターン）

`framework init` で生成されるプロジェクトには `.claude/agents/` が自動配置される。
このリポジトリ自体の開発でも Agent Teams を活用すること。

### エージェント定義テンプレート（templates.ts で生成）

```
.claude/agents/
├── visual-tester.md     ← ビジュアルテスト専門（20_VISUAL_TEST.md §4）
├── code-reviewer.md     ← Adversarial Review Role B（17_CODE_AUDIT.md）
└── ssot-explorer.md     ← SSOT検索・要約
```

### 関連コード

```
src/cli/lib/templates.ts          ← エージェントテンプレート生成関数
src/cli/lib/project-structure.ts  ← .claude/agents ディレクトリ定義
src/cli/commands/init-action.ts   ← Step 7 でテンプレート配置
```

### 参照ドキュメント

- ai-dev-framework/09_TOOLCHAIN.md §8: Agent Teams アーキテクチャ
- ai-dev-framework/20_VISUAL_TEST.md §4: CLI パターンでのビジュアルテスト
- ai-dev-framework/17_CODE_AUDIT.md: Adversarial Review の4実行方法

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript 5.7 |
| UI | React 19 |
| ホスティング | Vercel |
| テスト | Vitest |
| リンター | ESLint 9 |
| CI/CD | GitHub Actions |

---

## コーディング規約（要約）

### 命名規則
- コンポーネント: PascalCase（`LoginForm.tsx`）
- 関数/変数: camelCase（`handleSubmit`）
- 定数: UPPER_SNAKE_CASE（`MAX_RETRY_COUNT`）
- ファイル: kebab-case（`login-form.tsx`）（コンポーネント以外）
- 型/Interface: PascalCase + 接尾辞（`UserResponse`, `AuthState`）

### 基本原則
- 1ファイル200行以内を目安
- 1関数1責務
- マジックナンバー禁止（定数化する）
- any 禁止（型を明示する）
- コメントは「なぜ」を書く（「何を」はコードで表現）

---

## Git 運用（要約）

### ブランチ戦略
```
main ← production
  └── develop ← 開発統合
        └── feature/XXX-description ← 機能開発
        └── fix/XXX-description ← バグ修正
        └── hotfix/XXX-description ← 緊急修正
```

### コミットメッセージ
```
<type>(<scope>): <description>

type: feat | fix | docs | style | refactor | test | chore
scope: 機能ID or モジュール名
```

---

## テスト規約（要約）

### テスト種類
- ユニットテスト: 全ビジネスロジック
- 統合テスト: API エンドポイント
- E2Eテスト: クリティカルパス

### カバレッジ目標
- ビジネスロジック: 80%+
- API: 70%+
- 全体: 60%+

---

## 禁止事項

```
- 仕様書にない機能を勝手に実装しない
- フレームワーク仕様書をこのリポジトリに配置しない（SSOTは ai-dev-framework）
- テストなしでPRを出さない
- any 型を使わない
- console.log をプロダクションコードに残さない
- 環境変数をハードコードしない
- エラーを握りつぶさない（必ずハンドリング）
```
