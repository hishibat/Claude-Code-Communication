# Daily Sharings System

日々の活動・思考・課題を音声入力から自動整形し、蓄積・分析するシステム。

## Overview

```
音声テキスト → Claude Code → 自動整形 → Google Drive（デュアル保存）
                                              ├── .md（原本・データ利活用）
                                              └── Google Docs（NotebookLM用）
```

## Quick Start

### 記録方法

Claude Codeで以下のように入力：

```
daily sharingとして記録して：今日はクライアント会議があって...
```

**トリガーフレーズ**が必要（通常の会話と区別するため）：
- 「daily sharingとして記録して」
- 「これを記録して」
- 「sharing記録：〜」

### 自動処理される内容

| 項目 | 処理 |
|------|------|
| カテゴリ | 活動/思考/課題/アクション/振り返り/目標 から自動判定 |
| タグ | 仕事/健康/学習/生産性など自動検出 |
| 時間情報 | 時間帯・曜日・平日/週末を自動付与 |
| コンディション | 気分・エネルギー・ストレスを文脈から推定 |
| 関係者 | 人名を自動抽出 |

## File Format

### 命名規則
```
YYYY-MM-DD-HHMM-{short-slug}.md
```

### 保存先（Google Drive）
```
daily_sharings/
├── 2026-01-25-0215-dual-save-test.md     # 原本
├── 2026-01-25-0215-dual-save-test        # Google Docs（NotebookLM用）
└── ...
```

## Architecture

### デュアルフォーマット保存

| 形式 | 用途 | NotebookLM |
|------|------|-----------|
| Markdown (.md) | **原本**・データ利活用・スクリプト処理 | ❌ |
| Google Docs | 閲覧・AI分析 | ✅ |

### 技術スタック

- **Claude Code**: 音声テキストの整形・メタデータ抽出
- **Zapier MCP**: Google Drive連携
- **Google Drive**: ファイル保存
- **NotebookLM**: AI分析（Google Docs経由）

## Frontmatter Schema

```yaml
# === 基本情報 ===
記録日時: 2026-01-25T02:15:00+09:00
カテゴリ: 思考
タグ: [仕事, プロジェクト]

# === コンテキスト ===
時間帯: 深夜
曜日: 土曜日
種別: 週末

# === コンディション ===
気分: 4        # 1-5
エネルギー: 3  # 1-5
ストレス: 2    # 1-5

# === 関係者 ===
関係者: [田中さん, 佐藤部長]

# === 目標リンク（将来用） ===
関連目標: []
```

## Roadmap

- [x] 音声テキスト自動整形
- [x] Google Drive保存（Zapier MCP）
- [x] デュアルフォーマット保存（MD + Google Docs）
- [x] NotebookLM互換性対応
- [ ] 日次/週次サマリー自動生成
- [ ] 分析ツール開発（時系列・相関分析）
- [ ] ビジュアライゼーション（インフォグラフィック）
- [ ] エキスパート視点でのインサイト・アドバイス機能
- [ ] OKR連携

## License

Private use only.
