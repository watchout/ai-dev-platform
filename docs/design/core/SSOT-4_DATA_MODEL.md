# SSOT-4: データモデル定義

> AI Development Platform のデータ構造定義

---

## 基本情報

| 項目 | 内容 |
|------|------|
| プロダクト名 | AI Development Platform |
| バージョン | v0.1.0 |
| 最終更新日 | 2026-02-02 |
| ステータス | Approved |

---

## 1. データモデル概要

本プロダクトはCLIツールのため、データベースではなくファイルシステムベースのデータモデルを採用する。
プロジェクト状態は `.framework/` ディレクトリに JSON ファイルとして永続化する。

---

## 2. プロジェクト状態（.framework/）

### 2.1 ディレクトリ構造

```
.framework/
├── project.json          ← プロジェクトメタ情報
├── discover-session.json ← ディスカバリーセッション
├── generation-state.json ← 生成チェーン状態
├── plan.json             ← 実装計画
├── tasks.json            ← タスク状態管理
├── audits/               ← 監査レポート格納
│   ├── ssot/
│   ├── prompt/
│   ├── code/
│   └── test/
└── logs/                 ← 実行ログ
    └── run-{timestamp}.json
```

### 2.2 project.json

```typescript
interface ProjectState {
  name: string;
  version: string;
  createdAt: string;           // ISO 8601
  updatedAt: string;           // ISO 8601
  phase: number;               // 現在のフェーズ (-1〜6)
  status: ProjectStatus;
  techStack: TechStackConfig;
  config: FrameworkConfig;
}

type ProjectStatus =
  | 'initialized'
  | 'discovering'
  | 'discovered'
  | 'generating'
  | 'generated'
  | 'planning'
  | 'planned'
  | 'running'
  | 'completed';

interface TechStackConfig {
  framework: string;     // e.g. "next.js"
  language: string;      // e.g. "typescript"
  ui: string;            // e.g. "react"
  testing: string;       // e.g. "vitest"
  hosting: string;       // e.g. "vercel"
}

interface FrameworkConfig {
  aiProvider: 'anthropic' | 'openai';
  aiModel: string;
  autoCommit: boolean;
  escalationMode: 'strict' | 'normal';
}
```

### 2.3 discover-session.json

```typescript
interface DiscoverSessionData {
  id: string;
  status: 'in_progress' | 'paused' | 'completed';
  currentStage: number;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  stages: StageData[];
}

interface StageData {
  stageNumber: number;
  status: 'pending' | 'in_progress' | 'confirmed';
  questions: QuestionData[];
  summary?: string;
  confirmedAt?: string;
}

interface QuestionData {
  id: string;            // e.g. "Q1-1"
  required: boolean;
  answered: boolean;
  answer?: string;
  skipped?: boolean;
  timestamp?: string;
}
```

### 2.4 generation-state.json

```typescript
interface GenerationState {
  currentStep: number;    // 1-3
  status: 'idle' | 'running' | 'paused' | 'completed';
  documents: DocumentGenState[];
}

interface DocumentGenState {
  path: string;
  step: number;
  status: 'pending' | 'generating' | 'generated' | 'confirmed';
  completeness: number;  // 0-100
  generatedAt?: string;
  confirmedAt?: string;
}
```

### 2.5 tasks.json

```typescript
interface TasksState {
  waves: WaveData[];
  tasks: TaskData[];
}

interface WaveData {
  id: number;
  featureIds: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

interface TaskData {
  id: string;            // e.g. "FEAT-001-db"
  featureId: string;     // e.g. "FEAT-001"
  layer: 'db' | 'api' | 'ui' | 'integration' | 'test' | 'review';
  priority: 'P0' | 'P1' | 'P2';
  size: 'S' | 'M' | 'L' | 'XL';
  status: 'backlog' | 'in_progress' | 'review' | 'done' | 'failed';
  dependencies: string[];
  promptPath?: string;
  auditScore?: number;
  startedAt?: string;
  completedAt?: string;
}
```

### 2.6 監査レポート

```typescript
interface AuditReport {
  id: string;
  type: 'ssot' | 'prompt' | 'code' | 'test' | 'acceptance';
  target: string;
  executedAt: string;
  score: number;
  maxScore: number;
  passed: boolean;
  iteration: number;      // 監査回数（最大3回）
  categories: AuditCategoryScore[];
  findings: AuditFindingData[];
}

interface AuditCategoryScore {
  name: string;
  score: number;
  maxScore: number;
  deductions: DeductionData[];
}

interface DeductionData {
  points: number;
  reason: string;
  location?: string;
}

interface AuditFindingData {
  id: string;
  severity: 'critical' | 'major' | 'minor';
  category: string;
  description: string;
  suggestion: string;
  location?: string;
  fixed: boolean;
}
```

---

## 3. ドキュメントテンプレート構造

フレームワークが管理するテンプレートファイル一覧。

| カテゴリ | テンプレート数 | 格納先 |
|---------|-------------|--------|
| アイデア・検証 | 4 | templates/idea/ |
| 要件定義 | 2 | templates/requirements/ |
| 設計（コア） | 4 | templates/design/core/ |
| 設計（機能） | 1 | templates/design/features/ |
| 開発規約 | 5 | templates/standards/ |
| 運用 | 4 | templates/operations/ |
| マーケティング | 5 | templates/marketing/ |
| グロース | 2 | templates/growth/ |
| プロジェクト管理 | 3 | templates/management/ |
| **合計** | **30** | |

---

## 4. 制約

- ファイルはUTF-8エンコーディング
- JSONファイルはインデント2スペース
- Markdownファイルは改行LF
- .framework/ はデフォルトで .gitignore に含める（ログのみ）
- タスクIDは `{FEAT-ID}-{layer}` 形式（例: `FEAT-001-db`）

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|----------|---------|-------|
| 2026-02-02 | v0.1.0 | 初版作成 | AI |
