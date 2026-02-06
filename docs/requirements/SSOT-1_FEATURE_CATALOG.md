# SSOT-1: 機能台帳（Feature Catalog）

> AI Development Platform の全機能一覧

---

## 基本情報

| 項目 | 内容 |
|------|------|
| プロダクト名 | AI Development Platform |
| バージョン | v0.1.0 |
| 最終更新日 | 2026-02-02 |
| ステータス | Approved |

---

## 機能一覧サマリー

| カテゴリ | 機能数 | 対象 | スコープ外 |
|---------|-------|------|----------|
| 1. CLIコア | 7 | 7 | 0 |
| 2. ディスカバリーエンジン | 5 | 5 | 0 |
| 3. ドキュメント生成 | 6 | 6 | 0 |
| 4. タスク管理 | 4 | 4 | 0 |
| 5. 自動開発 | 5 | 5 | 0 |
| 6. 監査エンジン | 5 | 5 | 0 |
| 7. ダッシュボード | 4 | 0 | 4 |
| 8. 外部連携 | 3 | 0 | 3 |
| **合計** | **39** | **32** | **7** |

---

## 1. CLIコア（CLI）

| ID | 機能 | 必要 | 優先度 | 状態 | 根拠ドキュメント |
|----|------|------|-------|------|----------------|
| CLI-001 | framework init（プロジェクト初期化） | ☑ | P0 | Backlog | 00_MASTER_GUIDE |
| CLI-002 | framework discover（ディスカバリー実行） | ☑ | P0 | Backlog | 08_DISCOVERY_FLOW |
| CLI-003 | framework generate（SSOT生成チェーン） | ☑ | P0 | Backlog | 10_GENERATION_CHAIN |
| CLI-004 | framework plan（実装計画生成） | ☑ | P0 | Backlog | 14_IMPLEMENTATION_ORDER |
| CLI-005 | framework run（自動開発実行） | ☑ | P0 | Backlog | 15-19 |
| CLI-006 | framework audit（監査実行） | ☑ | P0 | Backlog | 13,16,17,18,22 |
| CLI-007 | framework status（進捗表示） | ☑ | P1 | Backlog | 01_DEVELOPMENT_PROCESS |

### CLI-001: framework init 受入条件

```
- [ ] AC1: コマンド実行でプロジェクトディレクトリ構造が生成される（09_TOOLCHAIN準拠）
- [ ] AC2: docs/ 配下に全SSOTテンプレートが配置される
- [ ] AC3: CLAUDE.md が生成され、プロジェクト情報が反映される
- [ ] AC4: .cursorrules が生成される
- [ ] AC5: package.json が生成され、依存関係が含まれる
- [ ] AC6: tsconfig.json / next.config.ts が生成される
- [ ] AC7: .gitignore が生成される
```

### CLI-002: framework discover 受入条件

```
- [ ] AC1: 5ステージの対話型ヒアリングが実行される（08_DISCOVERY_FLOW準拠）
- [ ] AC2: 各ステージ後に整理・確認が行われる
- [ ] AC3: 条件分岐が正しく動作する（Q2-4→Q2-5等）
- [ ] AC4: 曖昧な回答に対して深掘り質問が行われる
- [ ] AC5: 完了時に初期資料が自動生成される（IDEA_CANVAS等）
- [ ] AC6: 中断・再開ができる
```

### CLI-003: framework generate 受入条件

```
- [ ] AC1: Step1（ビジネス）: IDEA_CANVAS→PERSONA→COMPETITOR→VALUE_PROPが順次生成される
- [ ] AC2: Step2（プロダクト）: PRD→FEATURE_CATALOG→UI_STATE→機能別SSOTが生成される
- [ ] AC3: Step3（技術）: TECH_STACK→API→DATA_MODEL→CROSS_CUTTING→規約が生成される
- [ ] AC4: 各ドキュメントは前段の出力を入力として使用する（チェーン）
- [ ] AC5: 各ステップの完了時にユーザー確認が行われる
- [ ] AC6: 生成されたSSOTは12_SSOT_FORMAT準拠のフォーマットである
```

