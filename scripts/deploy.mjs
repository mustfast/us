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

  // Remove all tracked files, then clean untracked (incl. node_modules) except .git
  execSync('git rm -rf .', { stdio: 'ignore' })
  execSync('git clean -fdx -e .git', { stdio: 'inherit' })

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
