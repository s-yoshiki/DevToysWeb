import type { ContentPageLinkKey, ContentPageSlug } from '@/features/content/domain/page-slugs'

export const locales = ['ja', 'en'] as const
export type Locale = (typeof locales)[number]

type ContentSection = {
  heading: string
  paragraphs?: readonly string[]
  items?: readonly string[]
}

type ContentPageCopy = {
  eyebrow: string
  title: string
  description: string
  sections: readonly ContentSection[]
  action?: { label: string; href: string }
}

const dictionaries = {
  ja: {
    appName: 'DevToys',
    tagline: '毎日の開発を、もっと軽やかに。',
    heroDescription:
      'ブラウザだけで完結する小さな道具を、ひとつの静かで高速なワークスペースにまとめました。',
    allTools: 'すべてのツール',
    popularTools: 'よく使うツール',
    browseByCategory: 'カテゴリから探す',
    toolCount: '個のWebツールがすぐに使えます',
    noToolsFound: '該当するツールが見つかりませんでした',
    resetFilters: '絞り込みを解除',
    search: 'ツールを検索',
    input: '入力',
    output: '出力',
    copy: 'コピー',
    copied: 'コピーしました',
    clear: 'クリア',
    generate: '生成',
    run: '実行',
    theme: 'テーマ',
    language: '言語',
    commandPalette: 'コマンドパレット',
    commandPalettePlaceholder: 'ツール名やキーワードで検索…',
    recentTools: '最近使ったツール',
    sample: 'サンプル',
    share: '共有リンク',
    shared: 'リンクをコピーしました',
    collapseSidebar: 'サイドバーを折りたたむ',
    expandSidebar: 'サイドバーを開く',
    maximizeWorkspace: 'ツール領域を最大化',
    restoreWorkspace: 'ツール領域を元に戻す',
    howToUse: '使い方',
    cautions: '注意事項',
    enterBrowserFullscreen: 'ブラウザを全画面にする',
    exitBrowserFullscreen: 'ブラウザの全画面を解除',
    notFoundTitle: 'ページが見つかりません',
    notFoundDescription:
      'お探しのページは移動または削除された可能性があります。ツール一覧から探してみてください。',
    backToHome: 'ホームへ戻る',
    goBack: '前のページへ',
    popularDestinations: 'よく使われるツール',
    skipToContent: 'メインコンテンツへスキップ',
    mainNavigation: 'ツールナビゲーション',
    openMenu: 'メニューを開く',
    toolsFound: '個のツールが見つかりました',
    filterByCategory: 'カテゴリで絞り込む',
    clearSearch: '検索をクリア',
    switchLanguage: '言語を切り替え',
    switchToLight: 'ライトモードに切り替え',
    switchToDark: 'ダークモードに切り替え',
    githubRepository: 'GitHubリポジトリ（新しいタブで開く）',
    footerNote: '毎日の開発のための、小さな道具箱。',
    sitePages: {
      aboutApp: 'アプリ紹介',
      howToUsePage: 'DevToys使い方',
      developerGuide: '開発者向け解説',
      operator: '運営者情報',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      contact: 'お問い合わせ',
    } satisfies Record<ContentPageLinkKey, string>,
    contentPages: {
      'about-app': {
        eyebrow: 'ABOUT DEVTOYS',
        title: 'アプリ紹介',
        description: 'DevToysは、毎日の開発で使う小さな道具をブラウザに集めた無料のWebアプリです。',
        sections: [
          {
            heading: 'DevToysとは',
            paragraphs: [
              'DevToysは、変換・整形・生成・検証などの作業を、必要なときにすぐ使える形にまとめています。インストールやアカウント登録は必要ありません。',
              'ひとつの大きなアプリではなく、目的ごとに集中できる小さなツールを組み合わせることで、開発中の確認作業を軽くすることを目指しています。',
            ],
          },
          {
            heading: 'できること',
            items: [
              'JSON・URL・Base64・JWTなどのデータを変換、整形、デコードする',
              '正規表現、Cron、CIDR、サブネットなどの値を確認する',
              'QRコード、ダミーテキスト、画像などの素材を生成する',
              '入力データをブラウザ内で処理し、開発の流れを止めずに試す',
            ],
          },
          {
            heading: '大切にしていること',
            paragraphs: [
              '画面は静かで、操作は予測しやすく、結果はその場で確認できること。DevToysは、日々の開発に何度も戻ってこられる道具箱を目指しています。',
              '対応するツールや説明は少しずつ増やしています。改善のアイデアや不具合は、お問い合わせページからお知らせください。',
            ],
          },
        ],
      },
      'how-to-use': {
        eyebrow: 'HOW TO USE',
        title: 'DevToys使い方',
        description:
          'ツールを選び、入力して、結果をコピーする。DevToysの基本的な使い方を紹介します。',
        sections: [
          {
            heading: '基本の3ステップ',
            items: [
              'トップページまたは検索から、目的に合うツールを選びます。カテゴリで絞り込むこともできます。',
              '入力欄に値を貼り付けるか入力します。サンプルボタンがあるツールでは、まずサンプルで動作を確認できます。',
              '結果を確認し、コピー・共有など必要な操作を行います。多くのツールは入力するとすぐに結果を更新します。',
            ],
          },
          {
            heading: '便利な使い方',
            items: [
              'ヘッダーの検索欄、またはキーボードショートカットからコマンドパレットを開く',
              'よく使うツールを最近使ったツールからすばやく開く',
              '共有リンクで、入力内容を含まないツールのURLをチームに共有する',
              'テーマ切替と言語切替を、自分の作業環境に合わせて使う',
            ],
          },
          {
            heading: 'データの扱い',
            paragraphs: [
              'ブラウザ内で完結するツールの入力データは、基本的に端末内で処理されます。ブラウザを閉じたりページを移動したりすると入力内容は保持されません。',
              'サイト診断などネットワークアクセスが必要なツールでは、入力したURLがサーバーAPIに送信されます。ツールごとの注意事項とプライバシーポリシーも確認してください。',
            ],
          },
        ],
      },
      'developer-guide': {
        eyebrow: 'FOR DEVELOPERS',
        title: '開発者向け解説',
        description:
          'DevToysを開発者の作業フローに取り入れるときの考え方と、ツールの選び方をまとめています。',
        sections: [
          {
            heading: 'まずは目的から選ぶ',
            paragraphs: [
              '入力値を別の形式に変えたいときは変換・エンコード系、構造や記法を確認したいときは整形・解析系、値の妥当性を確認したいときはテスト・診断系のツールを探してください。',
              'ツール名が分からない場合は、ヘッダーの検索からキーワードで探せます。トップページではカテゴリごとの一覧も確認できます。',
            ],
          },
          {
            heading: 'ブラウザで完結する処理',
            items: [
              'JSON、XML、YAML、CSV、URL、Base64などの変換や整形',
              '正規表現、Cron式、JWT、CIDRなどの構文や値の確認',
              'テキスト差分、文字数、バイト数、画像メタデータなどの調査',
              'QRコード、ダミーテキスト、画像形式などの生成・変換',
            ],
          },
          {
            heading: 'ネットワークを使うツール',
            paragraphs: [
              'URLの診断、OGP確認、WHOIS検索などは、対象にアクセスして結果を取得する必要があります。入力するURLやドメインに機密情報を含めないでください。',
              '社内サイトやアクセス制限されたサイトの診断結果は、実行環境やネットワークの設定によって変わることがあります。結果は最終判断ではなく、確認のきっかけとして利用してください。',
            ],
          },
          {
            heading: 'オープンな改善',
            paragraphs: [
              'DevToysは、使い勝手やツールの追加を継続的に改善しています。再現手順、期待する結果、実際の結果を添えていただくと、問題を確認しやすくなります。',
            ],
          },
        ],
      },
      operator: {
        eyebrow: 'OPERATOR',
        title: '運営者情報',
        description: 'DevToys projectが運営する、ブラウザ完結型の開発者向けツールサイトです。',
        sections: [
          {
            heading: '運営者',
            paragraphs: ['DevToys project'],
          },
          {
            heading: '運営方針',
            items: [
              '開発者が日々の作業で使いやすい、小さく明確なツールを提供します。',
              '入力データを必要以上に収集せず、ブラウザ内で処理できるものは端末内で処理します。',
              '不具合や改善提案を確認し、より安全で分かりやすいサービスを目指します。',
            ],
          },
          {
            heading: '連絡先',
            paragraphs: [
              'サービスに関するご連絡は、お問い合わせページのGitHub Issuesからお送りください。',
            ],
          },
        ],
      },
      privacy: {
        eyebrow: 'PRIVACY POLICY',
        title: 'プライバシーポリシー',
        description:
          'DevToysにおける入力データ、アクセス情報、外部サービスの取り扱いについて説明します。',
        sections: [
          {
            heading: '基本方針',
            paragraphs: [
              'DevToysは、開発者向けツールを提供するために必要な範囲で情報を取り扱います。入力データを必要以上に収集したり、販売したりすることはありません。',
            ],
          },
          {
            heading: 'ブラウザ内で処理する入力',
            paragraphs: [
              '変換、整形、生成などブラウザ内で完結するツールの入力データは、原則として端末のブラウザ内で処理され、DevToysのサーバーには送信されません。',
            ],
          },
          {
            heading: 'サーバーに送信される情報',
            paragraphs: [
              'サイト診断、OGP確認、WHOIS検索などネットワークアクセスが必要なツールでは、処理に必要なURLやドメインがDevToysのAPIに送信されます。機密情報やアクセス用の認証情報を入力しないでください。',
              'APIへのリクエストは、サービスの提供・不正利用の防止・障害調査に必要な範囲で処理されます。',
            ],
          },
          {
            heading: 'アクセス解析と外部サービス',
            paragraphs: [
              '本サイトでは利用状況の把握のためGoogle Analyticsを使用しています。Google Analyticsによる情報の取り扱いは、Googleのポリシーおよび設定にも従います。',
              'GitHub Issuesなど外部サービスを利用してお問い合わせいただく場合は、各サービスのプライバシーポリシーが適用されます。',
            ],
          },
          {
            heading: 'ポリシーの変更',
            paragraphs: [
              'サービスの変更や法令への対応に応じて、本ポリシーを更新することがあります。重要な変更がある場合は、このページでお知らせします。',
            ],
          },
        ],
      },
      terms: {
        eyebrow: 'TERMS OF USE',
        title: '利用規約',
        description: 'DevToysを利用する際の基本的な条件を定めています。',
        sections: [
          {
            heading: '適用',
            paragraphs: [
              '本規約は、DevToys projectが提供するDevToysのWebサイトおよび関連ツールの利用に適用されます。利用者は、本規約に同意したうえでサービスを利用するものとします。',
            ],
          },
          {
            heading: 'サービスの内容',
            paragraphs: [
              'DevToysは、開発作業を補助する変換・生成・解析などのツールを提供します。ツールの結果は参考情報であり、利用者の環境や入力によって正確性・完全性が異なる場合があります。',
            ],
          },
          {
            heading: '禁止事項と注意事項',
            items: [
              '法令または公序良俗に反する目的で利用すること',
              'サービスやAPIに過度な負荷をかけること、または不正なアクセスを試みること',
              '他者の秘密情報、認証情報、個人情報を意図せず送信・公開すること',
              '重要な判断や本番環境への適用を、ツールの結果だけで行うこと',
            ],
          },
          {
            heading: 'サービスの変更・停止',
            paragraphs: [
              '運営者は、機能追加、保守、障害、その他の事情により、サービスの全部または一部を変更・停止することがあります。これにより生じた損害について、運営者は法令で認められる範囲で責任を負いません。',
            ],
          },
          {
            heading: '規約の変更',
            paragraphs: [
              '必要に応じて本規約を変更できます。変更後の規約はこのページに掲載した時点から適用されます。',
            ],
          },
        ],
      },
      contact: {
        eyebrow: 'CONTACT',
        title: 'お問い合わせ',
        description: '不具合の報告、改善提案、サービスに関するご連絡はGitHubからお送りください。',
        action: {
          label: 'GitHub Issuesを開く',
          href: 'https://github.com/s-yoshiki/DevToysWeb/issues/new',
        },
        sections: [
          {
            heading: 'お問い合わせ方法',
            paragraphs: [
              '通常のお問い合わせは、GitHub Issuesから新しいIssueを作成してください。公開Issueに書けない内容は、公開情報や機密情報を含めない方法でご連絡ください。',
            ],
          },
          {
            heading: '不具合報告に含めてほしい情報',
            items: [
              '利用したページやツールの名前',
              '再現するための手順と、期待した結果・実際の結果',
              'ブラウザ、OS、画面幅など再現環境',
              '共有して問題ない範囲のエラーメッセージやスクリーンショット',
            ],
          },
          {
            heading: 'セキュリティに関する報告',
            paragraphs: [
              '脆弱性や認証情報の漏えいにつながる内容は、公開Issueに詳細を書かないでください。GitHubの非公開の報告手段など、安全な経路からご連絡ください。',
            ],
          },
        ],
      },
    } satisfies Record<ContentPageSlug, ContentPageCopy>,
    categories: {
      search: 'カスタム検索',
      converters: '変換',
      calculators: '計算',
      time: '時間',
      encoders: 'エンコード',
      formatters: '整形',
      generators: '生成',
      testers: 'テスト',
      text: 'テキスト',
      images: '画像',
      network: 'ネットワーク',
      device: 'デバイス',
    },
  },
  en: {
    appName: 'DevToys',
    tagline: 'A focused toolkit for everyday development.',
    heroDescription:
      'A collection of focused, browser-only utilities gathered in one calm and fast workspace.',
    allTools: 'All tools',
    popularTools: 'Popular tools',
    browseByCategory: 'Browse by category',
    toolCount: 'web tools ready to use',
    noToolsFound: 'No matching tools found',
    resetFilters: 'Reset filters',
    search: 'Search tools',
    input: 'Input',
    output: 'Output',
    copy: 'Copy',
    copied: 'Copied',
    clear: 'Clear',
    generate: 'Generate',
    run: 'Run',
    theme: 'Theme',
    language: 'Language',
    commandPalette: 'Command palette',
    commandPalettePlaceholder: 'Search tools by name or keyword…',
    recentTools: 'Recently used',
    sample: 'Sample',
    share: 'Share link',
    shared: 'Link copied',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    maximizeWorkspace: 'Maximize workspace',
    restoreWorkspace: 'Restore workspace',
    howToUse: 'How to use',
    cautions: 'Notes',
    enterBrowserFullscreen: 'Enter browser fullscreen',
    exitBrowserFullscreen: 'Exit browser fullscreen',
    notFoundTitle: 'This page could not be found',
    notFoundDescription:
      'The page you are looking for may have moved or been removed. Try finding it in the tool list instead.',
    backToHome: 'Back to home',
    goBack: 'Go back',
    popularDestinations: 'Popular tools',
    skipToContent: 'Skip to main content',
    mainNavigation: 'Tool navigation',
    openMenu: 'Open menu',
    toolsFound: 'tools found',
    filterByCategory: 'Filter by category',
    clearSearch: 'Clear search',
    switchLanguage: 'Switch language',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    githubRepository: 'GitHub repository (opens in a new tab)',
    footerNote: 'A small toolbox for everyday development.',
    sitePages: {
      aboutApp: 'About the app',
      howToUsePage: 'How to use DevToys',
      developerGuide: 'Guide for developers',
      operator: 'About the operator',
      privacy: 'Privacy policy',
      terms: 'Terms of use',
      contact: 'Contact',
    } satisfies Record<ContentPageLinkKey, string>,
    contentPages: {
      'about-app': {
        eyebrow: 'ABOUT DEVTOYS',
        title: 'About DevToys',
        description:
          'DevToys is a free web app that brings small, everyday developer tools into the browser.',
        sections: [
          {
            heading: 'What is DevToys?',
            paragraphs: [
              'DevToys brings together tools for conversion, formatting, generation, and inspection so you can use them whenever you need them. No installation or account is required.',
              'Instead of one large application, DevToys focuses on small tools that each help you complete one task and keep your development flow moving.',
            ],
          },
          {
            heading: 'What you can do',
            items: [
              'Convert, format, and decode data such as JSON, URLs, Base64, and JWTs',
              'Inspect values such as regular expressions, Cron expressions, CIDR ranges, and subnets',
              'Generate QR codes, placeholder text, images, and other development assets',
              'Try ideas in the browser without interrupting your development workflow',
            ],
          },
          {
            heading: 'Our principles',
            paragraphs: [
              'The interface should feel calm, the controls should be predictable, and the result should be visible right away. DevToys is designed to be a small toolbox you can return to every day.',
              'The tool collection and documentation will continue to grow. Please use the contact page to share ideas or report problems.',
            ],
          },
        ],
      },
      'how-to-use': {
        eyebrow: 'HOW TO USE',
        title: 'How to use DevToys',
        description:
          'Choose a tool, enter your input, and copy the result. Here is the basic DevToys workflow.',
        sections: [
          {
            heading: 'Three basic steps',
            items: [
              'Choose a tool from the home page or search. You can also narrow the list by category.',
              'Paste or enter a value in the input area. Tools with a sample button let you try an example first.',
              'Review the result, then copy or share it as needed. Most tools update as you type.',
            ],
          },
          {
            heading: 'Useful shortcuts',
            items: [
              'Open the command palette from the header search field or its keyboard shortcut',
              'Return to frequently used tools from the recently used section',
              'Share a tool URL with your team without including the input value',
              'Switch the theme and language to match your working environment',
            ],
          },
          {
            heading: 'How data is handled',
            paragraphs: [
              'Inputs for browser-only tools are generally processed on your device. Input is not retained when you close the browser or leave the page.',
              'Tools that need network access, such as site diagnostics, send the URL you enter to the server API. Review the tool notes and privacy policy before using them.',
            ],
          },
        ],
      },
      'developer-guide': {
        eyebrow: 'FOR DEVELOPERS',
        title: 'Guide for developers',
        description:
          'A practical overview of how to choose DevToys tools and fit them into a development workflow.',
        sections: [
          {
            heading: 'Start with the task',
            paragraphs: [
              'For changing a value into another format, look in conversion and encoding tools. For checking structure or syntax, look in formatting and inspection tools. For validating a value, try testing and diagnostic tools.',
              'If you do not know the tool name, search by keyword from the header. The home page also groups the complete collection by category.',
            ],
          },
          {
            heading: 'Browser-only workflows',
            items: [
              'Convert and format JSON, XML, YAML, CSV, URLs, and Base64 data',
              'Inspect syntax and values for regular expressions, Cron expressions, JWTs, and CIDR ranges',
              'Investigate text differences, character counts, byte sizes, and image metadata',
              'Generate or transform QR codes, placeholder text, and image formats',
            ],
          },
          {
            heading: 'Tools that use the network',
            paragraphs: [
              'URL diagnostics, OGP checks, and WHOIS lookups need to access a target and retrieve a result. Do not include secrets or access credentials in the URL or domain you submit.',
              'Results for internal or access-controlled sites can vary with the execution environment and network configuration. Treat them as a starting point for investigation, not as a final decision.',
            ],
          },
          {
            heading: 'Open improvement',
            paragraphs: [
              'DevToys is continuously improved for usability and coverage. Reproduction steps, the expected result, and the actual result make issues much easier to investigate.',
            ],
          },
        ],
      },
      operator: {
        eyebrow: 'OPERATOR',
        title: 'About the operator',
        description: 'DevToys project operates this browser-first toolkit for developers.',
        sections: [
          {
            heading: 'Operator',
            paragraphs: ['DevToys project'],
          },
          {
            heading: 'Operating principles',
            items: [
              'Provide small, clear tools that are useful in everyday development work.',
              'Avoid collecting more input data than necessary and process browser-capable tasks on the device.',
              'Review bug reports and suggestions to make the service safer and easier to understand.',
            ],
          },
          {
            heading: 'Contact',
            paragraphs: [
              'Please use the GitHub Issues link on the contact page for service-related messages.',
            ],
          },
        ],
      },
      privacy: {
        eyebrow: 'PRIVACY POLICY',
        title: 'Privacy policy',
        description:
          'How DevToys handles tool inputs, access information, and third-party services.',
        sections: [
          {
            heading: 'Our approach',
            paragraphs: [
              'DevToys handles information only to the extent necessary to provide developer tools. We do not collect or sell more input data than the service requires.',
            ],
          },
          {
            heading: 'Browser-processed inputs',
            paragraphs: [
              'Inputs for conversion, formatting, and generation tools that run entirely in the browser are generally processed on your device and are not sent to DevToys servers.',
            ],
          },
          {
            heading: 'Information sent to the server',
            paragraphs: [
              'Tools that need network access, such as site diagnostics, OGP checks, and WHOIS lookups, send the URL or domain needed for processing to the DevToys API. Do not submit secrets or authentication information.',
              'API requests are processed only as needed to provide the service, prevent misuse, and investigate failures.',
            ],
          },
          {
            heading: 'Analytics and third-party services',
            paragraphs: [
              'This site uses Google Analytics to understand usage. Information handled by Google Analytics is also subject to Google’s policies and configuration.',
              'If you contact us through an external service such as GitHub Issues, that service’s privacy policy applies to the information you submit there.',
            ],
          },
          {
            heading: 'Changes to this policy',
            paragraphs: [
              'This policy may be updated as the service changes or to address legal requirements. Important changes will be reflected on this page.',
            ],
          },
        ],
      },
      terms: {
        eyebrow: 'TERMS OF USE',
        title: 'Terms of use',
        description: 'The basic conditions for using DevToys.',
        sections: [
          {
            heading: 'Scope',
            paragraphs: [
              'These terms apply to the DevToys website and related tools provided by DevToys project. By using the service, you agree to these terms.',
            ],
          },
          {
            heading: 'The service',
            paragraphs: [
              'DevToys provides tools for conversion, generation, analysis, and related development tasks. Results are provided for reference and may vary based on your environment and input.',
            ],
          },
          {
            heading: 'Restrictions and cautions',
            items: [
              'Do not use the service for unlawful purposes or in violation of public order.',
              'Do not place excessive load on the service or attempt unauthorized access.',
              'Do not intentionally submit or expose another person’s secrets, credentials, or personal information.',
              'Do not rely on tool output alone for critical decisions or production changes.',
            ],
          },
          {
            heading: 'Changes and availability',
            paragraphs: [
              'The operator may change or suspend all or part of the service for new features, maintenance, incidents, or other reasons. To the extent permitted by law, the operator is not responsible for losses resulting from those changes or interruptions.',
            ],
          },
          {
            heading: 'Changes to these terms',
            paragraphs: [
              'These terms may be updated when necessary. Updated terms apply from the time they are posted on this page.',
            ],
          },
        ],
      },
      contact: {
        eyebrow: 'CONTACT',
        title: 'Contact',
        description:
          'Please use GitHub for bug reports, suggestions, and questions about the service.',
        action: {
          label: 'Open GitHub Issues',
          href: 'https://github.com/s-yoshiki/DevToysWeb/issues/new',
        },
        sections: [
          {
            heading: 'How to contact us',
            paragraphs: [
              'For general questions, create a new issue on GitHub Issues. Do not include private or sensitive information in a public issue.',
            ],
          },
          {
            heading: 'Helpful details for bug reports',
            items: [
              'The page or tool where the issue occurred',
              'Steps to reproduce, the expected result, and the actual result',
              'Your browser, operating system, and viewport size',
              'Error messages or screenshots that are safe to share',
            ],
          },
          {
            heading: 'Security reports',
            paragraphs: [
              'Do not include vulnerability details or exposed credentials in a public issue. Please use a private reporting channel such as GitHub’s private security reporting options.',
            ],
          },
        ],
      },
    } satisfies Record<ContentPageSlug, ContentPageCopy>,
    categories: {
      search: 'Custom Search',
      converters: 'Converters',
      calculators: 'Calculators',
      time: 'Time',
      encoders: 'Encode & decode',
      formatters: 'Formatters',
      generators: 'Generators',
      testers: 'Testers',
      text: 'Text',
      images: 'Images',
      network: 'Network',
      device: 'Device',
    },
  },
} as const

export const getDictionary = (locale: Locale) => dictionaries[locale]
export type Dictionary = ReturnType<typeof getDictionary>
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale)
