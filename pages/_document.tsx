import * as React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class PageDocument extends Document {
  public props: {
    styleTags: any;
  }
  public static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage((App) => (props) => sheet.collectStyles(<App {...props} />))
    let styleTags = sheet.getStyleElement()
    if (typeof global !== 'undefined') {
      if (global.styles) {
        console.log('use cache')
        console.log(styles)
        styleTags = global.styles
      } else {
        console.log('render new')
        console.log(styleTags)
        global.styles = styleTags
      }
    }
    return { ...page, styleTags }
  }
  public render() {
    return (
      <html>
        <Head>
          <meta charSet='utf-8' className='next-head' />
          <meta id='vp' name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' /> {/* tslint:disable-line */}
          {this.props.styleTags}
        </Head>
        <body>
          <div className='root'>
            <Main />
          </div>
          <NextScript />
        </body>
      </html>
    )
  }
}
