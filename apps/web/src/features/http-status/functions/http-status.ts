export type HttpStatusClass = '1xx' | '2xx' | '3xx' | '4xx' | '5xx'

export type HttpStatusEntry = {
  code: number
  phrase: string
  summary: { ja: string; en: string }
  /** Defining document, e.g. `RFC 9110 §15.5.1`. */
  reference: string
  /** Response bodies for these codes are not cacheable or not allowed. */
  bodyless?: boolean
  deprecated?: boolean
}

const entry = (
  code: number,
  phrase: string,
  ja: string,
  en: string,
  reference: string,
  flags: { bodyless?: boolean; deprecated?: boolean } = {},
): HttpStatusEntry => ({ code, phrase, summary: { ja, en }, reference, ...flags })

/**
 * Registered HTTP status codes as maintained by IANA, with the section of the
 * document that defines each one. Codes outside the registry (Cloudflare's 5xx
 * range, nginx's 4xx range) are intentionally excluded.
 */
export const httpStatuses: readonly HttpStatusEntry[] = [
  entry(
    100,
    'Continue',
    'リクエストヘッダーは受理された。クライアントはボディの送信を続けてよい。',
    'The request headers were accepted; the client should continue sending the body.',
    'RFC 9110 §15.2.1',
    { bodyless: true },
  ),
  entry(
    101,
    'Switching Protocols',
    'Upgradeヘッダーで要求されたプロトコルへ切り替える。WebSocketのハンドシェイクで使う。',
    'Switching to the protocol requested in Upgrade, as used by the WebSocket handshake.',
    'RFC 9110 §15.2.2',
    { bodyless: true },
  ),
  entry(
    102,
    'Processing',
    '処理中であることを伝える中間応答。WebDAVで使う。',
    'An interim response signalling that the server is still processing, used by WebDAV.',
    'RFC 2518 §10.1',
    { bodyless: true },
  ),
  entry(
    103,
    'Early Hints',
    '最終応答の前にLinkヘッダーを返し、クライアントの先読みを促す。',
    'Sends Link headers ahead of the final response so the client can preload.',
    'RFC 8297 §2',
    { bodyless: true },
  ),

  entry(
    200,
    'OK',
    'リクエストは成功した。GETならボディが表現そのもの。',
    'The request succeeded; for GET the body is the representation itself.',
    'RFC 9110 §15.3.1',
  ),
  entry(
    201,
    'Created',
    'リソースを新規作成した。Locationヘッダーに作成先を入れる。',
    'A new resource was created; its URI belongs in the Location header.',
    'RFC 9110 §15.3.2',
  ),
  entry(
    202,
    'Accepted',
    'リクエストは受理したが処理は完了していない。非同期ジョブで使う。',
    'The request was accepted but not yet processed, as with an asynchronous job.',
    'RFC 9110 §15.3.3',
  ),
  entry(
    203,
    'Non-Authoritative Information',
    '返した表現はオリジンではなくプロキシが変更したもの。',
    'The payload was modified by a proxy rather than coming straight from the origin.',
    'RFC 9110 §15.3.4',
  ),
  entry(
    204,
    'No Content',
    '成功したがボディはない。DELETEやフォーム保存の応答に向く。',
    'Success with no body, a good fit for DELETE and for saving a form.',
    'RFC 9110 §15.3.5',
    { bodyless: true },
  ),
  entry(
    205,
    'Reset Content',
    '成功。クライアントは入力フォームを初期状態へ戻すべき。',
    'Success; the client should reset the document view that sent the request.',
    'RFC 9110 §15.3.6',
    { bodyless: true },
  ),
  entry(
    206,
    'Partial Content',
    'Rangeリクエストに対して一部だけ返した。動画配信やレジューム転送で使う。',
    'A range request was fulfilled with part of the representation, as in resumable transfers.',
    'RFC 9110 §15.3.7',
  ),
  entry(
    207,
    'Multi-Status',
    '複数のリソースそれぞれの結果をXMLボディで返す。WebDAVで使う。',
    'Per-resource results are returned in an XML body, used by WebDAV.',
    'RFC 4918 §11.1',
  ),
  entry(
    208,
    'Already Reported',
    '同じ集合の要素が既に列挙済みであることを示す。WebDAVで使う。',
    'Members of a binding were already enumerated earlier in the response, used by WebDAV.',
    'RFC 5842 §7.1',
  ),
  entry(
    226,
    'IM Used',
    'インスタンス操作の結果を返した。差分配信で使う。',
    'The response is the result of one or more instance manipulations applied to the resource.',
    'RFC 3229 §10.4.1',
  ),

  entry(
    300,
    'Multiple Choices',
    '複数の表現が存在する。クライアントに選択させる。',
    'More than one representation exists and the client should choose.',
    'RFC 9110 §15.4.1',
  ),
  entry(
    301,
    'Moved Permanently',
    '恒久的に移動した。以後は新URLを使う。POSTがGETに変わる実装が多い。',
    'Permanently moved; most clients rewrite the follow-up POST into a GET.',
    'RFC 9110 §15.4.2',
  ),
  entry(
    302,
    'Found',
    '一時的に別URLにある。メソッド保持は保証されない。307の使用を検討する。',
    'Temporarily located elsewhere; method preservation is not guaranteed, so prefer 307.',
    'RFC 9110 §15.4.3',
  ),
  entry(
    303,
    'See Other',
    'POST処理後の結果をGETで取得させる。PRGパターンで使う。',
    'Fetch the result with GET, the redirect behind the post/redirect/get pattern.',
    'RFC 9110 §15.4.4',
  ),
  entry(
    304,
    'Not Modified',
    '条件付きリクエストに対し、キャッシュがまだ有効であることを示す。',
    'The cached representation is still fresh for this conditional request.',
    'RFC 9110 §15.4.5',
    { bodyless: true },
  ),
  entry(
    307,
    'Temporary Redirect',
    '一時的なリダイレクト。メソッドとボディを保持する。',
    'A temporary redirect that preserves the method and body.',
    'RFC 9110 §15.4.8',
  ),
  entry(
    308,
    'Permanent Redirect',
    '恒久的なリダイレクト。メソッドとボディを保持する。',
    'A permanent redirect that preserves the method and body.',
    'RFC 9110 §15.4.9',
  ),

  entry(
    400,
    'Bad Request',
    '構文などが不正でサーバーが解釈できない。',
    'The server cannot process the request because it is malformed.',
    'RFC 9110 §15.5.1',
  ),
  entry(
    401,
    'Unauthorized',
    '認証が必要、または認証に失敗した。WWW-Authenticateヘッダーが必須。',
    'Authentication is required or failed; WWW-Authenticate is mandatory.',
    'RFC 9110 §15.5.2',
  ),
  entry(
    402,
    'Payment Required',
    '将来のために予約された状態コード。',
    'Reserved for future use.',
    'RFC 9110 §15.5.3',
  ),
  entry(
    403,
    'Forbidden',
    '認証は通ったが権限がない。存在を隠したい場合は404を返す。',
    'Authenticated but not permitted; return 404 instead when hiding existence matters.',
    'RFC 9110 §15.5.4',
  ),
  entry(
    404,
    'Not Found',
    'リソースが見つからない。存在を明かしたくない場合にも使う。',
    'The resource was not found, also used to avoid disclosing that it exists.',
    'RFC 9110 §15.5.5',
  ),
  entry(
    405,
    'Method Not Allowed',
    'そのリソースでは使えないメソッド。Allowヘッダーが必須。',
    'The method is not allowed for this resource; the Allow header is mandatory.',
    'RFC 9110 §15.5.6',
  ),
  entry(
    406,
    'Not Acceptable',
    'Acceptヘッダーを満たす表現がない。',
    'No representation matches the request Accept headers.',
    'RFC 9110 §15.5.7',
  ),
  entry(
    407,
    'Proxy Authentication Required',
    'プロキシでの認証が必要。',
    'The client must authenticate with the proxy first.',
    'RFC 9110 §15.5.8',
  ),
  entry(
    408,
    'Request Timeout',
    'クライアントからのリクエストが時間内に完了しなかった。',
    'The client did not produce a complete request in time.',
    'RFC 9110 §15.5.9',
  ),
  entry(
    409,
    'Conflict',
    'リソースの現在の状態と競合する。楽観ロックの衝突など。',
    'The request conflicts with the current state, such as an optimistic-locking clash.',
    'RFC 9110 §15.5.10',
  ),
  entry(
    410,
    'Gone',
    '恒久的に削除された。404と違い復活しないことを示す。',
    'Permanently removed; unlike 404 it states the resource will not come back.',
    'RFC 9110 §15.5.11',
  ),
  entry(
    411,
    'Length Required',
    'Content-Lengthヘッダーが必要。',
    'The request must include a Content-Length header.',
    'RFC 9110 §15.5.12',
  ),
  entry(
    412,
    'Precondition Failed',
    'If-Matchなどの事前条件を満たさなかった。',
    'A precondition such as If-Match evaluated to false.',
    'RFC 9110 §15.5.13',
  ),
  entry(
    413,
    'Content Too Large',
    'ボディが受理できる上限を超えている。',
    'The request body is larger than the server is willing to process.',
    'RFC 9110 §15.5.14',
  ),
  entry(
    414,
    'URI Too Long',
    'URIが長すぎる。GETのクエリが肥大した場合など。',
    'The request URI is longer than the server will interpret.',
    'RFC 9110 §15.5.15',
  ),
  entry(
    415,
    'Unsupported Media Type',
    'Content-Typeがサポート外。',
    'The payload media type is not supported.',
    'RFC 9110 §15.5.16',
  ),
  entry(
    416,
    'Range Not Satisfiable',
    'Rangeヘッダーの範囲が表現の外を指している。',
    'The requested range lies outside the representation.',
    'RFC 9110 §15.5.17',
  ),
  entry(
    417,
    'Expectation Failed',
    'Expectヘッダーの要求を満たせない。',
    'The expectation in the Expect header could not be met.',
    'RFC 9110 §15.5.18',
  ),
  entry(
    418,
    "I'm a Teapot",
    'エイプリルフールのジョーク仕様。実運用では使わない。',
    'An April Fools joke specification; do not use it in production.',
    'RFC 2324 §2.3.2',
  ),
  entry(
    421,
    'Misdirected Request',
    'この接続では応答できないオーソリティ宛て。HTTP/2の接続再利用で起きる。',
    'The request went to a server unable to answer for that authority, seen with HTTP/2 coalescing.',
    'RFC 9110 §15.5.20',
  ),
  entry(
    422,
    'Unprocessable Content',
    '構文は正しいが意味的に処理できない。バリデーションエラーで使う。',
    'Syntactically valid but semantically wrong, the usual choice for validation errors.',
    'RFC 9110 §15.5.21',
  ),
  entry(
    423,
    'Locked',
    'リソースがロックされている。WebDAVで使う。',
    'The resource is locked, used by WebDAV.',
    'RFC 4918 §11.3',
  ),
  entry(
    424,
    'Failed Dependency',
    '依存する別のリクエストが失敗した。WebDAVで使う。',
    'A dependent request failed, used by WebDAV.',
    'RFC 4918 §11.4',
  ),
  entry(
    425,
    'Too Early',
    'リプレイの恐れがある早期データを処理しない。TLS 1.3の0-RTTで使う。',
    'The server will not process early data that risks replay, as with TLS 1.3 0-RTT.',
    'RFC 8470 §5.2',
  ),
  entry(
    426,
    'Upgrade Required',
    '別のプロトコルへのアップグレードが必要。',
    'The client must switch to a different protocol.',
    'RFC 9110 §15.5.22',
  ),
  entry(
    428,
    'Precondition Required',
    '事前条件付きリクエストを必須にして、更新の取りこぼしを防ぐ。',
    'Requires a conditional request so concurrent updates cannot be lost.',
    'RFC 6585 §3',
  ),
  entry(
    429,
    'Too Many Requests',
    'レート制限に達した。Retry-Afterヘッダーを添える。',
    'The client hit a rate limit; pair it with a Retry-After header.',
    'RFC 6585 §4',
  ),
  entry(
    431,
    'Request Header Fields Too Large',
    'ヘッダーが大きすぎる。Cookieの肥大が原因になりやすい。',
    'The header fields are too large, often from oversized cookies.',
    'RFC 6585 §5',
  ),
  entry(
    451,
    'Unavailable For Legal Reasons',
    '法的な理由で提供できない。',
    'The resource is unavailable for legal reasons.',
    'RFC 7725 §3',
  ),

  entry(
    500,
    'Internal Server Error',
    'サーバー側の想定外のエラー。詳細はクライアントに出さない。',
    'An unexpected server-side failure; keep the details out of the response.',
    'RFC 9110 §15.6.1',
  ),
  entry(
    501,
    'Not Implemented',
    'そのメソッドをサーバーが実装していない。',
    'The server does not implement the requested method.',
    'RFC 9110 §15.6.2',
  ),
  entry(
    502,
    'Bad Gateway',
    '上流サーバーから不正な応答を受け取った。',
    'An invalid response came back from an upstream server.',
    'RFC 9110 §15.6.3',
  ),
  entry(
    503,
    'Service Unavailable',
    '一時的に処理できない。メンテナンスや過負荷。Retry-Afterを添える。',
    'Temporarily unable to handle the request; pair it with Retry-After.',
    'RFC 9110 §15.6.4',
  ),
  entry(
    504,
    'Gateway Timeout',
    '上流サーバーからの応答が時間内に得られなかった。',
    'No timely response arrived from an upstream server.',
    'RFC 9110 §15.6.5',
  ),
  entry(
    505,
    'HTTP Version Not Supported',
    '要求されたHTTPバージョンに対応していない。',
    'The requested HTTP version is not supported.',
    'RFC 9110 §15.6.6',
  ),
  entry(
    506,
    'Variant Also Negotiates',
    'コンテントネゴシエーションの設定に誤りがある。',
    'The server has a content-negotiation configuration error.',
    'RFC 2295 §8.1',
  ),
  entry(
    507,
    'Insufficient Storage',
    '保存領域が不足している。WebDAVで使う。',
    'There is not enough storage to complete the request, used by WebDAV.',
    'RFC 4918 §11.5',
  ),
  entry(
    508,
    'Loop Detected',
    '処理中に無限ループを検出した。WebDAVで使う。',
    'An infinite loop was detected while processing, used by WebDAV.',
    'RFC 5842 §7.2',
  ),
  entry(
    510,
    'Not Extended',
    'リクエストに追加の拡張が必要。',
    'Further extensions to the request are required.',
    'RFC 2774 §7',
    { deprecated: true },
  ),
  entry(
    511,
    'Network Authentication Required',
    'ネットワークへのアクセスに認証が必要。キャプティブポータルで使う。',
    'Network access requires authentication, as behind a captive portal.',
    'RFC 6585 §6',
  ),
]

export const httpStatusClasses: readonly (HttpStatusClass | 'all')[] = [
  'all',
  '1xx',
  '2xx',
  '3xx',
  '4xx',
  '5xx',
]

export const statusClassOf = (code: number): HttpStatusClass =>
  `${Math.floor(code / 100)}xx` as HttpStatusClass

const normalize = (value: string) => value.toLocaleLowerCase().trim()

export const filterHttpStatuses = (
  entries: readonly HttpStatusEntry[],
  query: string,
  statusClass: HttpStatusClass | 'all',
) => {
  const normalizedQuery = normalize(query)
  return entries.filter((item) => {
    if (statusClass !== 'all' && statusClassOf(item.code) !== statusClass) return false
    if (!normalizedQuery) return true
    const searchable = [
      String(item.code),
      item.phrase,
      item.summary.ja,
      item.summary.en,
      item.reference,
    ]
      .map(normalize)
      .join(' ')
    return searchable.includes(normalizedQuery)
  })
}

export const findHttpStatus = (code: number) => httpStatuses.find((status) => status.code === code)
