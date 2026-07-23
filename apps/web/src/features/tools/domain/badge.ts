export type BadgeProvider = 'shields' | 'badgen'
export type BadgeStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'

export type BadgeOptions = {
  provider: BadgeProvider
  label: string
  message: string
  color: string
  labelColor: string
  logo: string
  logoColor: string
  style: BadgeStyle
  link: string
}

export type BadgePreset = {
  name: string
  category: 'language' | 'framework' | 'database' | 'cloud' | 'tool'
  color: string
  logo: string
  logoColor: string
}

export const badgePresets: BadgePreset[] = [
  {
    name: 'TypeScript',
    category: 'language',
    color: '3178C6',
    logo: 'typescript',
    logoColor: 'white',
  },
  {
    name: 'JavaScript',
    category: 'language',
    color: 'F7DF1E',
    logo: 'javascript',
    logoColor: 'black',
  },
  {
    name: 'Python',
    category: 'language',
    color: '3776AB',
    logo: 'python',
    logoColor: 'white',
  },
  { name: 'Go', category: 'language', color: '00ADD8', logo: 'go', logoColor: 'white' },
  { name: 'Rust', category: 'language', color: '000000', logo: 'rust', logoColor: 'white' },
  { name: 'React', category: 'framework', color: '20232A', logo: 'react', logoColor: '61DAFB' },
  {
    name: 'Next.js',
    category: 'framework',
    color: '000000',
    logo: 'nextdotjs',
    logoColor: 'white',
  },
  { name: 'Vue.js', category: 'framework', color: '4FC08D', logo: 'vuedotjs', logoColor: 'white' },
  {
    name: 'Tailwind CSS',
    category: 'framework',
    color: '06B6D4',
    logo: 'tailwindcss',
    logoColor: 'white',
  },
  {
    name: 'PostgreSQL',
    category: 'database',
    color: '4169E1',
    logo: 'postgresql',
    logoColor: 'white',
  },
  { name: 'MySQL', category: 'database', color: '4479A1', logo: 'mysql', logoColor: 'white' },
  { name: 'Redis', category: 'database', color: 'FF4438', logo: 'redis', logoColor: 'white' },
  {
    name: 'Amazon Web Services',
    category: 'cloud',
    color: '232F3E',
    logo: 'amazonwebservices',
    logoColor: 'white',
  },
  {
    name: 'Google Cloud',
    category: 'cloud',
    color: '4285F4',
    logo: 'googlecloud',
    logoColor: 'white',
  },
  { name: 'Docker', category: 'tool', color: '2496ED', logo: 'docker', logoColor: 'white' },
  { name: 'GitHub', category: 'tool', color: '181717', logo: 'github', logoColor: 'white' },
  { name: 'Git', category: 'tool', color: 'F05032', logo: 'git', logoColor: 'white' },
  {
    name: 'Visual Studio Code',
    category: 'tool',
    color: '007ACC',
    logo: 'visualstudiocode',
    logoColor: 'white',
  },
]

const normalizeColor = (color: string) => color.trim().replace(/^#/, '')

/** Shields uses double dashes to escape a literal dash in badge path segments. */
const encodeShieldsSegment = (value: string) =>
  encodeURIComponent(value.trim()).replaceAll('-', '--')

const addQuery = (url: string, values: Record<string, string>) => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    if (value) query.set(key, value)
  }
  const suffix = query.toString()
  return suffix ? `${url}?${suffix}` : url
}

export const buildBadgeUrl = (options: BadgeOptions) => {
  const color = normalizeColor(options.color) || 'blue'

  if (options.provider === 'badgen') {
    const label = encodeURIComponent(options.label.trim() || 'badge')
    const message = encodeURIComponent(options.message.trim() || 'value')
    const url = `https://badgen.net/badge/${label}/${message}/${encodeURIComponent(color)}`
    return addQuery(url, {
      icon: options.logo.trim(),
      labelColor: normalizeColor(options.labelColor),
    })
  }

  const label = encodeShieldsSegment(options.label)
  const message = encodeShieldsSegment(options.message)
  const content = [label, message, color].filter(Boolean).join('-')
  return addQuery(`https://img.shields.io/badge/${content}`, {
    style: options.style === 'flat' ? '' : options.style,
    logo: options.logo.trim(),
    logoColor: options.logoColor.trim(),
    labelColor: normalizeColor(options.labelColor),
  })
}

export const buildBadgeOutputs = (options: BadgeOptions) => {
  const url = buildBadgeUrl(options)
  const alt = options.label.trim() || options.message.trim() || 'badge'
  const image = `![${alt}](${url})`
  const markdown = options.link.trim() ? `[${image}](${options.link.trim()})` : image
  const htmlImage = `<img src="${url}" alt="${alt}" />`
  const html = options.link.trim() ? `<a href="${options.link.trim()}">${htmlImage}</a>` : htmlImage

  return { url, markdown, html }
}
