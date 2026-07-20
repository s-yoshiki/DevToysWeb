import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { alternatesFor } from '@/features/seo/domain/site'

// The static export renders `/` as an empty client-redirect shell, so point
// crawlers at the Japanese home page instead of letting them index a blank URL.
export const metadata: Metadata = {
  alternates: alternatesFor('ja'),
}

const Page = () => {
  redirect('/ja')
}

export default Page