### CLI-004: framework plan 受入条件

```
- [ ] AC1: SSOTのS11（依存関係）からDependency Graphが構築される
- [ ] AC2: トポロジカルソートによるWave分割が行われる
- [ ] AC3: 各SSOTが5-8タスクに分解される（DB/API/UI/統合/テスト/レビュー）
- [ ] AC4: タスクごとに実装プロンプトが生成される（15_PROMPT_FORMAT準拠）
- [ ] AC5: 優先度（P0>P1>P2）とサイズ（S/M/L/XL）が付与される
```

### CLI-005: framework run 受入条件

```
- [ ] AC1: 実装プロンプトに基づいてAIがコードを生成する
- [ ] AC2: 生成コードが自動でリポジトリにコミットされる
- [ ] AC3: 判断が必要な場合に即座にユーザーに確認する（21_AI_ESCALATION準拠）
- [ ] AC4: 推測で進めず、不明点は必ず確認する
- [ ] AC5: タスク完了ごとに自動監査が実行される
```

### CLI-006: framework audit 受入条件

```
- [ ] AC1: SSOT監査（100点満点、95点以上で合格 / 13_SSOT_AUDIT準拠）
- [ ] AC2: プロンプト監査（100点満点、100点で合格 / 16_PROMPT_AUDIT準拠）
- [ ] AC3: コード監査（100点満点、100点で合格 / 17_CODE_AUDIT準拠）
- [ ] AC4: テスト監査（100点満点 / 18_TEST_FORMAT準拠）
- [ ] AC5: 不合格時に具体的な修正指示が出力される
- [ ] AC6: 再監査フローが実行できる
```

### CLI-007: framework status 受入条件

```
- [ ] AC1: 現在のフェーズと進捗率が表示される
- [ ] AC2: 各SSOTの完成度（%）が表示される
- [ ] AC3: 各タスクの状態（Backlog/In Progress/Done）が表示される
- [ ] AC4: 監査スコアの一覧が表示される
```

---

## 2. ディスカバリーエンジン（DISC）

| ID | 機能 | 必要 | 優先度 | 状態 | 根拠ドキュメント |
|----|------|------|-------|------|----------------|
| DISC-001 | Stage 1: アイデアの核（4問） | ☑ | P0 | Backlog | 08 Stage 1 |
| DISC-002 | Stage 2: 課題の深掘り（6問） | ☑ | P0 | Backlog | 08 Stage 2 |
| DISC-003 | Stage 3: ソリューション設計（5問） | ☑ | P0 | Backlog | 08 Stage 3 |
| DISC-004 | Stage 4: 市場・競合（3問） | ☑ | P0 | Backlog | 08 Stage 4 |
| DISC-005 | Stage 5: ビジネス・技術（8問） | ☑ | P0 | Backlog | 08 Stage 5 |

---

## 3. ドキュメント生成（GEN）

| ID | 機能 | 必要 | 優先度 | 状態 | 根拠ドキュメント |
|----|------|------|-------|------|----------------|
| GEN-001 | ビジネス資料生成（IDEA_CANVAS/PERSONA/COMPETITOR/VALUE_PROP） | ☑ | P0 | Backlog | 10 Step 1 |
| GEN-002 | プロダクト資料生成（PRD/FEATURE_CATALOG/UI_STATE） | ☑ | P0 | Backlog | 10 Step 2 |
| GEN-003 | 機能別SSOT生成（12セクション/IEEE準拠） | ☑ | P0 | Backlog | 11, 12 |
| GEN-004 | 技術資料生成（TECH_STACK/API/DATA_MODEL/CROSS_CUTTING） | ☑ | P0 | Backlog | 10 Step 3 |
| GEN-005 | 開発規約生成（CODING_STANDARDS/GIT_WORKFLOW/TESTING_STANDARDS） | ☑ | P0 | Backlog | 10 Step 3 |
| GEN-006 | マーケティング資料生成（LP/SNS/EMAIL/LAUNCH/PRICING） | ☑ | P1 | Backlog | 07, 10 Step 2 |

