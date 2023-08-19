import 'antd/dist/reset.css'
import '../styles/main.scss'

import React from 'react'
import Head from 'next/head'
import { useAmp } from 'next/amp'
import SiteLayout from '../components/SiteLayout'
import { BRAND_NAME, OG_TITLE, SITE_BASE_URL } from '../constants'
import { DefaultSeo } from 'next-seo'
import { Provider } from 'react-redux'
import store from '../store'
import NextProgressbar from '../components/NextProgressbar'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { AuthProvider } from '@/context/AuthProvider'

dayjs.extend(relativeTime)
dayjs.locale('vi')

function App ({ Component, pageProps }) {
  const isAmp = useAmp()

  const Layout = (props) => (
    <Provider store={store()}>
      <SiteLayout {...props} />
    </Provider>
  )

  return (
    <>
      <Head>
        {!isAmp && (
          <>
            <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' key='viewport' />
            <meta httpEquiv='x-ua-compatible' content='ie=edge' />

            <link rel='apple-touch-icon' sizes='57x57' href='/favicon/apple-icon-57x57.png' />
            <link rel='apple-touch-icon' sizes='60x60' href='/favicon/apple-icon-60x60.png' />
            <link rel='apple-touch-icon' sizes='72x72' href='/favicon/apple-icon-72x72.png' />
            <link rel='apple-touch-icon' sizes='76x76' href='/favicon/apple-icon-76x76.png' />
            <link rel='apple-touch-icon' sizes='114x114' href='/favicon/apple-icon-114x114.png' />
            <link rel='apple-touch-icon' sizes='120x120' href='/favicon/apple-icon-120x120.png' />
            <link rel='apple-touch-icon' sizes='144x144' href='/favicon/apple-icon-144x144.png' />
            <link rel='apple-touch-icon' sizes='152x152' href='/favicon/apple-icon-152x152.png' />
            <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-icon-180x180.png' />
            <link rel='icon' type='image/png' sizes='192x192' href='/favicon/android-icon-192x192.png' />
            <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
            <link rel='icon' type='image/png' sizes='96x96' href='/favicon/favicon-96x96.png' />
            <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
            <meta name='msapplication-TileColor' content='#ffffff' />
            <meta name='msapplication-TileImage' content='/favicon/ms-icon-144x144.png' />
            <meta name='theme-color' content='#995611' />
            <link rel='manifest' href='/favicon/manifest.json' />
            <link rel='shortcut icon' href='/favicon/favicon.ico' type='image/x-icon' />
          </>
        )}
      </Head>

      <DefaultSeo
        title={BRAND_NAME}
        openGraph={{
          type: 'website',
          site_name: BRAND_NAME,
          title: OG_TITLE,
          url: SITE_BASE_URL,
          images: [
            {
              url: `${SITE_BASE_URL}/images/ogimg.jpg`,
              width: 1200,
              height: 630,
              alt: BRAND_NAME
            }
          ]
        }}
        twitter={{
          cardType: 'summary_large_image'
        }}
        facebook={{
          appId: '112276442265938'
        }}
      />

      {!isAmp && (
        <NextProgressbar
          nonce='my-nonce'
          showOnShallow
          color='#FF52B5'
          startPosition={0.3}
          stopDelayMs={200}
          height={4}
          options={{
            showSpinner: false
          }}
        />
      )}

      <StyleProvider hashPriority='high'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00BFFF',
              colorSuccess: '#3fa00e'
            }
          }}
          componentSize='large'
          prefixCls='vluit'
        >
          <AuthProvider>
            <Layout>
              <GoogleAnalytics trackPageViews />
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        </ConfigProvider>
      </StyleProvider>
    </>
  )
}

export default App
