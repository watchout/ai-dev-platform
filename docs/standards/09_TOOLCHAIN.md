# 09_TOOLCHAIN.md - 開発ツールチェーン定義

> Claude.ai と Claude Code の2ツール体制で、仕様書を活用し最短で開発に入るための定義

---

## 1. 基本思想

```
docs/（仕様書群） = Single Source of Truth
    ↑
 CLAUDE.md
 (Claude Code)

ツール構成:
  Claude.ai   → 対話・思考・設計
  Claude Code → ファイル操作・実装・テスト

原則:
・仕様書は docs/ に1箇所で管理
・Claude Code が CLAUDE.md を通じて仕様書を参照する
・開発のすべてを Claude.ai + Claude Code で完結させる
```

---

## 2. プロジェクトディレクトリ構造

```
my-project/
├── CLAUDE.md                 ← Claude Code 用指示書
│
├── docs/                     ← 仕様書一式（SSOT）
│   ├── idea/                 ← Phase -1: アイデア検証
│   │   ├── IDEA_CANVAS.md
│   │   ├── USER_PERSONA.md
│   │   ├── COMPETITOR_ANALYSIS.md
│   │   └── VALUE_PROPOSITION.md
│   │
│   ├── requirements/         ← Phase 0: 要件定義
│   │   ├── SSOT-0_PRD.md
│   │   └── SSOT-1_FEATURE_CATALOG.md
│   │
│   ├── design/               ← Phase 1: 設計
│   │   ├── core/
│   │   │   ├── SSOT-2_UI_STATE.md
│   │   │   ├── SSOT-3_API_CONTRACT.md
│   │   │   ├── SSOT-4_DATA_MODEL.md
│   │   │   └── SSOT-5_CROSS_CUTTING.md
│   │   ├── features/
│   │   │   ├── common/       ← 共通機能仕様
│   │   │   └── project/      ← 固有機能仕様
│   │   └── adr/              ← 設計判断記録
│   │
│   ├── standards/            ← 開発規約
│   │   ├── TECH_STACK.md
│   │   ├── CODING_STANDARDS.md
│   │   ├── GIT_WORKFLOW.md
│   │   └── TESTING_STANDARDS.md
│   │
│   ├── operations/           ← 運用
│   │   ├── ENVIRONMENTS.md
│   │   ├── DEPLOYMENT.md
│   │   ├── MONITORING.md
│   │   └── INCIDENT_RESPONSE.md
│   │
│   ├── marketing/            ← マーケティング
│   │   ├── LP_SPEC.md
│   │   ├── SNS_STRATEGY.md
│   │   ├── EMAIL_SEQUENCE.md
│   │   ├── LAUNCH_PLAN.md
│   │   └── PRICING_STRATEGY.md
│   │
│   ├── growth/               ← グロース
│   │   ├── GROWTH_STRATEGY.md
│   │   └── METRICS_DEFINITION.md
│   │
│   ├── notes/                ← ナレッジベース（05参照）
│   │   ├── decisions/
│   │   ├── learnings/
│   │   └── retrospectives/
│   │
│   └── management/           ← プロジェクト管理
│       ├── PROJECT_PLAN.md
│       ├── RISKS.md
│       └── CHANGES.md
│
├── src/                      ← ソースコード
├── tests/                    ← テスト
├── public/                   ← 静的ファイル
└── ...
```

---

## 3. ツール別の役割

| 場面 | Claude.ai | Claude Code |
|------|-----------|-------------|
| アイデア壁打ち | ◎ メイン | |
| ディスカバリーフロー | ◎ メイン | |
| 仕様書の対話的作成 | ◎ メイン | |
| 仕様書のファイル生成 | | ◎ メイン |
| プロジェクト初期構築 | | ◎ メイン |
| 日常のコーディング | | ◎ メイン |
| デバッグ | | ◎ メイン |
| 一括リファクタリング | | ◎ メイン |
| テスト生成 | | ◎ メイン |
| CI/CD設定 | | ◎ メイン |
| 設計の相談 | ◎ メイン | ○ |
| コードレビュー | | ◎ メイン |
| LP実装 | | ◎ メイン |

---

## 4. 開発に入るまでの手順

### 4.1 全体フロー

```
Step 1: アイデア整理         [Claude.ai]
  「○○を作りたい」→ ディスカバリーフロー
        │
        ▼
Step 2: 仕様書一式を生成     [Claude Code]
  claude "docs/idea/ の資料をもとに
         docs/requirements/ と docs/design/ を生成して"
        │
        ▼
Step 3: プロジェクト初期構築  [Claude Code]
  claude "docs/standards/TECH_STACK.md に基づいて
         プロジェクトをスキャフォールドして"
        │
        ▼
Step 4: 日常の開発           [Claude Code]
  claude "AUTH-001の仕様書に基づいてログイン機能を実装して"
  → CLAUDE.md が自動的に読み込まれる
  → 仕様書に基づいてコーディング
        │
        ▼
Step 5: 大きな変更・並列処理  [Claude Code + worktree]
  za "AUTH-001の仕様書に基づいてログイン機能を実装して"
  zb "PAYMENT-001の仕様書に基づいて決済機能を実装して"
```

