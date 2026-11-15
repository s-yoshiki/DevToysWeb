# ADR 0004: verify から build 検証を除外する

- Status: Accepted
- Date: 2026-11-15
- Supersedes: [0001](0001-repository-conventions.md) の `verify` に関する決定

## Context

`build` は成果物の生成を担い、TypeScript の型検査などを含む場合があります。`check` が型検査を実行する構成では、`verify` から `build` も呼ぶと確認が重複します。CI の通常の検証では型検査とテストを実行し、配布用成果物の生成は必要な workflow で行う方針を明確にします。

## Decision

- `verify` は `check` と、このリポジトリで定義されているテスト・追加の静的検査を実行する。
- `verify` には `build` を含めず、`check` に含まれる型検査を重複して呼び出さない。
- CI の検証ジョブは `pnpm verify` を実行し、独立した build 検証は行わない。
- deploy、release、または build 済み成果物を使う smoke test が必要とする場合は、その処理の中で成果物を生成する。

## Consequences

通常の CI はコード検査とテストに集中し、build 成果物の生成はそれを使う処理に限定されます。build 固有の失敗は、成果物を実際に必要とする workflow で検出します。

## Alternatives considered

- `build` を `verify` に含める: `check` と型検査が重複し、通常の検証ジョブで成果物を作る理由がないため採用しない。
