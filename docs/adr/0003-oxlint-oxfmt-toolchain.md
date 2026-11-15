# Oxlint と Oxfmt による lint・format

- Status: Accepted
- Date: 2026-11-15
- Supersedes: なし

## Context

Biome による lint と format の設定が個別リポジトリに分散し、各 workspace で設定や依存バージョンを揃えにくくなっていた。

## Decision

- TypeScript / JavaScript の lint に Oxlint、format に Oxfmt を使う。
- 共有設定を `configs/oxlint` と `configs/oxfmt` に置き、依存バージョンを pnpm catalog で管理する。
- CI は Node.js 26 と pnpm 12 を使い、lint・format・型検査・テスト・build を確認する。

## Consequences

- Biome と重複する formatter / linter 依存を削除する。
- Oxfmt の設定に合わせて既存ソースの書式が更新される。
- toolchain の更新と CI の検証入口を同じ PR で維持する。
