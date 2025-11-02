import { defineConfig } from 'vitepress'
import fg from 'fast-glob'
import path from 'path'

// ======= 自动生成侧边栏 =======
function generateSidebar(baseDir: string) {
  const files = fg.sync('**/*.md', {
    cwd: baseDir,
    dot: false,
    ignore: ['node_modules/**', '.vitepress/**', 'public/**']
  })

  const sidebarMap: Record<string, any[]> = {}

  files.forEach(file => {
    const fullPath = '/' + file.replace(/\.md$/, '')
    const parts = file.split(path.sep)

    if (parts.length === 1) {
      // 根目录文件
      if (!sidebarMap['/']) sidebarMap['/'] = []
      sidebarMap['/'].push({ text: getTitle(parts[0]), link: fullPath })
    } else {
      // 子目录文件
      const dirName = '/' + parts.slice(0, -1).join('/') + '/'
      if (!sidebarMap[dirName]) sidebarMap[dirName] = []
      sidebarMap[dirName].push({ text: getTitle(parts[parts.length - 1]), link: fullPath })
    }
  })

  // 按数字前缀排序
  Object.keys(sidebarMap).forEach(key => {
    sidebarMap[key].sort((a, b) => a.text.localeCompare(b.text, 'zh-CN', { numeric: true }))
  })

  return sidebarMap
}

// ======= 提取文件名作为标题，去掉数字前缀 =======
function getTitle(filename: string) {
  return filename.replace(/^\d+_?/, '').replace(/\.md$/, '')
}

// ======= 基础路径 =======
const BASE_DIR = path.resolve(__dirname, '../')
const sidebar = generateSidebar(BASE_DIR)

// ======= 导航菜单，可以固定部分页面或目录 =======
const nav = [
  { text: '首页', link: '/' },
  {
    text: '笔记分类',
    items: [
      { text: '示例', link: '/markdown-examples' },
      { text: '构建指南', link: '/VitePress-Git' }
    ]
  }
]

// ======= 配置导出 =======
export default defineConfig({
  lang: 'zh-CN',
  title: '落星丁 Wiki',
  description: '记录与分享系统配置、Docker部署与技术学习。',
  lastUpdated: true,
  vite: {
    // 可加插件，如搜索插件
  },
  themeConfig: {
    logo: '/favicon.png',
    siteTitle: '落星丁 Wiki',
    nav,
    sidebar,
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
  }
})
