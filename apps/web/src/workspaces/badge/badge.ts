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

/**
 * Brand `color`, `logo` (Simple Icons slug) and `logoColor` values are sourced
 * from https://simpleicons.org/. Shields.io resolves the `logo` slug against the
 * same icon set, so keeping the slugs in sync with Simple Icons keeps every
 * preset rendering. Grouped by the five UI categories, then alphabetical.
 */
export const badgePresets: BadgePreset[] = [
  // Languages
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
  { name: 'Python', category: 'language', color: '3776AB', logo: 'python', logoColor: 'white' },
  { name: 'Go', category: 'language', color: '00ADD8', logo: 'go', logoColor: 'white' },
  { name: 'Rust', category: 'language', color: '000000', logo: 'rust', logoColor: 'white' },
  { name: 'C', category: 'language', color: 'A8B9CC', logo: 'c', logoColor: 'black' },
  { name: 'C++', category: 'language', color: '00599C', logo: 'cplusplus', logoColor: 'white' },
  { name: 'PHP', category: 'language', color: '777BB4', logo: 'php', logoColor: 'white' },
  { name: 'Ruby', category: 'language', color: 'CC342D', logo: 'ruby', logoColor: 'white' },
  { name: 'Kotlin', category: 'language', color: '7F52FF', logo: 'kotlin', logoColor: 'white' },
  { name: 'Swift', category: 'language', color: 'F05138', logo: 'swift', logoColor: 'white' },
  { name: 'Dart', category: 'language', color: '0175C2', logo: 'dart', logoColor: 'white' },
  { name: 'Scala', category: 'language', color: 'DC322F', logo: 'scala', logoColor: 'white' },
  { name: 'Elixir', category: 'language', color: '4B275F', logo: 'elixir', logoColor: 'white' },
  { name: 'Lua', category: 'language', color: '2C2D72', logo: 'lua', logoColor: 'white' },
  { name: 'Haskell', category: 'language', color: '5D4F85', logo: 'haskell', logoColor: 'white' },
  { name: 'R', category: 'language', color: '276DC3', logo: 'r', logoColor: 'white' },
  { name: 'Clojure', category: 'language', color: '5881D8', logo: 'clojure', logoColor: 'white' },
  { name: 'Zig', category: 'language', color: 'F7A41D', logo: 'zig', logoColor: 'black' },
  // Frameworks
  { name: 'React', category: 'framework', color: '20232A', logo: 'react', logoColor: '61DAFB' },
  {
    name: 'Next.js',
    category: 'framework',
    color: '000000',
    logo: 'nextdotjs',
    logoColor: 'white',
  },
  { name: 'Vue.js', category: 'framework', color: '4FC08D', logo: 'vuedotjs', logoColor: 'white' },
  { name: 'Nuxt', category: 'framework', color: '00DC82', logo: 'nuxt', logoColor: 'white' },
  { name: 'Svelte', category: 'framework', color: 'FF3E00', logo: 'svelte', logoColor: 'white' },
  { name: 'Angular', category: 'framework', color: 'DD0031', logo: 'angular', logoColor: 'white' },
  { name: 'Astro', category: 'framework', color: 'BC52EE', logo: 'astro', logoColor: 'white' },
  {
    name: 'Tailwind CSS',
    category: 'framework',
    color: '06B6D4',
    logo: 'tailwindcss',
    logoColor: 'white',
  },
  { name: 'Vite', category: 'framework', color: '646CFF', logo: 'vite', logoColor: 'white' },
  {
    name: 'Node.js',
    category: 'framework',
    color: '5FA04E',
    logo: 'nodedotjs',
    logoColor: 'white',
  },
  { name: 'Express', category: 'framework', color: '000000', logo: 'express', logoColor: 'white' },
  { name: 'NestJS', category: 'framework', color: 'E0234E', logo: 'nestjs', logoColor: 'white' },
  { name: 'Django', category: 'framework', color: '092E20', logo: 'django', logoColor: 'white' },
  { name: 'Flask', category: 'framework', color: '000000', logo: 'flask', logoColor: 'white' },
  { name: 'FastAPI', category: 'framework', color: '009688', logo: 'fastapi', logoColor: 'white' },
  { name: 'Spring', category: 'framework', color: '6DB33F', logo: 'spring', logoColor: 'white' },
  { name: 'Laravel', category: 'framework', color: 'FF2D20', logo: 'laravel', logoColor: 'white' },
  {
    name: 'Ruby on Rails',
    category: 'framework',
    color: 'D30001',
    logo: 'rubyonrails',
    logoColor: 'white',
  },
  { name: 'Flutter', category: 'framework', color: '02569B', logo: 'flutter', logoColor: 'white' },
  { name: '.NET', category: 'framework', color: '512BD4', logo: 'dotnet', logoColor: 'white' },
  // Databases
  {
    name: 'PostgreSQL',
    category: 'database',
    color: '4169E1',
    logo: 'postgresql',
    logoColor: 'white',
  },
  { name: 'MySQL', category: 'database', color: '4479A1', logo: 'mysql', logoColor: 'white' },
  { name: 'MariaDB', category: 'database', color: '003545', logo: 'mariadb', logoColor: 'white' },
  { name: 'SQLite', category: 'database', color: '003B57', logo: 'sqlite', logoColor: 'white' },
  { name: 'MongoDB', category: 'database', color: '47A248', logo: 'mongodb', logoColor: 'white' },
  { name: 'Redis', category: 'database', color: 'FF4438', logo: 'redis', logoColor: 'white' },
  {
    name: 'Elasticsearch',
    category: 'database',
    color: '005571',
    logo: 'elasticsearch',
    logoColor: 'white',
  },
  { name: 'Supabase', category: 'database', color: '3FCF8E', logo: 'supabase', logoColor: 'white' },
  { name: 'Prisma', category: 'database', color: '2D3748', logo: 'prisma', logoColor: 'white' },
  { name: 'Neo4j', category: 'database', color: '4581C3', logo: 'neo4j', logoColor: 'white' },
  {
    name: 'SQLAlchemy',
    category: 'database',
    color: 'D71F00',
    logo: 'sqlalchemy',
    logoColor: 'white',
  },
  // Cloud
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
  { name: 'Vercel', category: 'cloud', color: '000000', logo: 'vercel', logoColor: 'white' },
  { name: 'Netlify', category: 'cloud', color: '00C7B7', logo: 'netlify', logoColor: 'white' },
  {
    name: 'Cloudflare',
    category: 'cloud',
    color: 'F38020',
    logo: 'cloudflare',
    logoColor: 'white',
  },
  { name: 'Firebase', category: 'cloud', color: 'DD2C00', logo: 'firebase', logoColor: 'white' },
  { name: 'Heroku', category: 'cloud', color: '430098', logo: 'heroku', logoColor: 'white' },
  {
    name: 'DigitalOcean',
    category: 'cloud',
    color: '0080FF',
    logo: 'digitalocean',
    logoColor: 'white',
  },
  {
    name: 'Kubernetes',
    category: 'cloud',
    color: '326CE5',
    logo: 'kubernetes',
    logoColor: 'white',
  },
  { name: 'Terraform', category: 'cloud', color: '844FBA', logo: 'terraform', logoColor: 'white' },
  { name: 'Ansible', category: 'cloud', color: 'EE0000', logo: 'ansible', logoColor: 'white' },
  { name: 'Railway', category: 'cloud', color: '0B0D0E', logo: 'railway', logoColor: 'white' },
  // Developer tools
  { name: 'Docker', category: 'tool', color: '2496ED', logo: 'docker', logoColor: 'white' },
  { name: 'GitHub', category: 'tool', color: '181717', logo: 'github', logoColor: 'white' },
  { name: 'Git', category: 'tool', color: 'F05032', logo: 'git', logoColor: 'white' },
  { name: 'GitLab', category: 'tool', color: 'FC6D26', logo: 'gitlab', logoColor: 'white' },
  {
    name: 'GitHub Actions',
    category: 'tool',
    color: '2088FF',
    logo: 'githubactions',
    logoColor: 'white',
  },
  { name: 'Jenkins', category: 'tool', color: 'D24939', logo: 'jenkins', logoColor: 'white' },
  {
    name: 'Visual Studio Code',
    category: 'tool',
    color: '007ACC',
    logo: 'visualstudiocode',
    logoColor: 'white',
  },
  { name: 'Neovim', category: 'tool', color: '57A143', logo: 'neovim', logoColor: 'white' },
  { name: 'Nginx', category: 'tool', color: '009639', logo: 'nginx', logoColor: 'white' },
  { name: 'Postman', category: 'tool', color: 'FF6C37', logo: 'postman', logoColor: 'white' },
  { name: 'Figma', category: 'tool', color: 'F24E1E', logo: 'figma', logoColor: 'white' },
  { name: 'Slack', category: 'tool', color: '4A154B', logo: 'slack', logoColor: 'white' },
  { name: 'Notion', category: 'tool', color: '000000', logo: 'notion', logoColor: 'white' },
  { name: 'npm', category: 'tool', color: 'CB3837', logo: 'npm', logoColor: 'white' },
  { name: 'pnpm', category: 'tool', color: 'F69220', logo: 'pnpm', logoColor: 'white' },
  { name: 'Yarn', category: 'tool', color: '2C8EBB', logo: 'yarn', logoColor: 'white' },
  { name: 'Webpack', category: 'tool', color: '8DD6F9', logo: 'webpack', logoColor: 'black' },
  { name: 'ESLint', category: 'tool', color: '4B32C3', logo: 'eslint', logoColor: 'white' },
  { name: 'Prettier', category: 'tool', color: 'F7B93E', logo: 'prettier', logoColor: 'black' },
  { name: 'Biome', category: 'tool', color: '60A5FA', logo: 'biome', logoColor: 'white' },
  { name: 'Storybook', category: 'tool', color: 'FF4785', logo: 'storybook', logoColor: 'white' },
  { name: 'Jest', category: 'tool', color: 'C21325', logo: 'jest', logoColor: 'white' },
  { name: 'Vitest', category: 'tool', color: '6E9F18', logo: 'vitest', logoColor: 'white' },
  { name: 'Cypress', category: 'tool', color: '69D3A7', logo: 'cypress', logoColor: 'black' },
  { name: 'Linux', category: 'tool', color: 'FCC624', logo: 'linux', logoColor: 'black' },
  { name: 'Ubuntu', category: 'tool', color: 'E95420', logo: 'ubuntu', logoColor: 'white' },
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
