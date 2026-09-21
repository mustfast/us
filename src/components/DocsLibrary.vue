<template>
  <div class="library">
    <header class="lib-head">
      <div class="lib-head-main">
        <h1>文档库</h1>
        <p class="lib-sub">
          <template v-if="!loading && !error">
            共 {{ docs.length }} 份文档<template v-if="categories.length > 1"> · {{ categories.length }} 个分类</template>
            <template v-if="generatedAt"> · 更新于 {{ dateText(generatedAt) }}</template>
          </template>
          <template v-else>个人资料集中存放，随时在线查看</template>
        </p>
      </div>
      <div class="lib-head-actions">
        <input
          v-model="keyword"
          class="search"
          type="search"
          placeholder="搜索文档名 / 分类"
          aria-label="搜索文档"
        />
        <button class="btn-ghost" :disabled="loading" @click="load">
          {{ loading ? '加载中…' : '刷新' }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="state">正在加载文档清单…</div>

    <div v-else-if="error" class="state state-error">
      <p>加载清单失败：{{ error }}</p>
      <p class="state-hint">
        请先执行 <code>npm run gen:docs</code> 生成清单，再把 PDF 放入 <code>public/files/</code>。
      </p>
    </div>

    <div v-else-if="!docs.length" class="state">
      <p>还没有任何文档。</p>
      <p class="state-hint">
        把 PDF 放进 <code>public/files/</code>（可用子目录分类，例如 <code>public/files/证件/</code>），
        然后执行 <code>npm run deploy</code>。
      </p>
    </div>

    <template v-else>
      <nav class="cats">
        <button
          v-for="c in categoryTabs"
          :key="c.value"
          class="cat"
          :class="{ active: c.value === activeCat }"
          @click="activeCat = c.value"
        >
          {{ c.label }}<span class="cat-count">{{ c.count }}</span>
        </button>
      </nav>

      <div v-if="!filtered.length" class="state">没有匹配「{{ keyword }}」的文档</div>

      <section v-for="group in grouped" :key="group.name" class="group">
        <h2 class="group-title">{{ group.name }}</h2>
        <ul class="doc-list">
          <li
            v-for="doc in group.items"
            :key="doc.path"
            class="doc"
            tabindex="0"
            role="button"
            @click="open(doc)"
            @keydown.enter.prevent="open(doc)"
            @keydown.space.prevent="open(doc)"
          >
            <span class="doc-icon" aria-hidden="true">{{ iconOf(doc) }}</span>
            <span class="doc-main">
              <span class="doc-title">{{ doc.title }}</span>
              <span class="doc-meta">
                <span v-if="doc.folder && doc.folder !== doc.category" class="doc-folder">{{ doc.folder }}</span>
                {{ doc.ext.toUpperCase() }} · {{ sizeText(doc.size) }} · {{ dateText(doc.mtime) }}
              </span>
              <span v-if="doc.desc" class="doc-desc">{{ doc.desc }}</span>
            </span>
            <span class="doc-action">{{ doc.previewable ? '预览' : '下载' }}</span>
          </li>
        </ul>
      </section>
    </template>

    <div v-if="current" class="viewer" @click.self="close">
      <div class="viewer-box">
        <div class="viewer-bar">
          <span class="viewer-name" :title="current.title">{{ current.title }}</span>
          <span class="viewer-tools">
            <a :href="urlOf(current)" target="_blank" rel="noopener">
              {{ current.textual ? '查看原文' : '新标签打开' }}
            </a>
            <a :href="urlOf(current)" download>下载</a>
            <button type="button" @click="close">关闭</button>
          </span>
        </div>
        <div v-if="current.textual" class="viewer-doc">
          <div v-if="docLoading" class="viewer-hint">正在渲染…</div>
          <div v-else-if="docError" class="viewer-hint viewer-hint-error">{{ docError }}</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <article v-else class="md-body" v-html="docHtml"></article>
        </div>
        <iframe v-else-if="current.previewable" class="viewer-frame" :src="frameSrc(current)" :title="current.title"></iframe>
        <div v-else class="viewer-fallback">
          <p>{{ current.ext.toUpperCase() }} 格式无法在浏览器里直接预览。</p>
          <p><a :href="urlOf(current)" download>点击下载后查看</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const BASE = import.meta.env.BASE_URL
const MANIFEST = `${BASE}docs.json`

const docs = ref([])
const generatedAt = ref('')
const loading = ref(true)
const error = ref('')
const keyword = ref('')
const activeCat = ref('__all__')
const current = ref(null)
/* 文本类文档（Markdown）的渲染结果 */
const docHtml = ref('')
const docLoading = ref(false)
const docError = ref('')

/* iOS / iPadOS 的 Safari 无法在内嵌 iframe 里渲染 PDF，改为直接新标签打开 */
function isIOS() {
  const ua = navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(MANIFEST, { cache: 'no-cache' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    docs.value = Array.isArray(data.files) ? data.files : []
    generatedAt.value = data.generatedAt || ''
  } catch (err) {
    docs.value = []
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return docs.value.filter((doc) => {
    if (activeCat.value !== '__all__' && doc.category !== activeCat.value) return false
    if (!kw) return true
    return (
      doc.title.toLowerCase().includes(kw) ||
      doc.category.toLowerCase().includes(kw) ||
      (doc.folder || '').toLowerCase().includes(kw) ||
      doc.path.toLowerCase().includes(kw)
    )
  })
})

const categories = computed(() => [...new Set(docs.value.map((d) => d.category))])

const categoryTabs = computed(() => [
  { value: '__all__', label: '全部', count: docs.value.length },
  ...categories.value.map((name) => ({
    value: name,
    label: name,
    count: docs.value.filter((d) => d.category === name).length
  }))
])

const grouped = computed(() => {
  const groups = new Map()
  for (const doc of filtered.value) {
    if (!groups.has(doc.category)) groups.set(doc.category, [])
    groups.get(doc.category).push(doc)
  }
  return [...groups.entries()].map(([name, items]) => ({ name, items }))
})

function encodeRelPath(rel) {
  return rel.split('/').map(encodeURIComponent).join('/')
}

function urlOf(doc) {
  return `${BASE}files/${encodeRelPath(doc.path)}`
}

function frameSrc(doc) {
  return `${urlOf(doc)}#view=FitH&toolbar=1&navpanes=0`
}

function open(doc) {
  // Markdown 等文本类文档由前端自行渲染，任何设备都不需要跳转
  if (doc.textual) {
    current.value = doc
    return
  }
  if (!doc.previewable) {
    window.open(urlOf(doc), '_blank', 'noopener')
    return
  }
  if (isIOS()) {
    window.open(urlOf(doc), '_blank', 'noopener')
    return
  }
  current.value = doc
}

function close() {
  current.value = null
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

watch(current, async (doc) => {
  document.body.style.overflow = doc ? 'hidden' : ''
  docHtml.value = ''
  docError.value = ''
  if (!doc || !doc.textual) return

  docLoading.value = true
  try {
    const res = await fetch(urlOf(doc))
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const source = await res.text()
    // 按需加载解析库，只有打开 Markdown 文档时才会下载
    const { marked } = await import('marked')
    const html = marked.parse(source, { gfm: true, breaks: false })
    if (current.value === doc) docHtml.value = html
  } catch (err) {
    if (current.value === doc) docError.value = `渲染失败：${err.message}`
  } finally {
    docLoading.value = false
  }
})

const ICONS = {
  pdf: '📄',
  md: '📝', markdown: '📝',
  doc: '📝', docx: '📝',
  xls: '📊', xlsx: '📊', csv: '📊',
  ppt: '📽️', pptx: '📽️',
  png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️',
  zip: '🗜️', rar: '🗜️', '7z': '🗜️'
}

function iconOf(doc) {
  return ICONS[doc.ext] || '📁'
}

function sizeText(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function dateText(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  load()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.library {
  max-width: 880px;
  margin: 40px auto;
  background: #fff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, .08);
  border-radius: 4px;
  overflow: hidden;
  padding-bottom: 8px;
}

/* ----- 头部 ----- */
.lib-head {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  padding: 26px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.lib-head h1 { font-size: 26px; font-weight: 700; letter-spacing: 2px; }
.lib-sub { font-size: 13px; opacity: .8; margin-top: 4px; }
.lib-head-actions { display: flex; gap: 10px; align-items: center; }

.search {
  width: 220px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  color: #fff;
  background: rgba(255, 255, 255, .12);
  border: 1px solid rgba(255, 255, 255, .25);
  border-radius: 20px;
  outline: none;
  transition: background .2s, border-color .2s;
}
.search::placeholder { color: rgba(255, 255, 255, .6); }
.search:focus { background: rgba(255, 255, 255, .2); border-color: rgba(255, 255, 255, .5); }

.btn-ghost {
  padding: 8px 16px;
  font-size: 13px;
  font-family: inherit;
  color: #a8d8ff;
  background: transparent;
  border: 1px solid rgba(168, 216, 255, .5);
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: background .2s;
}
.btn-ghost:hover:not(:disabled) { background: rgba(168, 216, 255, .15); }
.btn-ghost:disabled { opacity: .5; cursor: default; }

/* ----- 状态提示 ----- */
.state { padding: 40px; text-align: center; color: #888; font-size: 14px; }
.state-error { color: #c0392b; }
.state-hint { margin-top: 8px; font-size: 13px; color: #999; }
.state code {
  background: #f0f2f5;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12.5px;
  color: #0f3460;
}

/* ----- 分类标签 ----- */
.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 18px 40px 4px;
}
.cat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  font-size: 13px;
  font-family: inherit;
  color: #1a3a6b;
  background: #e8f0fe;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background .2s, color .2s;
}
.cat:hover { background: #d6e4fb; }
.cat.active { background: #0f3460; color: #fff; }
.cat-count { font-size: 11.5px; opacity: .7; }

/* ----- 分组与列表 ----- */
.group { padding: 16px 40px 4px; }
.group-title {
  font-size: 16px;
  color: #0f3460;
  padding-bottom: 6px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  letter-spacing: 1px;
}
.doc-list { list-style: none; }

.doc {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background .15s;
}
.doc:hover, .doc:focus-visible { background: #f5f8fd; outline: none; }
.doc + .doc { border-top: 1px solid #f4f5f7; }

.doc-icon { font-size: 22px; line-height: 1; flex-shrink: 0; }
.doc-main { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.doc-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.doc-meta { font-size: 12.5px; color: #999; margin-top: 2px; }
.doc-folder {
  display: inline-block;
  background: #f0f4fa;
  color: #5b7290;
  border-radius: 3px;
  padding: 0 6px;
  margin-right: 6px;
  font-size: 11.5px;
}
.doc-desc { font-size: 13px; color: #666; margin-top: 2px; }
.doc-action {
  font-size: 13px;
  color: #0f3460;
  border: 1px solid #cfdff2;
  border-radius: 16px;
  padding: 4px 12px;
  flex-shrink: 0;
  transition: background .15s, color .15s;
}
.doc:hover .doc-action { background: #0f3460; color: #fff; border-color: #0f3460; }

/* ----- 预览弹层 ----- */
.viewer {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(15, 20, 35, .75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.viewer-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  height: 100%;
  max-height: 900px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 12px 48px rgba(0, 0, 0, .4);
}
.viewer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 16px;
  background: #1a1a2e;
  color: #fff;
  flex-shrink: 0;
}
.viewer-name {
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.viewer-tools { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
.viewer-tools a, .viewer-tools button {
  font-size: 13px;
  font-family: inherit;
  color: #a8d8ff;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
}
.viewer-tools a:hover, .viewer-tools button:hover { text-decoration: underline; }
.viewer-frame { flex: 1; width: 100%; border: none; background: #525659; }
.viewer-fallback { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #666; font-size: 14px; }
.viewer-fallback a { color: #0f3460; }

/* ----- 文档正文容器（Markdown 排版样式见文件末尾的非 scoped 样式块）----- */
.viewer-doc { flex: 1; overflow: auto; background: #fff; }
.viewer-hint { padding: 48px; text-align: center; color: #888; font-size: 14px; }
.viewer-hint-error { color: #c0392b; }

/* ----- 响应式 ----- */
@media (max-width: 640px) {
  .library { margin: 0; border-radius: 0; }
  .lib-head { padding: 20px; flex-direction: column; align-items: stretch; }
  .lib-head-actions { flex-direction: column; align-items: stretch; }
  .search { width: 100%; }
  .cats { padding: 14px 20px 0; }
  .group { padding: 14px 20px 0; }
  .doc { padding: 11px 8px; gap: 10px; }
  .doc-action { display: none; }
  .viewer { padding: 0; }
  .viewer-box { border-radius: 0; max-height: none; }
  .viewer-tools { gap: 10px; }
}
</style>

<!--
  Markdown 正文排版：必须放在非 scoped 的样式块里。
  v-html 注入的节点不会带上 scoped 的 data-v 属性，写在 scoped 样式块里会完全不生效。
  所有规则都以 .md-body 开头，因此不会外泄到页面其他部分。
-->
<style>
.md-body {
  max-width: 820px;
  margin: 0 auto;
  padding: 32px 44px 64px;
  font-size: 15px;
  line-height: 1.75;
  color: #333;
  word-wrap: break-word;
}
.md-body > *:first-child { margin-top: 0; }
.md-body h1 {
  font-size: 24px;
  color: #1a1a2e;
  line-height: 1.35;
  margin: 0 0 18px;
  padding-bottom: 10px;
  border-bottom: 2px solid #0f3460;
}
.md-body h2 {
  font-size: 19px;
  color: #0f3460;
  margin: 32px 0 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e6ebf2;
}
.md-body h3 { font-size: 16.5px; color: #1a1a2e; margin: 24px 0 8px; }
.md-body h4 { font-size: 15px; color: #1a1a2e; margin: 20px 0 6px; }
.md-body p { margin: 10px 0; }
.md-body ul, .md-body ol { margin: 10px 0; padding-left: 26px; }
.md-body li { margin: 4px 0; }
.md-body li::marker { color: #0f3460; }
.md-body a { color: #0f3460; text-decoration: underline; text-underline-offset: 2px; }
.md-body strong { color: #1a1a2e; }
.md-body hr { border: none; border-top: 1px solid #e6ebf2; margin: 26px 0; }

.md-body blockquote {
  margin: 14px 0;
  padding: 8px 16px;
  border-left: 3px solid #b7cbe3;
  background: #f6f9fd;
  color: #4a5b70;
}
.md-body blockquote > *:first-child { margin-top: 0; }
.md-body blockquote > *:last-child { margin-bottom: 0; }

.md-body code {
  background: #eef1f5;
  color: #b3306b;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.md-body pre {
  background: #1a1a2e;
  color: #e6edf3;
  padding: 14px 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 14px 0;
  line-height: 1.6;
}
.md-body pre code { background: none; color: inherit; padding: 0; font-size: 13px; }

.md-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 13.5px;
}
.md-body th, .md-body td {
  border: 1px solid #e2e8f0;
  padding: 7px 10px;
  text-align: left;
  vertical-align: top;
}
.md-body th { background: #f2f6fb; color: #0f3460; font-weight: 600; }
.md-body tbody tr:nth-child(even) { background: #fafbfd; }

@media (max-width: 640px) {
  .md-body { padding: 20px 18px 48px; font-size: 14.5px; }
  .md-body h1 { font-size: 20px; }
  .md-body h2 { font-size: 17px; margin-top: 26px; }
  /* 宽表格改为可横向滚动，避免撑破布局 */
  .md-body table { display: block; overflow-x: auto; }
}
</style>
