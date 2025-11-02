import { defineConfig } from 'vitepress'
import { SearchPlugin } from 'vitepress-plugin-search'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '落星丁 Wiki',
  description: '记录与分享系统配置、Docker部署与技术学习。',
  lastUpdated: true,

  vite: {
    plugins: [SearchPlugin({})],
  },

  themeConfig: {
    logo: '/favicon.png',
    siteTitle: '落星丁 Wiki',

    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/markdown-examples' },
          { text: 'API 示例', link: '/api-examples' },
          { text: '本站构建指南', link: '/VitePress-Git' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/luoxding' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2025 落星丁'
    },

    lastUpdated: {
      text: '上次更新',
      formatOptions: { dateStyle: 'medium', timeStyle: 'short' }
    }
  },
})
