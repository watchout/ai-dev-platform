# SSOT-3: API契約台帳

> AI Development Platform のCLI内部API・モジュール間インターフェース定義

---

## 基本情報

| 項目 | 内容 |
|------|------|
| プロダクト名 | AI Development Platform |
| バージョン | v0.1.0 |
| 最終更新日 | 2026-02-02 |
| ステータス | Approved |

---

## 1. API概要

本プロダクトはCLIツールのため、HTTP APIではなくモジュール間インターフェースを定義する。
Phase 3（ダッシュボード）以降でREST APIを追加予定。

---

## 2. CLIコマンドインターフェース

### 2.1 framework init

```typescript
interface InitOptions {
  projectName: string;
  template?: 'default' | 'minimal';
  techStack?: TechStackPreset;
  skipInstall?: boolean;
}

interface InitResult {
  projectPath: string;
  createdFiles: string[];
  errors: string[];
}
```

### 2.2 framework discover

```typescript
interface DiscoverOptions {
  resume?: boolean;
  sessionId?: string;
}

interface DiscoverSession {
  id: string;
  currentStage: 1 | 2 | 3 | 4 | 5;
  answers: Record<string, DiscoverAnswer>;
  status: 'in_progress' | 'paused' | 'completed';
}

interface DiscoverAnswer {
  questionId: string;
  value: string;
  timestamp: string;
}

interface DiscoverResult {
  session: DiscoverSession;
  generatedFiles: string[];
}
```

### 2.3 framework generate

```typescript
interface GenerateOptions {
  step?: 1 | 2 | 3;
  fromDiscovery?: string; // session ID
  skipConfirmation?: boolean;
}

interface GenerateResult {
  step: number;
  documents: GeneratedDocument[];
  completeness: Record<string, number>; // filename -> percentage
}

interface GeneratedDocument {
  path: string;
  completeness: number;
  status: 'generated' | 'updated' | 'skipped';
}
```

### 2.4 framework plan

```typescript
interface PlanOptions {
  featureIds?: string[];
  outputFormat?: 'summary' | 'detail' | 'json';
}

interface PlanResult {
  waves: Wave[];
  tasks: Task[];
  dependencyGraph: DependencyGraph;
}

interface Wave {
  id: number;
  features: string[];
  parallelizable: boolean;
}

interface Task {
  id: string;
  featureId: string;
  layer: 'db' | 'api' | 'ui' | 'integration' | 'test' | 'review';
  priority: 'P0' | 'P1' | 'P2';
  size: 'S' | 'M' | 'L' | 'XL';
  dependencies: string[];
  prompt?: string;
}
```

### 2.5 framework run

```typescript
interface RunOptions {
  taskId?: string;
  dryRun?: boolean;
  autoCommit?: boolean;
}

interface RunResult {
  taskId: string;
  status: 'completed' | 'escalated' | 'failed';
  files: ModifiedFile[];
  auditScore?: number;
  escalation?: Escalation;
}

interface Escalation {
  triggerId: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7';
  context: string;
  question: string;
  options: EscalationOption[];
  recommendation: string;
}

interface EscalationOption {
  id: number;
  description: string;
  impact: string;
}
```

### 2.6 framework audit

```typescript
interface AuditOptions {
  type: 'ssot' | 'prompt' | 'code' | 'test' | 'acceptance';
  target: string; // file path or feature ID
}

interface AuditResult {
  type: AuditOptions['type'];
  target: string;
  score: number;
  maxScore: number;
  passed: boolean;
  categories: AuditCategory[];
  findings: AuditFinding[];
}

interface AuditCategory {
  name: string;
  score: number;
  maxScore: number;
}

interface AuditFinding {
  severity: 'critical' | 'major' | 'minor';
  category: string;
  description: string;
  suggestion: string;
  location?: string;
}
```

### 2.7 framework status

```typescript
interface StatusResult {
  phase: number;
  phaseLabel: string;
  progress: number; // 0-100
  documents: DocumentStatus[];
  tasks: TaskStatus[];
  audits: AuditSummary[];
}

interface DocumentStatus {
  path: string;
  completeness: number;
  lastModified: string;
}

interface TaskStatus {
  id: string;
  featureId: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
}
```

---

## 3. 内部モジュールインターフェース

### 3.1 AIClient

```typescript
interface AIClient {
  chat(messages: Message[], options?: AIOptions): Promise<AIResponse>;
  stream(messages: Message[], options?: AIOptions): AsyncIterable<string>;
}

interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

interface AIResponse {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
}
```

### 3.2 DocumentManager

```typescript
interface DocumentManager {
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  listTemplates(): Promise<string[]>;
  generateFromTemplate(templateId: string, data: Record<string, unknown>): Promise<string>;
}
```

### 3.3 AuditEngine

```typescript
interface AuditEngine {
  auditSSOT(filePath: string): Promise<AuditResult>;
  auditPrompt(prompt: string, ssotPath: string): Promise<AuditResult>;
  auditCode(filePaths: string[], ssotPath: string): Promise<AuditResult>;
  auditTest(testPaths: string[], ssotPath: string): Promise<AuditResult>;
}
```

---

## 4. エラーレスポンス共通形式

```typescript
interface CLIError {
  code: string;
  message: string;
  details?: string;
  suggestion?: string;
}

// エラーコード体系
// CLI_xxx: CLIコマンドエラー
// GEN_xxx: 生成エラー
// AUD_xxx: 監査エラー
// AI_xxx:  AI APIエラー
// FS_xxx:  ファイルシステムエラー
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|----------|---------|-------|
| 2026-02-02 | v0.1.0 | 初版作成 | AI |
