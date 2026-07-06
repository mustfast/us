import { execSync } from 'child_process'
import { cpSync, rmSync, mkdtempSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const tmp = mkdtempSync(join(tmpdir(), 'deploy-'))

try {
  // Copy built files to temp
  cpSync('dist', tmp, { recursive: true })

  // Switch to gh-pages
  execSync('git checkout gh-pages', { stdio: 'inherit' })

  // Clean everything except .git
  const files = execSync('git ls-files').toString().trim().split('\n').filter(Boolean)
  if (files.length) {
    execSync('git rm -rf --cached .', { stdio: 'ignore' })
    for (const f of files) {
      try { rmSync(f, { recursive: true, force: true }) } catch {}
    }
  }

  // Copy built files
  cpSync(tmp, '.', { recursive: true })

  // Commit and push
  execSync('git add .', { stdio: 'inherit' })
  execSync('git commit -m "Deploy"', { stdio: 'inherit' })
  execSync('git push origin gh-pages', { stdio: 'inherit' })

  console.log('✅ Deploy done!')

} finally {
  // Always switch back to master
  execSync('git checkout master', { stdio: 'inherit' })
  rmSync(tmp, { recursive: true, force: true })
}