### 4.2 Step 1: アイデア整理（Claude.ai）

**Claude.ai に送るメッセージ**:
```
新しいプロダクトのアイデアがあります。
○○のようなサービスを作りたいと思っています。

まずはアイデアを整理するところから始めたいです。
段階的に質問してください。
```

→ AIがディスカバリーフロー（Stage 1〜5）を実行
→ 全体サマリーが完成
→ Claude.ai がMarkdown形式で初期資料を出力

### 4.3 Step 2: 仕様書をプロジェクトに配置（Claude Code）

**方法A: Claude.ai の出力をClaude Codeで配置**
```bash
# プロジェクトディレクトリを作成
mkdir -p my-project/docs/{idea,requirements,design,standards,marketing,notes}

# Claude Code で仕様書を生成・配置
cd my-project
claude "以下のアイデアキャンバスの内容をもとに、
       docs/ 配下に仕様書一式を生成してください。

       [Claude.ai で作成した内容をペースト]"
```

**方法B: フレームワークテンプレートから一括生成**
```bash
# テンプレートをコピー
cp -r ai-dev-framework-v3/templates/* docs/

# Claude Code で内容を埋める
claude "docs/idea/IDEA_CANVAS.md に以下の内容を反映して:
       [アイデアの内容]"
```

### 4.4 Step 3: プロジェクト初期構築（Claude Code）

```bash
# CLAUDE.md を配置しプロジェクトを初期化
claude "docs/standards/TECH_STACK.md を読んで、
       以下を実行して:
       1. Next.js + Supabase のプロジェクトを初期化
       2. CLAUDE.md を生成（自己進化型、21_AI_ESCALATION.md 準拠）
       3. 基本的なディレクトリ構造を作成"
```

### 4.5 Step 4: 日常の開発（Claude Code）

```bash
# 機能実装
claude "docs/design/features/common/AUTH-001_login.md の
       仕様に基づいてログイン機能を実装して"

# API実装
claude "docs/core/SSOT-3_API_CONTRACT.md のルールに従って
       APIエンドポイントを作成して"

# デバッグ
claude "ログイン時にエラーが発生する。調査して修正して。"

# テスト
claude "docs/standards/TESTING_STANDARDS.md に基づいて
       src/ 以下の全コンポーネントのテストを生成して"
```

### 4.6 Step 5: 大きな変更・並列処理（Claude Code + worktree）

```bash
# 機能丸ごと実装
claude "docs/design/features/common/AUTH-001_login.md を読んで
       ログイン機能をフル実装して。
       API、UI、テスト全部。"

# 一括リファクタリング
claude "全ファイルのエラーハンドリングを
       docs/core/SSOT-5_CROSS_CUTTING.md に準拠させて"

# 並列実装（git worktree 活用）
za "AUTH-001 を実装して"
zb "PAYMENT-001 を実装して"
```

---

## 5. 使い分けの判断フロー

```
あなたが今やりたいことは？
│
├─ アイデアを整理したい / 戦略を考えたい
│   → Claude.ai
│
├─ ファイルを一括で作りたい / 大きな変更をしたい
│   → Claude Code
│   例: プロジェクト初期構築、機能丸ごと実装、リファクタ
│
├─ コードを書きたい / デバッグしたい / 細かい修正
│   → Claude Code
│   例: UI調整、バグ修正、機能の微調整
│
├─ 独立した機能を同時に進めたい
│   → Claude Code + git worktree（並列実行）
│   例: 認証と決済を同時に実装
│
├─ 仕様書を書きたい / 更新したい
│   ├─ 内容を考える段階 → Claude.ai
│   └─ ファイルに反映する → Claude Code
│
└─ 詰まった / 方針に迷った
    → Claude.ai（壁打ち）
```

---

## 6. フェーズ別の具体的な使い方

### Phase -1〜0: アイデア→仕様

```
[Claude.ai]
  ↓ ディスカバリーフロー実行
  ↓ 仕様の壁打ち・詳細化
  ↓ Markdown出力

[Claude Code]
  ↓ mkdir -p / ファイル配置
  ↓ 仕様書一式の生成
  ↓ CLAUDE.md の生成
```

### Phase 0.5: LP / マーケ

```
[Claude.ai]
  ↓ LP構成・コピーの策定
  ↓ SNS戦略の策定

[Claude Code]
  ↓ LP実装（Next.js + Tailwind）
  ↓ フォーム実装
  ↓ メール配信設定（任意）
  ↓ Analytics設定
```

### Phase 1〜4: 設計・実装

