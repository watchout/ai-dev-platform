# CLAUDE.md - プロジェクト指示書（Claude Code用）

> Claude Code はこのファイルを自動で読み込みます。
> プロジェクトの全仕様書は docs/ にあります。

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
詳細: docs/standards/21_AI_ESCALATION.md

## プロジェクト概要

| 項目 | 内容 |
|------|------|
| プロダクト名 | AI Development Platform |
| 概要 | AI開発フレームワークのCLIツール＋ダッシュボード。ディスカバリーからデプロイまでの開発ライフサイクル全体を自動化 |
| 技術スタック | Next.js 15 / React 19 / TypeScript / Vitest / Vercel |
| リポジトリ | ai-dev-platform |

---

## 最重要ルール

```
1. 仕様書がない機能は実装しない
2. 実装前に必ず該当の仕様書を読む
3. 仕様と実装の乖離を見つけたら報告する
4. コア定義（docs/design/core/）は原則変更不可
```

---

## 仕様書の参照方法

### 実装前に必ず確認するドキュメント（優先順）

```
1. 機能仕様書         → docs/design/features/
2. コア定義           → docs/design/core/
   - UI/状態遷移      → docs/design/core/SSOT-2_UI_STATE.md
   - API規約          → docs/design/core/SSOT-3_API_CONTRACT.md
   - データモデル     → docs/design/core/SSOT-4_DATA_MODEL.md
   - 横断的関心事     → docs/design/core/SSOT-5_CROSS_CUTTING.md
3. 開発規約           → docs/standards/
   - コーディング規約 → docs/standards/CODING_STANDARDS.md
   - テスト規約       → docs/standards/TESTING_STANDARDS.md
   - Git運用          → docs/standards/GIT_WORKFLOW.md
4. PRD               → docs/requirements/SSOT-0_PRD.md
```

### 機能を実装する時のフロー

```
1. 対象の機能仕様書を読む
   → docs/design/features/common/  （共通機能）
   → docs/design/features/project/ （固有機能）

2. 関連するコア定義を確認
   → API設計 → SSOT-3
   → DB設計 → SSOT-4
   → 認証/エラー/ログ → SSOT-5

3. 実装
   → コーディング規約に従う
   → テスト規約に従う

4. テスト
   → 仕様書のテストケースに基づく
```

---

## ディレクトリ構造

```
src/
├── cli/                  ← CLIツール (framework init/run/status)
├── dashboard/            ← Next.js ダッシュボードアプリ
│   ├── app/              ← App Router ページ
│   ├── components/       ← UIコンポーネント
│   └── lib/              ← ユーティリティ
├── lib/                  ← 共有ライブラリ
├── types/                ← TypeScript 型定義
├── integrations/         ← GitHub, Plane, Discord連携
└── __tests__/            ← テスト

docs/
├── idea/                 ← アイデア・検証
├── requirements/         ← 要件定義
├── design/               ← 設計
│   ├── core/             ← コア定義（変更不可）
│   ├── features/         ← 機能仕様
│   │   ├── common/       ← 共通機能
│   │   └── project/      ← 固有機能
│   └── adr/              ← 設計判断記録
├── standards/            ← 開発規約・フレームワーク文書
├── operations/           ← 運用
├── marketing/            ← マーケティング
├── growth/               ← グロース
└── management/           ← プロジェクト管理
```

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

> 詳細: docs/standards/CODING_STANDARDS.md

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

> 詳細: docs/standards/GIT_WORKFLOW.md

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

> 詳細: docs/standards/TESTING_STANDARDS.md

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
- コア定義を勝手に変更しない
- テストなしでPRを出さない
- any 型を使わない
- console.log をプロダクションコードに残さない
- 環境変数をハードコードしない
- エラーを握りつぶさない（必ずハンドリング）
```
