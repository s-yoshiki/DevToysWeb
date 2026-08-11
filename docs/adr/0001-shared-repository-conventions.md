# ADR 0001: 設定・コマンド・エージェント運用の共通規約

- Status: Accepted
- Date: 2026-08-11

## Context

ex-foundry のサービス間で、Biome、TypeScript、品質チェック、設計記録、コーディングエージェントの置き場所が異なると、サービスをまたいだ保守時に毎回ルールを再確認する必要がある。

## Decision

- 実体のあるBiome設定は `configs/biome/` に置き、ルートの `biome.json` は入口として `extends` する。
- 共有TypeScript設定は `configs/tsconfig/` の `@repo/typescript-config` workspace package に集約する。
- ルートの `package.json` は `check`、`check:fix`、`format`、`format:check`、`lint`、`typecheck`、`test`、`build`、`deploy` を標準コマンド名とし、カバレッジ対応サービスでは `test:coverage` も提供する。サービス固有の前処理は各スクリプトの中に残す。
- 技術的な判断は `docs/adr/` に記録する。
- リポジトリ固有のエージェント手順は `.agents/skills/ex-foundry-maintainer/` に置く。外部状態を変更するコマンドは明示的な依頼なしに実行しない。

## Consequences

設定ファイルと日常コマンドの入口が揃い、エージェントが複数サービスを扱いやすくなる。一方、フレームワークやデプロイ環境の差異は残るため、共有設定にはサービス固有の例外を無理に押し込まない。
