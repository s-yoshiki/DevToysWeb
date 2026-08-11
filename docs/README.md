# Documentation

このディレクトリは、実装・運用・技術判断に関するドキュメントの入口です。

## Entry points

- [Architecture Decision Records](adr/README.md)
- [Repository instructions](../AGENTS.md)
- [Coding-agent skill](../.agents/skills/ex-foundry-maintainer/SKILL.md)

## Verification

PRとGitHub Actionsでは、ルートの次のコマンドを検証入口として使用します。

pnpm verify

このコマンドは check、typecheck、test、build を順に実行します。デプロイは pnpm deploy またはworkflow固有の手順で実行し、明示的な依頼なしに実行しません。

## Guides

| Document |
| --- |


## Writing rules

- 実装と乖離した手順は同じ変更で更新する。
- 技術的な判断は docs/adr/ に追加し、既存ADRを上書きしない。
- コマンド例はリポジトリのルートからそのまま実行できる形で記載する。
