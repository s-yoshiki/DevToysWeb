import type { Locale } from '@/i18n/dictionaries'

/**
 * Per-tool "how to use" steps and cautionary notes shown in the collapsible
 * workspace guide. Kept separate from {@link tools} so the catalog stays a
 * compact index; a tool without an entry simply renders no guide panel.
 */
export type ToolGuide = {
  usage: Record<Locale, string[]>
  notes: Record<Locale, string[]>
}

export const toolGuides: Record<string, ToolGuide> = {
  drawing: {
    usage: {
      ja: [
        'ブラシの色や太さを選びます。',
        'キャンバス上をドラッグして自由に描きます。',
        '完成した絵を PNG 画像として保存します。',
      ],
      en: [
        'Choose the brush colour and size.',
        'Drag on the canvas to draw freely.',
        'Save the finished sketch as a PNG image.',
      ],
    },
    notes: {
      ja: [
        '描いた内容は保存されません。ページを再読み込みすると消えるため、必要なら保存してください。',
        'タッチ操作にも対応していますが、細かい描画にはマウスやペンが向いています。',
      ],
      en: [
        'Drawings are not stored—reloading clears the canvas, so save when needed.',
        'Touch input works, but a mouse or stylus is better for fine detail.',
      ],
    },
  },
  curl: {
    usage: {
      ja: [
        'ターミナルからコピーした cURL コマンドを入力欄に貼り付けます。',
        '出力したい言語・ライブラリ（JavaScript、Python など）を選びます。',
        '生成されたコードをコピーして、そのままプロジェクトに貼り付けます。',
      ],
      en: [
        'Paste a cURL command copied from your terminal into the input.',
        'Choose the target language and library (JavaScript, Python, and more).',
        'Copy the generated code and drop it straight into your project.',
      ],
    },
    notes: {
      ja: [
        '変換はブラウザ内で完結し、コマンドが外部へ送信されることはありません。',
        'API キーや認証トークンを含む cURL を貼り付けた場合、生成コードにもそのまま残ります。共有前に取り除いてください。',
        '独自オプションや複雑なシェル展開は解釈できないことがあります。',
      ],
      en: [
        'Conversion runs entirely in your browser; the command is never sent anywhere.',
        'Secrets in the cURL (API keys, tokens) are copied verbatim into the output. Remove them before sharing.',
        'Exotic flags or complex shell expansion may not be interpreted.',
      ],
    },
  },
  'json-csv': {
    usage: {
      ja: [
        '変換したい JSON 配列、または CSV を入力欄に貼り付けます。',
        '変換方向（JSON→CSV / CSV→JSON）を切り替えます。',
        '結果を確認し、コピーまたはダウンロードします。',
      ],
      en: [
        'Paste a JSON array or CSV into the input.',
        'Toggle the direction (JSON→CSV or CSV→JSON).',
        'Review the result, then copy or download it.',
      ],
    },
    notes: {
      ja: [
        'JSON はオブジェクトの配列を想定しています。ネストした値は文字列化されることがあります。',
        'キーの順序や欠損したフィールドによって列がずれる場合があります。',
      ],
      en: [
        'JSON is expected to be an array of objects; nested values may be stringified.',
        'Missing fields or differing key orders can shift columns.',
      ],
    },
  },
  'yaml-json': {
    usage: {
      ja: [
        'YAML または JSON を入力欄に貼り付けます。',
        '変換方向を選ぶと、もう一方の形式へ即座に変換されます。',
        '整形された結果をコピーします。',
      ],
      en: [
        'Paste YAML or JSON into the input.',
        'Pick the direction to convert instantly to the other format.',
        'Copy the formatted result.',
      ],
    },
    notes: {
      ja: [
        'YAML のコメントやアンカーは JSON へ変換すると失われます。',
        'タブによるインデントは YAML では無効です。半角スペースを使ってください。',
      ],
      en: [
        'YAML comments and anchors are lost when converting to JSON.',
        'Tab indentation is invalid in YAML—use spaces.',
      ],
    },
  },
  'json-toml': {
    usage: {
      ja: [
        'JSON または TOML を入力欄に貼り付けます。',
        '変換方向を切り替えて、もう一方の形式を得ます。',
        '結果をコピーして設定ファイルに反映します。',
      ],
      en: [
        'Paste JSON or TOML into the input.',
        'Switch the direction to obtain the other format.',
        'Copy the result into your config file.',
      ],
    },
    notes: {
      ja: [
        'TOML は日時や配列テーブルなど独自の型を持つため、往復変換で表現が変わることがあります。',
        '深くネストした構造は TOML では冗長になりがちです。',
      ],
      en: [
        'TOML has native types (dates, arrays of tables); a round trip may change representation.',
        'Deeply nested structures become verbose in TOML.',
      ],
    },
  },
  'json-xml': {
    usage: {
      ja: [
        'JSON または XML を入力欄に貼り付けます。',
        '変換方向を選択します。',
        '生成された結果をコピーします。',
      ],
      en: [
        'Paste JSON or XML into the input.',
        'Select the conversion direction.',
        'Copy the generated result.',
      ],
    },
    notes: {
      ja: [
        'XML の属性・名前空間・テキストノードは JSON の一意な表現に落とし込まれるため、往復で構造が変わることがあります。',
        'XML の宣言やコメントは保持されない場合があります。',
      ],
      en: [
        'XML attributes, namespaces and text nodes map to a fixed JSON shape, so round trips may alter structure.',
        'XML declarations and comments may not be preserved.',
      ],
    },
  },
  color: {
    usage: {
      ja: [
        'HEX / RGB / HSL のいずれかで色を入力します。',
        '他の表記へ自動変換された値を確認します。',
        '前景色と背景色の組み合わせで WCAG コントラスト比を確認します。',
      ],
      en: [
        'Enter a colour as HEX, RGB or HSL.',
        'Read the value automatically converted to the other notations.',
        'Check the WCAG contrast ratio for the foreground/background pair.',
      ],
    },
    notes: {
      ja: [
        'コントラスト比 4.5:1 以上が通常テキスト、3:1 以上が大きな文字の目安（WCAG AA）です。',
        'アルファ（透明度）を含む色は背景により実効的なコントラストが変わります。',
      ],
      en: [
        'Aim for 4.5:1 for body text and 3:1 for large text (WCAG AA).',
        'Colours with alpha have an effective contrast that depends on the backdrop.',
      ],
    },
  },
  'number-base': {
    usage: {
      ja: [
        '任意の基数の欄に数値を入力します。',
        '2〜36 進数の各表記が同時に更新されます。',
        '必要な表記の値をコピーします。',
      ],
      en: [
        'Type a value into any base field.',
        'Every base from 2 to 36 updates at once.',
        'Copy the representation you need.',
      ],
    },
    notes: {
      ja: [
        '整数のみを扱います。小数点は変換できません。',
        '非常に大きな値は精度の限界で丸められることがあります。',
      ],
      en: [
        'Integers only—fractional values are not converted.',
        'Very large values may be rounded at the precision limit.',
      ],
    },
  },
  'unit-convert': {
    usage: {
      ja: [
        '変換したいカテゴリ（長さ・重さ・データ容量など）を選びます。',
        'いずれかの単位に数値を入力します。',
        '他の単位へ換算された値を一覧で確認します。',
      ],
      en: [
        'Pick a category (length, weight, data size, and more).',
        'Enter a value in any unit.',
        'Read the converted values listed for the other units.',
      ],
    },
    notes: {
      ja: [
        '桁数の多い換算では丸め誤差が生じることがあります。',
        'データ容量は 1KB=1000B（十進）と 1KiB=1024B（二進）を区別します。',
      ],
      en: [
        'Rounding differences can appear for high-precision conversions.',
        'Data sizes distinguish 1 KB = 1000 B (decimal) from 1 KiB = 1024 B (binary).',
      ],
    },
  },
  'date-time': {
    usage: {
      ja: [
        'Unix タイムスタンプ、または日時を入力します。',
        'ISO 8601 やローカル時刻など各表記へ同時に変換されます。',
        '必要な形式の値をコピーします。',
      ],
      en: [
        'Enter a Unix timestamp or a date/time.',
        'It converts at once to ISO 8601, local time and more.',
        'Copy the representation you need.',
      ],
    },
    notes: {
      ja: [
        '秒単位とミリ秒単位の入力を取り違えないよう桁数を確認してください。',
        'ローカル時刻はお使いの端末のタイムゾーン設定に依存します。',
      ],
      en: [
        'Check digit count so you do not confuse seconds with milliseconds.',
        'Local time depends on your device timezone setting.',
      ],
    },
  },
  timezone: {
    usage: {
      ja: [
        '基準となる都市と日時を設定します。',
        '比較したい都市を追加します。',
        '同じ瞬間が各都市で何時になるかを見比べます。',
      ],
      en: [
        'Set a reference city and moment.',
        'Add the cities you want to compare.',
        'See what that same instant is in each city.',
      ],
    },
    notes: {
      ja: [
        'サマータイム（DST）の切り替え日付近では実際の時差が変わります。',
        '各国の DST 制度改定に追随できていない場合があります。',
      ],
      en: [
        'Around daylight-saving transitions the actual offset changes.',
        'Recent DST rule changes in some regions may not be reflected.',
      ],
    },
  },
  cron: {
    usage: {
      ja: [
        '各フィールド（分・時・日・月・曜日）を編集して Cron 式を組み立てます。',
        '式の意味の説明文で内容を確認します。',
        '次回以降の実行予定日時を確認します。',
      ],
      en: [
        'Edit each field (minute, hour, day, month, weekday) to build the expression.',
        'Read the plain-language description to confirm it.',
        'Check the upcoming scheduled run times.',
      ],
    },
    notes: {
      ja: [
        '曜日や特殊記号（@yearly など）の解釈はスケジューラの実装により異なります。実行環境の仕様を確認してください。',
        '次回実行日時はお使いの端末のタイムゾーンで計算されます。',
      ],
      en: [
        'Weekday numbering and macros (e.g. @yearly) vary by scheduler—verify against your runtime.',
        'Next run times are computed in your device timezone.',
      ],
    },
  },
  calculator: {
    usage: {
      ja: [
        '数式をそのまま入力します（例: (1+2)*3）。',
        'Enter で計算結果を確定します。',
        '計算履歴から過去の結果を再利用できます。',
      ],
      en: [
        'Type an expression as-is (e.g. (1+2)*3).',
        'Press Enter to evaluate.',
        'Reuse earlier results from the history.',
      ],
    },
    notes: {
      ja: ['浮動小数点演算のため、ごく小さな丸め誤差が出ることがあります。'],
      en: ['Floating-point arithmetic can introduce tiny rounding errors.'],
    },
  },
  'scientific-calculator': {
    usage: {
      ja: [
        '角度の単位（度数法 / 弧度法）を選択します。',
        '三角関数・対数・べき乗などの関数ボタンで式を組み立てます。',
        'Enter で計算結果を確定します。',
      ],
      en: [
        'Choose the angle mode (degrees or radians).',
        'Build the expression with trig, log and power functions.',
        'Press Enter to evaluate.',
      ],
    },
    notes: {
      ja: [
        '角度の単位設定を取り違えると三角関数の結果が変わります。',
        '定義域外の入力（負数の平方根など）は NaN になります。',
      ],
      en: [
        'The wrong angle mode changes trigonometric results.',
        'Out-of-domain inputs (e.g. square root of a negative) yield NaN.',
      ],
    },
  },
  timer: {
    usage: {
      ja: [
        '時・分・秒でカウントダウン時間を設定します。',
        '開始ボタンで計測を始めます。',
        '0 になるとアラーム音で知らせます。',
      ],
      en: [
        'Set the countdown in hours, minutes and seconds.',
        'Press start to begin.',
        'A chime sounds when it reaches zero.',
      ],
    },
    notes: {
      ja: [
        'タブが非アクティブだと、ブラウザの省電力によりカウントがずれることがあります。',
        '通知音を鳴らすには、端末・ブラウザの音量とサイレント設定を確認してください。',
      ],
      en: [
        'When the tab is inactive, browser power-saving can drift the count.',
        'For the chime to play, check device/browser volume and silent settings.',
      ],
    },
  },
  stopwatch: {
    usage: {
      ja: [
        '開始ボタンで計測を始めます。',
        'ラップボタンで途中経過を記録します。',
        '停止・リセットで計測を終えます。',
      ],
      en: [
        'Press start to begin timing.',
        'Tap lap to record splits.',
        'Stop and reset when finished.',
      ],
    },
    notes: {
      ja: [
        'タブが非アクティブの間は表示更新が間引かれることがあります。',
        'ページを再読み込みすると計測はリセットされます。',
      ],
      en: [
        'Display updates may be throttled while the tab is inactive.',
        'Reloading the page resets the measurement.',
      ],
    },
  },
  'time-signal': {
    usage: {
      ja: [
        '時報のスタイル（117 風の音声 / 時報音）を選びます。',
        '再生ボタンで現在時刻を知らせます。',
      ],
      en: [
        'Choose the style (117-style voice or a chime).',
        'Press play to announce the current time.',
      ],
    },
    notes: {
      ja: [
        '最初の再生はページ上での操作が必要です（ブラウザの自動再生制限のため）。',
        '読み上げられる時刻はお使いの端末の時計に基づきます。',
      ],
      en: [
        'The first playback requires a user gesture (browser autoplay policy).',
        'The announced time is based on your device clock.',
      ],
    },
  },
  'world-clock': {
    usage: {
      ja: [
        '表示したい都市を追加します。',
        '各都市の現在時刻がリアルタイムで並んで更新されます。',
        '不要な都市は削除して並べ替えられます。',
      ],
      en: [
        'Add the cities you want to watch.',
        'Each city’s current time updates live, side by side.',
        'Remove or reorder cities as needed.',
      ],
    },
    notes: {
      ja: [
        '表示時刻はお使いの端末の時計とタイムゾーン情報に依存します。',
        'サマータイムの切り替え日付近では時差が変わります。',
      ],
      en: [
        'Times rely on your device clock and timezone data.',
        'Offsets change around daylight-saving transitions.',
      ],
    },
  },
  'date-calc': {
    usage: {
      ja: [
        '基準となる日付を入力します。',
        '「差を求める」なら2つの日付を、「加算・減算」なら日数などを指定します。',
        '計算された期間や日付を確認します。',
      ],
      en: [
        'Enter the base date.',
        'For a difference, set two dates; for add/subtract, set the amount.',
        'Read the resulting duration or date.',
      ],
    },
    notes: {
      ja: [
        '期間の数え方（開始日を含むか）に注意してください。',
        'タイムゾーンやうるう年により日付境界がずれることがあります。',
      ],
      en: [
        'Mind whether the start date is counted in a duration.',
        'Timezones and leap years can shift date boundaries.',
      ],
    },
  },
  base64: {
    usage: {
      ja: [
        'エンコードしたいテキスト、またはデコードしたい Base64 文字列を入力します。',
        '変換方向を切り替えます。',
        '結果をコピーします。',
      ],
      en: [
        'Enter text to encode, or a Base64 string to decode.',
        'Toggle the direction.',
        'Copy the result.',
      ],
    },
    notes: {
      ja: [
        'Base64 は暗号化ではありません。誰でも復元できるため機密の保護には使えません。',
        'URL セーフ Base64（-_ を使う変種）とは記号が異なります。',
      ],
      en: [
        'Base64 is encoding, not encryption—anyone can decode it.',
        'URL-safe Base64 (using -_) uses different symbols than the standard variant.',
      ],
    },
  },
  url: {
    usage: {
      ja: [
        'エンコード / デコードしたい文字列を入力します。',
        '変換方向を選びます。',
        '結果をコピーして URL に使用します。',
      ],
      en: [
        'Enter the string to encode or decode.',
        'Choose the direction.',
        'Copy the result for use in a URL.',
      ],
    },
    notes: {
      ja: [
        'URL 全体か、クエリ値などの一部かで必要なエンコード範囲が異なります。',
        '既にエンコード済みの文字列を再度エンコードすると二重エンコードになります。',
      ],
      en: [
        'A whole URL vs. a single component needs a different escaping scope.',
        'Encoding an already-encoded string produces double encoding.',
      ],
    },
  },
  html: {
    usage: {
      ja: [
        'エスケープしたいテキスト、または元に戻したい HTML を入力します。',
        '変換方向を選びます。',
        '結果をコピーしてマークアップに埋め込みます。',
      ],
      en: [
        'Enter text to escape, or HTML to unescape.',
        'Choose the direction.',
        'Copy the result into your markup.',
      ],
    },
    notes: {
      ja: [
        '< > & " ’ などの特殊文字を実体参照へ変換します。',
        'エスケープはあくまで表示用です。信頼できない入力の安全な出力には、文脈に応じた対策が別途必要です。',
      ],
      en: [
        'Converts special characters like < > & " ’ to entities.',
        'Escaping is for display; safely rendering untrusted input needs context-aware handling too.',
      ],
    },
  },
  jwt: {
    usage: {
      ja: [
        'JWT を入力欄に貼り付けます。',
        'ヘッダー・ペイロード・標準 claim（exp/iat など）が展開されます。',
        '署名を検証する場合は秘密鍵または公開鍵を入力します。',
      ],
      en: [
        'Paste a JWT into the input.',
        'The header, payload and standard claims (exp/iat, etc.) are decoded.',
        'Enter the secret or public key to verify the signature.',
      ],
    },
    notes: {
      ja: [
        '検証はブラウザ内で行われ、トークンや鍵が外部へ送信されることはありません。',
        '本番の秘密鍵を共有端末で貼り付けないでください。',
        'JWT のペイロードは暗号化されていないため、誰でも内容を読めます。',
      ],
      en: [
        'Verification runs in the browser; tokens and keys are never sent anywhere.',
        'Do not paste production secrets on a shared machine.',
        'JWT payloads are not encrypted—anyone can read their contents.',
      ],
    },
  },
  hmac: {
    usage: {
      ja: [
        'メッセージと共有シークレットを入力します。',
        'ハッシュアルゴリズム（SHA-256 など）を選びます。',
        '生成された HMAC をコピーします。',
      ],
      en: [
        'Enter the message and the shared secret.',
        'Choose the hash algorithm (e.g. SHA-256).',
        'Copy the generated HMAC.',
      ],
    },
    notes: {
      ja: [
        '計算はブラウザ内で完結し、シークレットは外部へ送信されません。',
        '出力の大文字小文字やエンコード（hex / Base64）が検証側と一致している必要があります。',
      ],
      en: [
        'Computed in the browser; the secret is never sent anywhere.',
        'Output casing and encoding (hex / Base64) must match the verifying side.',
      ],
    },
  },
  'basic-auth': {
    usage: {
      ja: [
        'ユーザー名とパスワードを入力してヘッダーを生成します。',
        'または既存の Authorization ヘッダーを貼り付けて解析します。',
        '生成された値をコピーします。',
      ],
      en: [
        'Enter a username and password to generate the header.',
        'Or paste an existing Authorization header to decode it.',
        'Copy the generated value.',
      ],
    },
    notes: {
      ja: [
        'Basic 認証は Base64 でエンコードするだけで暗号化ではありません。必ず HTTPS 上で使用してください。',
        '生成した資格情報をログや共有リンクに残さないでください。',
      ],
      en: [
        'Basic auth is Base64-encoded, not encrypted—always use it over HTTPS.',
        'Keep generated credentials out of logs and shared links.',
      ],
    },
  },
  'string-escape': {
    usage: {
      ja: [
        'エスケープ対象の文字列を入力します。',
        '対象の文脈（JSON / JavaScript / SQL / 正規表現）を選びます。',
        'エスケープまたはアンエスケープした結果をコピーします。',
      ],
      en: [
        'Enter the string to escape.',
        'Pick the target context (JSON, JavaScript, SQL or regex).',
        'Copy the escaped or unescaped result.',
      ],
    },
    notes: {
      ja: [
        '文脈ごとにエスケープ規則が異なります。用途に合ったモードを選んでください。',
        'SQL エスケープは可読性向上のための補助であり、SQL インジェクション対策にはプレースホルダを使ってください。',
      ],
      en: [
        'Escaping rules differ per context—pick the mode that matches your use.',
        'SQL escaping is a convenience; use parameterised queries to prevent injection.',
      ],
    },
  },
  'json-format': {
    usage: {
      ja: [
        '整形したい JSON を貼り付けます。',
        'インデント幅などのオプションを調整します。',
        '整形・検証された結果をコピーします。',
      ],
      en: [
        'Paste the JSON to format.',
        'Adjust options such as indent width.',
        'Copy the formatted, validated result.',
      ],
    },
    notes: {
      ja: [
        '構文エラーがあると位置とともに指摘されます。',
        'コメント付き JSON（JSONC）や末尾カンマは標準 JSON では無効です。',
      ],
      en: [
        'Syntax errors are reported with their location.',
        'Comments (JSONC) and trailing commas are invalid in standard JSON.',
      ],
    },
  },
  'sql-format': {
    usage: {
      ja: [
        '整形したい SQL クエリを貼り付けます。',
        'キーワードの大文字化やインデントを整えて出力します。',
        '結果をコピーします。',
      ],
      en: [
        'Paste the SQL query to format.',
        'Keywords and indentation are tidied up.',
        'Copy the result.',
      ],
    },
    notes: {
      ja: [
        '方言（MySQL / PostgreSQL など）によっては特有の構文が完全に整形されないことがあります。',
        '整形は見た目のみで、クエリの意味は変えません。',
      ],
      en: [
        'Dialect-specific syntax (MySQL, PostgreSQL, etc.) may not format perfectly.',
        'Formatting is cosmetic and does not change query meaning.',
      ],
    },
  },
  'xml-format': {
    usage: {
      ja: [
        '整形したい XML を貼り付けます。',
        'インデントされた読みやすい形で出力されます。',
        '結果をコピーします。',
      ],
      en: ['Paste the XML to format.', 'It is re-indented for readability.', 'Copy the result.'],
    },
    notes: {
      ja: [
        '整形前に整形式（well-formed）である必要があります。',
        'CDATA や名前空間はそのまま保持されます。',
      ],
      en: [
        'The XML must be well-formed before it can be formatted.',
        'CDATA and namespaces are preserved as-is.',
      ],
    },
  },
  'yaml-format': {
    usage: {
      ja: [
        '整形したい YAML を貼り付けます。',
        'インデントを正規化して出力します。',
        '結果をコピーします。',
      ],
      en: ['Paste the YAML to format.', 'Indentation is normalised.', 'Copy the result.'],
    },
    notes: {
      ja: [
        'コメントや元の引用符スタイルは失われることがあります。',
        'タブインデントは無効です。半角スペースを使ってください。',
      ],
      en: [
        'Comments and original quoting style may be lost.',
        'Tab indentation is invalid—use spaces.',
      ],
    },
  },
  'css-format': {
    usage: {
      ja: [
        '整形したい CSS を貼り付けます。',
        'ブロックとプロパティが読みやすく整えられます。',
        '結果をコピーします。',
      ],
      en: [
        'Paste the CSS to format.',
        'Blocks and properties are tidied for reading.',
        'Copy the result.',
      ],
    },
    notes: {
      ja: [
        '整形のみで、プロパティの最適化や短縮は行いません。',
        'SCSS/Less などのプリプロセッサ独自構文には対応しない場合があります。',
      ],
      en: [
        'It only formats—no property optimisation or shorthand rewriting.',
        'Preprocessor syntax (SCSS/Less) may not be supported.',
      ],
    },
  },
  'html-format': {
    usage: {
      ja: [
        '整形したい HTML を貼り付けます。',
        'タグがインデントされて出力されます。',
        '結果をコピーします。',
      ],
      en: ['Paste the HTML to format.', 'Tags are indented.', 'Copy the result.'],
    },
    notes: {
      ja: [
        '整形により空白の扱いが変わり、表示が微妙に変化する場合があります（pre や inline 要素など）。',
        'スクリプトやスタイル内は整形対象外のことがあります。',
      ],
      en: [
        'Reformatting can change whitespace handling and subtly affect rendering (pre, inline elements).',
        'Contents of script/style blocks may be left untouched.',
      ],
    },
  },
  uuid: {
    usage: {
      ja: [
        '生成したい ID の種類（v4、v7、ULID、名前ベース v3/v5 など）を選びます。',
        '個数を指定して生成します。',
        '生成された ID をまとめてコピーします。',
      ],
      en: [
        'Choose the ID type (v4, v7, ULID, name-based v3/v5, and more).',
        'Set the quantity and generate.',
        'Copy the generated IDs at once.',
      ],
    },
    notes: {
      ja: [
        'v4 はランダム、v7・ULID は時刻順にソート可能という特性の違いがあります。',
        '名前ベース（v3/v5）は同じ名前空間と名前から常に同じ ID を生成します。',
      ],
      en: [
        'v4 is random, while v7/ULID are time-sortable.',
        'Name-based IDs (v3/v5) always produce the same ID for the same namespace and name.',
      ],
    },
  },
  'test-data': {
    usage: {
      ja: [
        '氏名・住所・メールなど必要なフィールドを選びます。',
        '件数と出力形式（JSON / CSV / SQL）を指定します。',
        '生成されたダミーデータをコピーまたはダウンロードします。',
      ],
      en: [
        'Pick the fields you need (names, addresses, emails, etc.).',
        'Set the row count and output format (JSON/CSV/SQL).',
        'Copy or download the generated dummy data.',
      ],
    },
    notes: {
      ja: [
        '生成される値は架空のものです。実在の個人情報とは無関係です。',
        '偶然に実在の値と一致する可能性があるため、公開データに使う際はご注意ください。',
      ],
      en: [
        'Generated values are fictional and unrelated to real people.',
        'They may coincidentally match real values—take care when publishing.',
      ],
    },
  },
  password: {
    usage: {
      ja: [
        '長さと使用する文字種（記号・数字など）を設定します。',
        '生成ボタンでパスワードを作成します。',
        '生成された値をコピーします。',
      ],
      en: [
        'Set the length and character types (symbols, digits, etc.).',
        'Press generate to create a password.',
        'Copy the generated value.',
      ],
    },
    notes: {
      ja: [
        '生成はブラウザ内で完結し、パスワードは外部へ送信されません。',
        '生成後はクリップボードや履歴に残らないよう扱いに注意してください。',
        'サービスごとに使い回さず、パスワードマネージャーでの保管を推奨します。',
      ],
      en: [
        'Generation runs in the browser; passwords are never sent anywhere.',
        'After use, mind clipboard and history so the value does not linger.',
        'Do not reuse across services; store in a password manager.',
      ],
    },
  },
  lorem: {
    usage: {
      ja: [
        'テキストの種類（Lorem Ipsum / 日本語ダミー）を選びます。',
        '段落・文・単語などの単位と量を指定します。',
        '生成されたダミー文をコピーします。',
      ],
      en: [
        'Choose the text type (Lorem Ipsum or Japanese filler).',
        'Set the unit (paragraphs, sentences, words) and amount.',
        'Copy the generated placeholder text.',
      ],
    },
    notes: {
      ja: ['ダミー文は意味を持ちません。デザイン検証用の仮テキストとしてお使いください。'],
      en: ['Placeholder text is meaningless—use it as filler for design checks.'],
    },
  },
  badge: {
    usage: {
      ja: [
        'バッジのラベル・メッセージ・色を設定します。',
        'Shields.io / Badgen.net など提供元を選びます。',
        'Markdown / HTML / URL を選んでコピーします。',
      ],
      en: [
        'Set the badge label, message and colour.',
        'Pick the provider (Shields.io / Badgen.net).',
        'Copy it as Markdown, HTML or a URL.',
      ],
    },
    notes: {
      ja: [
        'バッジ画像は Shields.io などの外部サービスから配信されます。表示にはネットワーク接続が必要です。',
        '動的バッジ（ビルド状況など）は対象サービスの稼働に依存します。',
      ],
      en: [
        'Badge images are served by external services like Shields.io and need a network connection.',
        'Dynamic badges (build status, etc.) depend on the upstream service.',
      ],
    },
  },
  hash: {
    usage: {
      ja: [
        'ハッシュ化したいテキストを入力します。',
        'アルゴリズム（SHA-1 / SHA-256 など）を選びます。',
        '計算されたハッシュ値をコピーします。',
      ],
      en: [
        'Enter the text to hash.',
        'Choose the algorithm (SHA-1, SHA-256, etc.).',
        'Copy the computed digest.',
      ],
    },
    notes: {
      ja: [
        '計算はブラウザ内で完結し、入力は外部へ送信されません。',
        'MD5 や SHA-1 は衝突が知られており、セキュリティ用途には非推奨です。',
      ],
      en: [
        'Computed in the browser; input is never sent anywhere.',
        'MD5 and SHA-1 have known collisions—avoid them for security uses.',
      ],
    },
  },
  'x-search': {
    usage: {
      ja: [
        'キーワード・アカウント・期間などの条件を入力します。',
        '組み立てられた検索クエリを確認します。',
        '検索を開くボタンから X の結果ページへ移動します。',
      ],
      en: [
        'Enter keywords, accounts, date ranges and other filters.',
        'Review the assembled search query.',
        'Open the results on X from the button.',
      ],
    },
    notes: {
      ja: [
        '検索結果の表示には X へのログインが必要な場合があります。',
        'X 側の検索仕様変更により一部の演算子が動作しないことがあります。',
      ],
      en: [
        'Viewing results may require being logged in to X.',
        'Some operators may stop working if X changes its search behaviour.',
      ],
    },
  },
  'google-search': {
    usage: {
      ja: [
        'site: や filetype: などの条件を各欄に入力します。',
        '組み立てられた検索式を確認します。',
        'Google で検索ボタンから結果ページへ移動します。',
      ],
      en: [
        'Fill in operators like site: and filetype: in each field.',
        'Review the assembled query.',
        'Jump to the results with the search button.',
      ],
    },
    notes: {
      ja: ['演算子の効き方は Google の仕様変更で変わることがあります。'],
      en: ['Operator behaviour can change with Google’s updates.'],
    },
  },
  'gmail-search': {
    usage: {
      ja: [
        '差出人・宛先・添付ファイルなどの条件を入力します。',
        '生成された Gmail 検索式を確認します。',
        'Gmail の検索欄に貼り付けて使用します。',
      ],
      en: [
        'Enter conditions like sender, recipient and attachments.',
        'Review the generated Gmail query.',
        'Paste it into the Gmail search box.',
      ],
    },
    notes: {
      ja: [
        '検索式を実行するには Gmail へのログインが必要です。',
        '日付条件はお使いのアカウントのタイムゾーンで解釈されます。',
      ],
      en: [
        'You must be signed in to Gmail to run the query.',
        'Date filters are interpreted in your account timezone.',
      ],
    },
  },
  'github-search': {
    usage: {
      ja: [
        '対象（リポジトリ / コード / Issue）と条件を選びます。',
        '言語・スター数・作成者などの絞り込みを追加します。',
        '生成されたクエリで GitHub を検索します。',
      ],
      en: [
        'Pick the scope (repositories/code/issues) and filters.',
        'Add refinements like language, stars and author.',
        'Search GitHub with the generated query.',
      ],
    },
    notes: {
      ja: [
        'コード検索など一部の機能は GitHub へのログインが必要です。',
        '検索構文は GitHub の仕様変更で変わることがあります。',
      ],
      en: [
        'Some scopes (e.g. code search) require being signed in to GitHub.',
        'Search syntax may change with GitHub updates.',
      ],
    },
  },
  'js-runner': {
    usage: {
      ja: [
        'JavaScript または TypeScript のコードをエディタに入力します。',
        '必要なら標準入力（stdin）を用意します。',
        '実行ボタンで結果と標準出力を確認します。',
      ],
      en: [
        'Type JavaScript or TypeScript into the editor.',
        'Provide stdin if your code reads input.',
        'Run it and inspect the result and stdout.',
      ],
    },
    notes: {
      ja: [
        'コードはブラウザ内で実行され、外部サーバーへは送信されません。',
        '無限ループや重い処理はタブを固まらせることがあります。',
        'Node.js 固有の API やファイルシステムへのアクセスは利用できません。',
      ],
      en: [
        'Code runs in your browser and is not sent to any server.',
        'Infinite loops or heavy work can freeze the tab.',
        'Node.js-specific APIs and file system access are unavailable.',
      ],
    },
  },
  regex: {
    usage: {
      ja: [
        '正規表現パターンとフラグ（g、i など）を入力します。',
        'テスト対象のテキストを入力します。',
        '一致箇所とキャプチャグループがハイライト表示されます。',
      ],
      en: [
        'Enter the regex pattern and flags (g, i, etc.).',
        'Enter the text to test against.',
        'Matches and capture groups are highlighted.',
      ],
    },
    notes: {
      ja: [
        'JavaScript の正規表現エンジンを使用します。他言語とは一部構文が異なります。',
        '複雑なパターンは入力によって処理が非常に遅くなる（壊滅的バックトラッキング）ことがあります。',
      ],
      en: [
        'Uses the JavaScript regex engine—syntax differs from some other languages.',
        'Complex patterns can become very slow on some inputs (catastrophic backtracking).',
      ],
    },
  },
  'json-query': {
    usage: {
      ja: [
        '対象の JSON を入力します。',
        'JSONPath 式で値を抽出、または JSON Schema で検証します。',
        '抽出結果や検証結果を確認します。',
      ],
      en: [
        'Enter the target JSON.',
        'Extract values with a JSONPath expression, or validate against a JSON Schema.',
        'Review the extracted or validation results.',
      ],
    },
    notes: {
      ja: [
        'JSONPath の実装差により、一部の高度な式は動作しないことがあります。',
        '大きな JSON では処理に時間がかかる場合があります。',
      ],
      en: [
        'JSONPath implementations vary; some advanced expressions may not work.',
        'Large JSON documents can be slow to process.',
      ],
    },
  },
  'selector-tester': {
    usage: {
      ja: [
        '対象の HTML を入力します。',
        'CSS セレクタまたは XPath 式を入力します。',
        '一致した要素の一覧を確認します。',
      ],
      en: [
        'Enter the target HTML.',
        'Enter a CSS selector or an XPath expression.',
        'Review the list of matched elements.',
      ],
    },
    notes: {
      ja: [
        'ブラウザが解釈できる整形式の HTML が必要です。',
        'JavaScript で動的に生成される要素は対象になりません。',
      ],
      en: [
        'Well-formed HTML the browser can parse is required.',
        'Elements generated dynamically by JavaScript are not matched.',
      ],
    },
  },
  'glob-tester': {
    usage: {
      ja: [
        'glob パターン（例: src/**/*.ts）を入力します。',
        '判定したいパスを1行ずつ入力します。',
        '各パスが一致するかどうかを確認します。',
      ],
      en: [
        'Enter a glob pattern (e.g. src/**/*.ts).',
        'Enter paths to test, one per line.',
        'See which paths match.',
      ],
    },
    notes: {
      ja: [
        'glob の解釈はツール（bash、git、各ライブラリ）ごとに微妙に異なります。',
        'ドットファイルや ** の扱いは実装依存です。',
      ],
      en: [
        'Glob semantics differ subtly between tools (bash, git, libraries).',
        'Handling of dotfiles and ** is implementation-dependent.',
      ],
    },
  },
  mojibake: {
    usage: {
      ja: [
        '文字化けした文字列を入力欄に貼り付けます。',
        '推定されたエンコーディングの組み合わせから復元候補を確認します。',
        '正しく読める候補をコピーします。',
      ],
      en: [
        'Paste the garbled text into the input.',
        'Review restoration candidates from the guessed encodings.',
        'Copy the candidate that reads correctly.',
      ],
    },
    notes: {
      ja: [
        '元のバイト情報が失われている場合は完全には復元できないことがあります。',
        '複数回の誤変換が重なった文字化けは復元が難しくなります。',
      ],
      en: [
        'If the original bytes are lost, full recovery may be impossible.',
        'Text mangled through several bad conversions is harder to restore.',
      ],
    },
  },
  'text-analyzer': {
    usage: {
      ja: [
        '解析したいテキストを入力します。',
        '文字数・単語数・行数などの統計を確認します。',
        'ケース変換（大文字・小文字・キャメルケース等）を適用してコピーします。',
      ],
      en: [
        'Enter the text to analyze.',
        'Review stats like character, word and line counts.',
        'Apply case conversion (upper, lower, camelCase, etc.) and copy.',
      ],
    },
    notes: {
      ja: ['絵文字や結合文字は、数え方により文字数が想定と異なる場合があります。'],
      en: ['Emoji and combining characters may count differently than expected.'],
    },
  },
  'text-diff': {
    usage: {
      ja: [
        '比較したい2つのテキストを左右に入力します。',
        '追加・削除された箇所がハイライト表示されます。',
        '差分を確認して修正に役立てます。',
      ],
      en: [
        'Enter the two texts to compare on each side.',
        'Additions and deletions are highlighted.',
        'Review the diff to guide your edits.',
      ],
    },
    notes: {
      ja: [
        '比較はブラウザ内で行われ、テキストは外部へ送信されません。',
        '空白や改行コードの違いも差分として検出されます。',
      ],
      en: [
        'Comparison runs in the browser; text is never sent anywhere.',
        'Differences in whitespace and line endings are also detected.',
      ],
    },
  },
  'list-utils': {
    usage: {
      ja: [
        '1行1項目でリストを入力します。',
        '並べ替え・重複除去・前後への文字付与などの操作を選びます。',
        '整形されたリストをコピーします。',
      ],
      en: [
        'Enter the list, one item per line.',
        'Choose operations: sort, deduplicate, wrap each line, and more.',
        'Copy the transformed list.',
      ],
    },
    notes: {
      ja: ['重複判定や並べ替えは前後の空白や大文字小文字の影響を受けます。'],
      en: ['Deduplication and sorting are affected by surrounding whitespace and letter case.'],
    },
  },
  markdown: {
    usage: {
      ja: [
        'Markdown を左側のエディタに入力します。',
        '右側にレンダリング結果がリアルタイム表示されます。',
        '表示を確認しながら文章を編集します。',
      ],
      en: [
        'Type Markdown into the left editor.',
        'A live rendering appears on the right.',
        'Edit while watching the preview.',
      ],
    },
    notes: {
      ja: [
        'プレビューは安全性のため HTML をサニタイズします。生の埋め込みスクリプトは実行されません。',
        'GitHub など各サービスの Markdown 拡張とは表示が異なる場合があります。',
      ],
      en: [
        'The preview sanitises HTML for safety—embedded scripts do not run.',
        'Rendering may differ from platform-specific Markdown flavours (e.g. GitHub).',
      ],
    },
  },
  mermaid: {
    usage: {
      ja: [
        'Mermaid 記法でダイアグラムを記述します。',
        'プレビューで図が正しく描画されるか確認します。',
        '完成した図を画像として書き出します。',
      ],
      en: [
        'Write the diagram in Mermaid syntax.',
        'Check the preview renders correctly.',
        'Export the finished diagram as an image.',
      ],
    },
    notes: {
      ja: [
        '構文エラーがあると図は描画されず、エラーが表示されます。',
        'Mermaid のバージョンにより対応する図の種類や記法が異なります。',
      ],
      en: [
        'Syntax errors stop rendering and show an error instead.',
        'Supported diagram types and syntax depend on the Mermaid version.',
      ],
    },
  },
  'qr-code': {
    usage: {
      ja: [
        'QR コードにしたいテキストや URL を入力します。',
        'サイズや誤り訂正レベルを調整します。',
        '生成された QR コードを画像として保存します。',
      ],
      en: [
        'Enter the text or URL to encode.',
        'Adjust the size and error-correction level.',
        'Save the generated QR code as an image.',
      ],
    },
    notes: {
      ja: [
        '長すぎるテキストは QR コードが複雑になり読み取りにくくなります。',
        '誤り訂正レベルを上げると汚れに強くなりますが、より密なコードになります。',
      ],
      en: [
        'Very long text makes the QR code dense and harder to scan.',
        'A higher error-correction level tolerates damage but makes the code denser.',
      ],
    },
  },
  'base64-image': {
    usage: {
      ja: [
        '画像ファイルを選ぶと Data URL に変換されます。',
        'または Data URL を貼り付けて画像に戻します。',
        '生成された Data URL や画像をコピー・保存します。',
      ],
      en: [
        'Pick an image file to convert it to a Data URL.',
        'Or paste a Data URL to turn it back into an image.',
        'Copy or save the Data URL or the image.',
      ],
    },
    notes: {
      ja: [
        '変換はブラウザ内で完結し、画像は外部へアップロードされません。',
        'Data URL は元の画像より約 33% 大きくなります。大きな画像には不向きです。',
      ],
      en: [
        'Conversion runs in the browser; images are never uploaded.',
        'A Data URL is ~33% larger than the source—avoid it for big images.',
      ],
    },
  },
  'svg-tools': {
    usage: {
      ja: [
        'SVG コードを貼り付け、またはファイルを読み込みます。',
        '不要なメタデータを削り、最適化された SVG を得ます。',
        '最適化結果や CSS 用 Data URI をコピーします。',
      ],
      en: [
        'Paste SVG code or load a file.',
        'Strip unnecessary metadata to get an optimised SVG.',
        'Copy the optimised SVG or a CSS-ready data URI.',
      ],
    },
    notes: {
      ja: [
        '最適化により一部の編集情報（エディタ固有のメタデータなど）は失われます。',
        'スクリプトや外部参照を含む SVG は表示・挙動が変わる場合があります。',
      ],
      en: [
        'Optimisation drops some editor-specific metadata.',
        'SVGs with scripts or external references may render or behave differently.',
      ],
    },
  },
  'image-convert': {
    usage: {
      ja: [
        '画像ファイルを読み込みます。',
        '出力形式（WebP / AVIF など）とサイズ・品質を設定します。',
        '変換された画像をダウンロードします。',
      ],
      en: [
        'Load an image file.',
        'Set the output format (WebP/AVIF) plus size and quality.',
        'Download the converted image.',
      ],
    },
    notes: {
      ja: [
        '処理はブラウザ内で完結し、画像は外部へアップロードされません。',
        '非可逆形式へ変換すると画質が劣化します。品質設定で調整してください。',
        '大きな画像や AVIF への変換は時間がかかることがあります。',
      ],
      en: [
        'Processing runs in the browser; images are never uploaded.',
        'Lossy formats degrade quality—tune the quality setting.',
        'Large images or AVIF conversion can take a while.',
      ],
    },
  },
  'image-format': {
    usage: {
      ja: [
        '複数の画像ファイルをまとめて読み込みます。',
        '出力形式（PNG / JPEG / WebP / AVIF）を選びます。',
        '変換結果を個別またはまとめてダウンロードします。',
      ],
      en: [
        'Load several image files at once.',
        'Choose the output format (PNG/JPEG/WebP/AVIF).',
        'Download the results individually or together.',
      ],
    },
    notes: {
      ja: [
        '処理はブラウザ内で完結し、画像は外部へアップロードされません。',
        'JPEG は透過をサポートしません。透過部分は背景色で塗りつぶされます。',
      ],
      en: [
        'Processing runs in the browser; images are never uploaded.',
        'JPEG has no transparency—transparent areas are filled with a background colour.',
      ],
    },
  },
  'image-compress': {
    usage: {
      ja: [
        '圧縮したい画像を複数読み込みます。',
        '品質や圧縮の強さを調整します。',
        '元より軽くなった画像をダウンロードします。',
      ],
      en: [
        'Load one or more images to compress.',
        'Adjust the quality or compression strength.',
        'Download the smaller images.',
      ],
    },
    notes: {
      ja: [
        '処理はブラウザ内で完結し、画像は外部へアップロードされません。',
        '形式は維持したまま軽量化します。過度な圧縮は画質低下を招きます。',
      ],
      en: [
        'Processing runs in the browser; images are never uploaded.',
        'It keeps the format while shrinking—over-compression hurts quality.',
      ],
    },
  },
  'png-transparent': {
    usage: {
      ja: [
        '画像を読み込みます。',
        '透明にしたい色と許容範囲を指定します。',
        '透過処理された PNG を書き出します。',
      ],
      en: [
        'Load an image.',
        'Pick the colour to knock out and a tolerance.',
        'Export the transparent PNG.',
      ],
    },
    notes: {
      ja: [
        '処理はブラウザ内で完結し、画像は外部へアップロードされません。',
        '被写体に近い色まで透明になると輪郭が欠けます。許容範囲を調整してください。',
      ],
      en: [
        'Processing runs in the browser; images are never uploaded.',
        'Too wide a tolerance eats into the subject’s edges—tune it carefully.',
      ],
    },
  },
  'heic-convert': {
    usage: {
      ja: [
        'iPhone などで撮影した HEIC 画像を読み込みます。',
        '出力形式（JPEG / PNG）を選びます。',
        '変換された画像をダウンロードします。',
      ],
      en: [
        'Load a HEIC photo (e.g. from an iPhone).',
        'Choose the output format (JPEG or PNG).',
        'Download the converted image.',
      ],
    },
    notes: {
      ja: [
        '処理はブラウザ内で完結し、画像は外部へアップロードされません。',
        'HEIC に含まれる撮影情報（EXIF）は変換時に失われることがあります。',
        '一部のブラウザや特殊な HEIC は変換できない場合があります。',
      ],
      en: [
        'Processing runs in the browser; images are never uploaded.',
        'EXIF capture data in the HEIC may be lost on conversion.',
        'Some browsers or unusual HEIC files may fail to convert.',
      ],
    },
  },
  exif: {
    usage: {
      ja: [
        '画像を読み込みます。',
        '撮影日時・カメラ・位置情報などの EXIF を確認します。',
        '必要なら EXIF を削除した画像を書き出します。',
      ],
      en: [
        'Load an image.',
        'Inspect EXIF such as capture time, camera and location.',
        'Optionally export a copy with EXIF removed.',
      ],
    },
    notes: {
      ja: [
        '処理はブラウザ内で完結し、画像は外部へアップロードされません。',
        '写真には自宅などの位置情報が含まれることがあります。公開前に削除を検討してください。',
      ],
      en: [
        'Processing runs in the browser; images are never uploaded.',
        'Photos can embed location (e.g. your home)—consider stripping it before sharing.',
      ],
    },
  },
  subnet: {
    usage: {
      ja: [
        'IPv4 アドレスと CIDR プレフィックス（例: 192.168.1.0/24）を入力します。',
        'ネットワークアドレス・ブロードキャスト・利用可能ホスト範囲を確認します。',
      ],
      en: [
        'Enter an IPv4 address and CIDR prefix (e.g. 192.168.1.0/24).',
        'Read the network, broadcast and usable host range.',
      ],
    },
    notes: {
      ja: ['/31 や /32 など特殊なプレフィックスでは利用可能ホスト数の扱いが異なります。'],
      en: ['Special prefixes like /31 and /32 handle usable-host counts differently.'],
    },
  },
  cidr: {
    usage: {
      ja: [
        'IPv4 または IPv6 の CIDR を入力します。',
        'アドレス範囲や総数を確認します。',
        '包含判定やサブネット分割を行います。',
      ],
      en: [
        'Enter an IPv4 or IPv6 CIDR.',
        'Read the address range and count.',
        'Test containment or split into subnets.',
      ],
    },
    notes: {
      ja: ['IPv6 は範囲が膨大になるため、総数は概算表示になることがあります。'],
      en: ['IPv6 ranges are vast, so totals may be shown approximately.'],
    },
  },
  'url-parser': {
    usage: {
      ja: [
        '解析したい URL を入力欄に貼り付けます。',
        'スキーム・ホスト・パス・クエリなどの構成要素が分解されます。',
        'クエリパラメータを一覧で確認します。',
      ],
      en: [
        'Paste the URL to parse.',
        'Its scheme, host, path and query are broken out.',
        'Review the query parameters in a list.',
      ],
    },
    notes: {
      ja: [
        '解析はブラウザ内で完結し、URL が外部へ送信されることはありません。',
        'エンコードされたパラメータはデコード表示されます。元の値と混同しないでください。',
      ],
      en: [
        'Parsing runs in the browser; the URL is never sent anywhere.',
        'Encoded parameters are shown decoded—do not confuse them with the raw value.',
      ],
    },
  },
  'site-diagnostics': {
    usage: {
      ja: [
        '診断したいドメインまたは URL を入力します。',
        '実行すると DNS・TLS・HTTP・OGP の結果がまとめて表示されます。',
        '各項目の詳細を確認します。',
      ],
      en: [
        'Enter the domain or URL to diagnose.',
        'Run it to see DNS, TLS, HTTP and OGP results together.',
        'Drill into the details of each section.',
      ],
    },
    notes: {
      ja: [
        '診断はサーバー経由で対象サイトへアクセスします。第三者のサイトを無断で高頻度に調べないでください。',
        '対象サイトの応答状況やアクセス制限により結果が得られないことがあります。',
      ],
      en: [
        'Diagnostics reach the target site via a server—do not probe third-party sites aggressively without permission.',
        'Results may be unavailable if the target is down or blocks access.',
      ],
    },
  },
  whois: {
    usage: {
      ja: [
        '調べたいドメイン名を入力します。',
        '登録者・登録日・有効期限・ステータスを確認します。',
      ],
      en: ['Enter the domain name to look up.', 'Read the registrar, dates and status.'],
    },
    notes: {
      ja: [
        '照会は外部の WHOIS サーバーへ問い合わせます。ドメイン名が送信されます。',
        'プライバシー保護により登録者情報が伏せられていることがあります。',
        'TLD によっては提供される情報が限られます。',
      ],
      en: [
        'The lookup queries external WHOIS servers, sending the domain name.',
        'Registrant details may be hidden by privacy protection.',
        'Some TLDs expose only limited information.',
      ],
    },
  },
  'ogp-check': {
    usage: {
      ja: [
        '確認したいページの URL を入力します。',
        'OGP と X Card のタグが読み込まれます。',
        'SNS 共有時のプレビュー表示を確認します。',
      ],
      en: [
        'Enter the page URL to check.',
        'Its Open Graph and X Card tags are loaded.',
        'Preview how it will look when shared.',
      ],
    },
    notes: {
      ja: [
        '取得はサーバー経由で対象ページへアクセスします。',
        '実際の SNS 表示は各サービスのキャッシュや仕様に依存し、プレビューと異なることがあります。',
      ],
      en: [
        'Fetching reaches the target page via a server.',
        'Actual social previews depend on each platform’s cache and rules and may differ.',
      ],
    },
  },
  'seo-check': {
    usage: {
      ja: [
        '点検したいページの URL を入力します。',
        'タイトル・見出し構造・canonical・meta などが解析されます。',
        '指摘項目を確認して改善に役立てます。',
      ],
      en: [
        'Enter the page URL to audit.',
        'Titles, heading structure, canonical and meta tags are analysed.',
        'Review the findings to guide improvements.',
      ],
    },
    notes: {
      ja: [
        '取得はサーバー経由で対象ページへアクセスします。',
        '簡易的な静的チェックであり、検索順位を保証・診断するものではありません。',
        'JavaScript で描画される内容は解析対象外の場合があります。',
      ],
      en: [
        'Fetching reaches the target page via a server.',
        'This is a lightweight static check and does not diagnose or guarantee rankings.',
        'Content rendered by JavaScript may not be analysed.',
      ],
    },
  },
  'network-info': {
    usage: {
      ja: [
        'ページを開くと、ブラウザが把握している接続情報が表示されます。',
        '回線種別や実効速度などの値を確認します。',
      ],
      en: [
        'Open the page to see the connection info the browser exposes.',
        'Read values like connection type and effective speed.',
      ],
    },
    notes: {
      ja: [
        '表示される情報はブラウザの推定値で、正確な回線速度とは限りません。',
        '一部のブラウザではこの情報が提供されません。',
      ],
      en: [
        'Values are browser estimates and may not reflect real link speed.',
        'Some browsers do not expose this information.',
      ],
    },
  },
  geolocation: {
    usage: {
      ja: [
        '位置情報の取得を許可します。',
        '緯度・経度・精度が表示されます。',
        '地図で現在地を確認します。',
      ],
      en: [
        'Grant permission to access your location.',
        'Latitude, longitude and accuracy are shown.',
        'Confirm your position on the map.',
      ],
    },
    notes: {
      ja: [
        '位置情報の取得にはブラウザの許可が必要です。取得した座標は端末内に留まります。',
        '屋内や機器によっては精度が低下することがあります。',
      ],
      en: [
        'Location access requires browser permission; coordinates stay on your device.',
        'Accuracy can drop indoors or on some hardware.',
      ],
    },
  },
  'camera-capture': {
    usage: {
      ja: [
        'カメラの使用を許可します。',
        'プレビューを見ながら構図を合わせます。',
        '撮影ボタンで写真を撮り、PNG として保存します。',
      ],
      en: [
        'Grant permission to use the camera.',
        'Frame the shot using the live preview.',
        'Capture and save the photo as a PNG.',
      ],
    },
    notes: {
      ja: [
        'カメラの使用にはブラウザの許可が必要です。撮影した画像は端末内に留まり、外部へ送信されません。',
        '複数のカメラがある場合は切り替えて選択できます。',
      ],
      en: [
        'Camera access requires browser permission; captured images stay on your device.',
        'If you have multiple cameras, you can switch between them.',
      ],
    },
  },
  'qr-scanner': {
    usage: {
      ja: [
        'カメラの使用を許可します。',
        'QR コードやバーコードをカメラにかざします。',
        '読み取られた内容が表示されます。',
      ],
      en: [
        'Grant permission to use the camera.',
        'Hold a QR code or barcode up to the camera.',
        'The decoded content is displayed.',
      ],
    },
    notes: {
      ja: [
        'カメラの使用にはブラウザの許可が必要です。読み取りは端末内で行われます。',
        '読み取った URL を開く際は、信頼できるリンクか確認してください。',
      ],
      en: [
        'Camera access requires browser permission; scanning happens on your device.',
        'Before opening a scanned URL, confirm it is a link you trust.',
      ],
    },
  },
  'device-info': {
    usage: {
      ja: [
        'ページを開くと、ブラウザが把握するデバイス情報が一覧表示されます。',
        '画面・バッテリー・CPU・ネットワークなどの項目を確認します。',
      ],
      en: [
        'Open the page to list the device details the browser exposes.',
        'Review screen, battery, CPU and network entries.',
      ],
    },
    notes: {
      ja: [
        '表示される情報はブラウザが公開する範囲に限られ、外部へは送信されません。',
        'バッテリー情報など一部の項目は対応していないブラウザがあります。',
      ],
      en: [
        'Only what the browser exposes is shown, and nothing is sent anywhere.',
        'Some entries (e.g. battery) are unsupported in certain browsers.',
      ],
    },
  },
}

/** Returns the guide for a tool slug, or undefined when the tool has none. */
export const findToolGuide = (slug: string): ToolGuide | undefined => toolGuides[slug]