```
[Claude Code] 初回
  ↓ スキャフォールド
  ↓ DB マイグレーション
  ↓ 認証基盤の実装

[Claude Code] 日常
  ↓ 機能実装
  ↓ UI構築
  ↓ デバッグ
  ↓ テスト一括生成
  ↓ リファクタリング

[Claude Code + worktree] 並列実行
  ↓ 独立した機能の同時実装
  ↓ サブエージェントによる分担

[Claude.ai] 必要に応じて
  ↓ 設計の相談
  ↓ 仕様の追加・変更
```

### Phase 5: リリース

```
[Claude Code]
  ↓ CI/CD構築
  ↓ 環境変数設定
  ↓ デプロイスクリプト
  ↓ 最終修正
  ↓ パフォーマンス調整

[Claude.ai]
  ↓ ローンチ戦略の確認
  ↓ コピーの最終チェック
```

---

## 7. git worktree 並列実行

### 概要

```
git worktree を活用して、独立した機能を
複数の Claude Code セッションで同時に実装する。

メリット:
  - 独立した機能を並列で実装できる
  - メインのワークツリーを汚さない
  - 各ブランチで独立したClaude Codeセッションが持てる

制約:
  - 依存関係がある機能は並列化できない
  - マージ時にコンフリクトの可能性がある
```

### ディレクトリ構成

```
~/projects/
├── my-project/              ← メインワークツリー（develop）
├── my-project-a/            ← worktree A（feature/auth）
└── my-project-b/            ← worktree B（feature/payment）
```

### エイリアス設定

```bash
# ~/.bashrc or ~/.zshrc に追加

# worktree A で Claude Code を起動
alias za='cd ~/projects/my-project-a && claude'

# worktree B で Claude Code を起動
alias zb='cd ~/projects/my-project-b && claude'
```

### セットアップ手順

```bash
# 1. メインリポジトリを確認
cd ~/projects/my-project
git status  # develop ブランチにいることを確認

# 2. worktree A を作成
git worktree add ../my-project-a -b feature/auth
# → ~/projects/my-project-a/ が作成される

# 3. worktree B を作成
git worktree add ../my-project-b -b feature/payment
# → ~/projects/my-project-b/ が作成される

# 4. 各 worktree で Claude Code を起動
za  # Terminal A: feature/auth を実装
zb  # Terminal B: feature/payment を実装

# 5. 実装完了後、メインに戻ってマージ
cd ~/projects/my-project
git merge feature/auth
git merge feature/payment

# 6. worktree を削除
git worktree remove ../my-project-a
git worktree remove ../my-project-b
```

### 並列実行のルール

```
1. 並列化の条件
   - 2つの機能が異なるファイルを編集する
   - 依存関係がない（Plan の Wave が異なる等）
   - 共通基盤（DB、認証等）の実装が完了している

2. 並列化してはいけないケース
   - 同じファイルを編集する可能性がある
   - 一方の成果物が他方の前提となる
   - DBマイグレーションが競合する可能性がある

3. マージ時の注意
   - 先にマージした方を基準に、後からのマージでコンフリクトを解消
   - マージ後に統合テストを必ず実行
```

---

## 8. サブエージェント対応

### 概要

```
Claude Code のサブエージェント機能を活用して、
1つのセッション内で複数のタスクを並列実行する。

git worktree: ブランチレベルの並列化（大きな機能単位）
サブエージェント: タスクレベルの並列化（1機能内の小タスク）
```

### サブエージェントの活用シーン

```
1. テスト並列実行
   メインエージェントが実装 → サブエージェントがテスト生成

2. 監査の並列実行
   メインエージェントが次のタスクを実装
   → サブエージェントが前のタスクを監査

3. ドキュメント更新
   メインエージェントがコード実装
   → サブエージェントがAPIドキュメントを更新

4. リファクタリング
   複数のファイルを独立してリファクタリング
```

### CLAUDE.md への設定

```markdown
## サブエージェント設定

サブエージェントを活用する場面:
- テスト生成（実装と並列で進める）
- コード監査（実装完了後に自動起動）
- ドキュメント更新（API変更時に自動起動）

サブエージェントのルール:
- メインエージェントと同じ CLAUDE.md / SSOT を参照する
- メインエージェントが編集中のファイルは変更しない
- 結果はメインエージェントに報告する
```

### worktree との使い分け

```
┌─ 判断フロー ─────────────────────────────────────┐
│                                                    │
│  複数タスクを同時に進めたい                        │
│  │                                                │
│  ├─ 異なるブランチで作業する必要がある？            │
│  │   Yes → git worktree（za / zb）                │
│  │                                                │
│  ├─ 同じブランチ内の小タスク？                     │
│  │   Yes → サブエージェント                       │
│  │                                                │
│  └─ 1つのタスクに集中したい？                      │
│      Yes → 通常の Claude Code セッション          │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 変更履歴

| 日付 | 変更内容 | 変更者 |
|------|---------|-------|
| 2026-02-03 | Cursor削除・Claude Code一本化、git worktree並列実行、サブエージェント対応追加 | AI |
| | 初版作成 | |
