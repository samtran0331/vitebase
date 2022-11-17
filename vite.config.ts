import path from 'path'
import { defineConfig } from 'vite'
import Preview from 'vite-plugin-vue-component-preview'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Markdown from 'vite-plugin-vue-markdown'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Inspect from 'vite-plugin-inspect'
import LinkAttributes from 'markdown-it-link-attributes'
import Unocss from 'unocss/vite'
import Shiki from 'markdown-it-shiki'

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    // This is the development path
    return {
      resolve: {
        alias: {
          '~/': `${path.resolve(__dirname, 'src')}/`,
        },
      },

      plugins: [
        Preview(),

        Vue({
          include: [/\.vue$/, /\.md$/],
          reactivityTransform: true,
        }),

        Pages({
          extensions: ['vue', 'md'],
        }),

        Layouts(),

        AutoImport({
          imports: [
            'vue',
            'vue-router',
            'vue-i18n',
            'vue/macros',
            '@vueuse/head',
            '@vueuse/core',
          ],
          dts: 'src/auto-imports.d.ts',
          dirs: [
            'src/composables',
            'src/store',
          ],
          vueTemplate: true,
        }),

        Components({
          // allow auto load markdown components under `./src/components/`
          extensions: ['vue', 'md'],
          // allow auto import and register components used in markdown
          include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
          dts: 'src/components.d.ts',
        }),

        // see unocss.config.ts for config
        Unocss(),

        Markdown({
          wrapperClasses: 'prose prose-sm m-auto text-left',
          headEnabled: true,
          markdownItSetup(md) {
            // https://prismjs.com/
            md.use(Shiki, {
              theme: {
                light: 'vitesse-light',
                dark: 'vitesse-dark',
              },
            })
            md.use(LinkAttributes, {
              matcher: (link: string) => /^https?:\/\//.test(link),
              attrs: {
                target: '_blank',
                rel: 'noopener',
              },
            })
          },
        }),

        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
          manifest: {
            name: 'Vitesse',
            short_name: 'Vitesse',
            theme_color: '#ffffff',
            icons: [
              {
                src: '/pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: '/pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: '/pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              },
            ],
          },
        }),

        VueI18n({
          runtimeOnly: true,
          compositionOnly: true,
          include: [path.resolve(__dirname, 'locales/**')],
        }),

        Inspect(),
      ],

      test: {
        include: ['test/**/*.test.ts'],
        environment: 'jsdom',
        deps: {
          inline: ['@vue', '@vueuse', 'vue-demi'],
        },
      },

      ssgOptions: {
        script: 'async',
        formatting: 'minify',
        onFinished() { generateSitemap() },
      },

      ssr: {
        // TODO: workaround until they support native ESM
        noExternal: ['workbox-window', /vue-i18n/],
      },

    }
  }
  else {
    //  This is the production path
    return {
      resolve: {
        alias: {
          '~/': `${path.resolve(__dirname, 'src')}/`,
        },
      },

      // base: './',

      plugins: [
        Preview(),

        Vue({
          include: [/\.vue$/, /\.md$/],
          reactivityTransform: true,
        }),

        Pages({
          extensions: ['vue', 'md'],
        }),

        Layouts(),

        AutoImport({
          imports: [
            'vue',
            'vue-router',
            'vue-i18n',
            'vue/macros',
            '@vueuse/head',
            '@vueuse/core',
          ],
          dts: 'src/auto-imports.d.ts',
          dirs: [
            'src/composables',
            'src/store',
          ],
          vueTemplate: true,
        }),

        Components({
          // allow auto load markdown components under `./src/components/`
          extensions: ['vue', 'md'],
          // allow auto import and register components used in markdown
          include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
          dts: 'src/components.d.ts',
        }),

        // see unocss.config.ts for config
        Unocss(),

        Markdown({
          wrapperClasses: 'prose prose-sm m-auto text-left',
          headEnabled: true,
          markdownItSetup(md) {
            // https://prismjs.com/
            md.use(Shiki, {
              theme: {
                light: 'vitesse-light',
                dark: 'vitesse-dark',
              },
            })
            md.use(LinkAttributes, {
              matcher: (link: string) => /^https?:\/\//.test(link),
              attrs: {
                target: '_blank',
                rel: 'noopener',
              },
            })
          },
        }),

        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
          manifest: {
            name: 'Vitesse',
            short_name: 'Vitesse',
            theme_color: '#ffffff',
            icons: [
              {
                src: '/pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: '/pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: '/pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              },
            ],
          },
        }),

        VueI18n({
          runtimeOnly: true,
          compositionOnly: true,
          include: [path.resolve(__dirname, 'locales/**')],
        }),

        Inspect(),
      ],

      test: {
        include: ['test/**/*.test.ts'],
        environment: 'jsdom',
        deps: {
          inline: ['@vue', '@vueuse', 'vue-demi'],
        },
      },

      ssgOptions: {
        script: 'async',
        formatting: 'minify',
        onFinished() { generateSitemap() },
      },

      ssr: {
        // TODO: workaround until they support native ESM
        noExternal: ['workbox-window', /vue-i18n/],
      },

    }
  }
})
