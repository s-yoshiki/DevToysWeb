# Architecture Decision Records

このディレクトリに、リポジトリの技術的な判断と決定事項を集約します。過去の判断も同じ形式で保持し、現在の状態を一覧から確認できるようにします。

- ファイル名は NNNN-kebab-case.md とし、番号は連番にする。
- 各ADRは Status と Date を持ち、状態は Proposed、Accepted、Superseded、Deprecated のいずれかにする。
- 既存の判断を変更するときは元のADRを書き換えず、新しいADRを追加して Supersedes を記録する。
- 新しい判断は実装と同じPRで追加し、コード・workflow・ドキュメントの変更理由を残す。
- PRとActionsの検証入口はルートの pnpm verify とする。

| ID | Decision | Status |
| --- | --- | --- |
| [0001](0001-repository-conventions.md) | ex-foundry リポジトリ規約 | Accepted |

テンプレート: [template.md](template.md)
