import { NextUIProvider} from '@nextui-org/react'
import type { AppProps } from 'next/app';

import '../styles/globals.css'
import '../styles/main.css'

import '../styles/blog.css'


function MyApp({ Component, pageProps }: AppProps) {
  return <NextUIProvider>
    <Component {...pageProps} />
  </NextUIProvider>
}

export default MyApp