---

## 4. タスク管理（TASK）

| ID | 機能 | 必要 | 優先度 | 状態 | 根拠ドキュメント |
|----|------|------|-------|------|----------------|
| TASK-001 | Dependency Graph構築 | ☑ | P0 | Backlog | 14 §3 |
| TASK-002 | トポロジカルソート・Wave分割 | ☑ | P0 | Backlog | 14 §3 |
| TASK-003 | タスク分解（SSOT→5-8タスク） | ☑ | P0 | Backlog | 14 §4 |
| TASK-004 | 実装プロンプト生成 | ☑ | P0 | Backlog | 15 |

---

## 5. 自動開発（DEV）

| ID | 機能 | 必要 | 優先度 | 状態 | 根拠ドキュメント |
|----|------|------|-------|------|----------------|
| DEV-001 | AI実装実行（プロンプト→コード） | ☑ | P0 | Backlog | 15 |
| DEV-002 | エスカレーション（確認フロー） | ☑ | P0 | Backlog | 21 |
| DEV-003 | テスト自動生成・実行 | ☑ | P0 | Backlog | 18 |
| DEV-004 | CI/PR自動化 | ☑ | P1 | Backlog | 19 |
| DEV-005 | デプロイ・リリース | ☑ | P1 | Backlog | 23 |

---

## 6. 監査エンジン（AUD）

| ID | 機能 | 必要 | 優先度 | 状態 | 根拠ドキュメント |
|----|------|------|-------|------|----------------|
| AUD-001 | SSOT監査（10カテゴリ/100点） | ☑ | P0 | Backlog | 13 |
| AUD-002 | プロンプト監査（8カテゴリ/100点） | ☑ | P0 | Backlog | 16 |
| AUD-003 | コード監査（8カテゴリ/100点） | ☑ | P0 | Backlog | 17 |
| AUD-004 | テスト監査（6カテゴリ/100点） | ☑ | P0 | Backlog | 18 |
| AUD-005 | 機能受入テスト（5カテゴリ/100点） | ☑ | P1 | Backlog | 22 |

---

## 7. ダッシュボード（DASH）- Phase 3

| ID | 機能 | 必要 | 優先度 | 状態 | 備考 |
|----|------|------|-------|------|------|
| DASH-001 | プロジェクト進捗表示 | ☐ | P2 | Out of Scope | Phase 3 |
| DASH-002 | 監査スコア表示 | ☐ | P2 | Out of Scope | Phase 3 |
| DASH-003 | タスク一覧・状態表示 | ☐ | P2 | Out of Scope | Phase 3 |
| DASH-004 | アラート通知表示 | ☐ | P2 | Out of Scope | Phase 3 |

---

## 8. 外部連携（INT）- Phase 4

| ID | 機能 | 必要 | 優先度 | 状態 | 備考 |
|----|------|------|-------|------|------|
| INT-001 | GitHub連携（Issue/PR自動作成） | ☐ | P2 | Out of Scope | Phase 4 |
| INT-002 | GitHub Projects連携（タスク同期） | ☐ | P2 | Out of Scope | Phase 4 |
| INT-003 | Discord連携（通知Webhook） | ☐ | P2 | Out of Scope | Phase 4 |

---

## 優先度定義

| 優先度 | 定義 | 目安 |
|-------|------|------|
| **P0** | 必須（これがないとリリース不可） | Phase 1-2 MVP |
| **P1** | 重要（早期に実装すべき） | Phase 2 |
| **P2** | あると良い | Phase 3-4 |

---

## 状態定義

| 状態 | 意味 |
|------|------|
| **Backlog** | 未着手 |
| **Designing** | 設計中 |
| **Ready** | 実装着手可能（DoR通過） |
| **In Progress** | 実装中 |
| **Review** | レビュー中 |
| **Done** | 完了 |
| **Out of Scope** | スコープ外（明示的に対象外） |

---

## 変更履歴

| 日付 | 変更内容 | 変更者 |
|------|---------|-------|
| 2026-02-02 | 初版作成（フレームワーク文書からSSOT化） | AI |
