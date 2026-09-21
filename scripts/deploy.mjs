/**
 * 把 docs/ 构建产物发布到 gh-pages 分支（GitHub Pages 会据此上线）。
 *
 * 关键点：整个过程通过一个临时的 git worktree 完成，
 * 完全不切换、不清理你当前的工作目录，所以本地文件（含未提交的 PDF）不会被删。
 *
 * 用法：npm run deploy
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const BRANCH = 'gh-pages'
const BUILD_DIR = 'docs'

const git = (args, opts = {}) => execFileSync('git', args, { stdio: 'inherit', ...opts })
const gitOut = (args, opts = {}) => execFileSync('git', args, { encoding: 'utf8', ...opts }).trim()

function fail(message) {
  console.error(`\n✖ ${message}`)
  process.exit(1)
}

/* ---------- 前置检查 ---------- */

if (!existsSync(BUILD_DIR) || !statSync(BUILD_DIR).isDirectory()) {
  fail(`找不到构建产物 ${BUILD_DIR}/，请先执行：npm run build`)
}

const strayPdfs = readdirSync('.').filter((f) => f.toLowerCase().endsWith('.pdf'))
if (strayPdfs.length) {
  console.warn(
    `\n⚠ 仓库根目录还有 ${strayPdfs.length} 个 PDF：${strayPdfs.join('、')}\n` +
    `  这些文件不会被发布，请移到 public/files/ 下（可用子目录分类）。\n`
  )
}

let tmp = ''
let worktree = ''

try {
  /* ---------- 1. 取远端最新 gh-pages ---------- */
  console.log(`\n→ 拉取 origin/${BRANCH} …`)
  git(['fetch', 'origin', BRANCH])

  try {
    gitOut(['rev-parse', '--verify', `origin/${BRANCH}`])
  } catch {
    fail(`远端不存在 ${BRANCH} 分支，请先手动创建并推送一个空的 ${BRANCH} 分支，再执行部署。`)
  }

  /* ---------- 2. 建临时 worktree（detached，不碰本地分支） ---------- */
  tmp = mkdtempSync(join(tmpdir(), 'deploy-'))
  worktree = join(tmp, BRANCH)
  console.log('→ 准备临时工作区 …')
  git(['worktree', 'add', '--detach', worktree, `origin/${BRANCH}`])

  /* ---------- 3. 清空旧内容（只清这个临时目录） ---------- */
  for (const name of readdirSync(worktree)) {
    if (name === '.git') continue
    rmSync(join(worktree, name), { recursive: true, force: true })
  }

  /* ---------- 4. 放入新构建产物 ---------- */
  console.log(`→ 复制 ${BUILD_DIR}/ 到 ${BRANCH} …`)
  cpSync(BUILD_DIR, worktree, { recursive: true })

  /* ---------- 5. 提交 ---------- */
  git(['add', '-A'], { cwd: worktree })

  const changed = gitOut(['status', '--porcelain'], { cwd: worktree }).length > 0
  if (!changed) {
    console.log('\n✓ 内容与线上完全一致，无需部署。')
  } else {
    const stamp = new Date().toLocaleString('zh-CN', { hour12: false })
    git(['commit', '-m', `Deploy ${stamp}`], { cwd: worktree })

    /* ---------- 6. 推送 ---------- */
    console.log(`→ 推送到 origin/${BRANCH} …`)
    git(['push', 'origin', `HEAD:${BRANCH}`], { cwd: worktree })

    console.log('\n✅ 部署完成！')
    console.log('   GitHub Pages 通常需要几十秒重新生成，稍后刷新页面即可。')
  }
} finally {
  /* ---------- 7. 清理临时 worktree ---------- */
  if (worktree) {
    try {
      git(['worktree', 'remove', '--force', worktree], { stdio: 'ignore' })
    } catch {
      /* 忽略清理失败，下面再 prune 一次 */
    }
  }
  if (tmp) rmSync(tmp, { recursive: true, force: true })
  try {
    git(['worktree', 'prune'], { stdio: 'ignore' })
  } catch {
    /* 忽略 */
  }
}
