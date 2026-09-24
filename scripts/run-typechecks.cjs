// Check the actual workspace projects: the repository root has no tsconfig.
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const root = path.resolve(__dirname, '..')
let failed = false
for (const group of ['packages', 'services', 'apps']) {
  for (const entry of fs.readdirSync(path.join(root, group), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const cwd = path.join(root, group, entry.name)
    const manifest = path.join(cwd, 'package.json')
    if (!fs.existsSync(manifest)) continue
    const pkg = JSON.parse(fs.readFileSync(manifest, 'utf8'))
    if (!pkg.scripts?.typecheck && !fs.existsSync(path.join(cwd, 'tsconfig.json'))) continue
    console.log(`\nChecking ${pkg.name}`)
    const command = pkg.scripts?.typecheck ? 'npm' : process.execPath
    const args = pkg.scripts?.typecheck
      ? ['run', 'typecheck', '--silent']
      : [require.resolve('typescript/bin/tsc', { paths: [cwd] }), '--noEmit']
    const result = spawnSync(command, args, { cwd, stdio: 'inherit' })
    if (result.error) console.error(result.error.message)
    if (result.status !== 0) failed = true
  }
}
process.exitCode = failed ? 1 : 0
