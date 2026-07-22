import type { Metadata } from 'next'
import { NotFoundView } from '@/features/navigation/components/not-found-view'

// Exported as `404.html` and served by CloudFront for every unmatched path, so it
// must never be indexed and cannot rely on a locale route param.
export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
}

const NotFound = () => <NotFoundView />

export default NotFound
