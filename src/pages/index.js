import { Inter } from 'next/font/google'

import { Home } from '@/views/Home'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Palette</title>
      </Head>
      <Home style={inter.style} />
    </>
  )
}
