module.exports = {
  siteMetadata: {
    title: 'National Scenic Trails Guide',
    googleVerification: 'abcdefz',
    disqus: 'gatsby-typescript'
  },
  mapping: {
    'MarkdownRemark.frontmatter.author': 'AuthorJson'
  },
  plugins: [
    // Expose `/data` to graphQL layer
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/data`
      }
    },

    // S3 plugin
    {
      resolve: 'gatsby-plugin-s3',
      options: {
        bucketName: 'nst.guide'
      }
    },

    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'YOUR_GOOGLE_ANALYTICS_TRACKING_ID',
        // Puts tracking script in the head instead of the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true
      }
    },

    // Parse all markdown files (each plugin add/parse some data into graphQL layer)
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 690,
              backgroundColor: '#f7f0eb'
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-autolink-headers'
        ]
      }
    },

    // Parse all images files
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',

    // Parse JSON files
    'gatsby-transformer-json',

    // Add typescript stack into webpack
    'gatsby-plugin-typescript',

    // This plugin takes your configuration and generates a
    // web manifest file so your website can be added to your
    // homescreen on Android.
    /* eslint-disable camelcase */
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Gatsby website',
        short_name: 'Gatsby website',
        start_url: '/',
        background_color: '#f7f7f7',
        theme_color: '#191919',
        display: 'minimal-ui'
      }
    },
    /* eslint-enable camelcase */

    // This plugin generates a service worker and AppShell
    // html file so the site works offline and is otherwise
    // resistant to bad networks. Works with almost any
    // site!

    // gatsby-plugin-offline is currently disabled. See
    // https://github.com/nst-guide/web/issues/15

    // {
    //   resolve: 'gatsby-plugin-offline',
    //   options: {
    //     workboxConfig: {
    //       runtimeCaching: [
    //         {
    //           // Use cacheFirst since these don't need to be revalidated (same RegExp
    //           // and same reason as above)
    //           urlPattern: /(\.js$|\.css$|static\/)/,
    //           handler: 'cacheFirst'
    //         },
    //         {
    //           // Page-data.json files are not content hashed
    //           urlPattern: /^https?:.*\page-data\/.*\/page-data\.json/,
    //           handler: 'networkFirst'
    //         },
    //         {
    //           // Add runtime caching of various other page resources
    //           // Specifically include pbf
    //           urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css|pbf)$/,
    //           handler: 'staleWhileRevalidate'
    //         },
    //         {
    //           // Google Fonts CSS (doesn't end in .css so we need to specify it)
    //           urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
    //           handler: 'staleWhileRevalidate'
    //         }
    //       ]
    //     }
    //   }
    // }
  ]
};
