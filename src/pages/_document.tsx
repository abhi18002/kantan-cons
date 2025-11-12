import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />

        <link
          rel='preload'
          as='style'
          href='https://fonts.googleapis.com/css2?family=Advent+Pro:wght@400;600&family=Bricolage+Grotesque:wght@400;700&display=swap'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Advent+Pro:wght@400;600&family=Bricolage+Grotesque:wght@400;700&display=swap'
          media='print'
        />

        <noscript>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Advent+Pro:wght@400;600&family=Bricolage+Grotesque:wght@400;700&display=swap'
          />
        </noscript>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
