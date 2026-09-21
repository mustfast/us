/**
 * 扫描 public/files/ 下的文档，生成前端可读取的清单 public/docs.json
 *
 * 目录约定：
 *   public/files/            <- 所有文档放这里
 *   public/files/简历/a.pdf   <- 一级子目录名会自动作为「分类」
 *   public/files/b.pdf       <- 直接放根下则归类为「未分类」
 *
 * 可选：项目根目录的 docs.meta.json 用来补充标题和描述
 *   { "简历/柳黎明简历.pdf": { "title": "柳黎明 · 简历", "desc": "2026 版" } }
 */
import { readdirSync, statSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, relative, extname, basename, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const FILES_DIR = join(ROOT, 'public', 'files')
const OUT_FILE = join(ROOT, 'public', 'docs.json')
const META_FILE = join(ROOT, 'docs.meta.json')

/** 可以在浏览器里直接内嵌预览的格式 */
const PREVIEWABLE = new Set(['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'])
/** 收录进清单的格式，其余文件会被忽略 */
const ALLOWED = new Set([
  ...PREVIEWABLE,
  'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'txt', 'md', 'csv', 'zip', 'rar', '7z'
])

const toPosix = (p) => p.split(sep).join('/')

/** 递归收集文件，跳过隐藏文件/目录 */
function walk(dir, base = dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walk(full, base))
    } else if (entry.isFile()) {
      out.push({ full, rel: toPosix(relative(base, full)) })
    }
  }
  return out
}

function loadMeta() {
  if (!existsSync(META_FILE)) return {}
  try {
    return JSON.parse(readFileSync(META_FILE, 'utf8'))
  } catch (err) {
    console.warn(`[gen-docs] docs.meta.json 解析失败，已忽略：${err.message}`)
    return {}
  }
}

const meta = loadMeta()
const files = []
let skipped = 0

for (const { full, rel } of walk(FILES_DIR)) {
  if (basename(rel).startsWith('.')) continue

  const ext = extname(rel).slice(1).toLowerCase()
  if (!ALLOWED.has(ext)) {
    skipped++
    continue
  }

  const segments = rel.split('/')
  // 一级子目录作为分类；直接放在根目录的归入「未分类」
  const category = segments.length > 1 ? segments[0] : '未分类'
  // 完整目录路径，用于展示多级结构（如 AI/paper）
  const folder = segments.length > 1 ? segments.slice(0, -1).join('/') : ''
  const stat = statSync(full)
  const override = meta[rel] || {}

  files.push({
    path: rel,
    title: override.title || basename(rel, extname(rel)),
    category,
    folder,
    ext,
    previewable: PREVIEWABLE.has(ext),
    size: stat.size,
    mtime: stat.mtime.toISOString(),
    desc: override.desc || ''
  })
}

// 分类 → 目录 → 标题，依次排序
const collator = new Intl.Collator('zh-Hans-CN')
files.sort((a, b) => {
  if (a.category !== b.category) return collator.compare(a.category, b.category)
  if (a.folder !== b.folder) return collator.compare(a.folder, b.folder)
  return collator.compare(a.title, b.title)
})

writeFileSync(
  OUT_FILE,
  JSON.stringify({ generatedAt: new Date().toISOString(), count: files.length, files }, null, 2) + '\n',
  'utf8'
)

const categories = [...new Set(files.map((f) => f.category))]
console.log(`[gen-docs] 收录 ${files.length} 份文档，分类：${categories.join('、') || '无'}`)
if (skipped > 0) console.log(`[gen-docs] 跳过 ${skipped} 个不支持的文件类型`)
if (!existsSync(FILES_DIR)) console.log(`[gen-docs] 提示：目录 ${toPosix(relative(ROOT, FILES_DIR))}/ 尚不存在`)
console.log(`[gen-docs] 清单已写入 ${toPosix(relative(ROOT, OUT_FILE))}`)
