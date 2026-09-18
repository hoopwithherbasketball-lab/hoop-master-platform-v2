// Isolated DOM regressions. No network, credentials, real email or database writes.
const assert = require('node:assert/strict')
const path = require('node:path')
const Module = require('node:module')
const { JSDOM } = require('jsdom')
const { build } = require('esbuild')

async function main() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' })
  for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'Node', 'Event']) {
    Object.defineProperty(global, name, { value: dom.window[name], configurable: true })
  }
  global.IS_REACT_ACT_ENVIRONMENT = true
  const React = require('react')
  const { act } = React
  const { createRoot } = require('react-dom/client')
  const result = await build({
    stdin: { contents: `export { default as Admin } from './apps/web/src/pages/admin/AdminRecruitingOutreachPage'; export { default as Roadmap } from './apps/web/src/pages/public/RecruitingRoadmapPage';`, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'node', format: 'cjs', jsx: 'automatic', packages: 'external',
    plugins: [{ name: 'isolated-recruiting', setup(builder) {
      builder.onResolve({ filter: /^lucide-react$/ }, () => ({ path: require.resolve('lucide-react', { paths: [path.resolve('apps/web')] }), external: true }))
      builder.onResolve({ filter: /DashboardLayout$/ }, () => ({ path: 'layout', namespace: 'test' }))
      builder.onResolve({ filter: /^sonner$/ }, () => ({ path: 'toast', namespace: 'test' }))
      builder.onLoad({ filter: /.*/, namespace: 'test' }, args => ({ contents: args.path === 'layout' ? 'export default function Layout({children}) { return children }' : 'export const toast = {success() {}, error() {}}', loader: 'js' }))
      builder.onResolve({ filter: /^@hoop-master\/features\/recruiting$/ }, () => ({ path: path.resolve('packages/features/src/recruiting/index.ts') }))
    } }],
  })
  const compiled = new Module(path.resolve('tests/recruiting/isolated.cjs'), module)
  compiled.filename = path.resolve('tests/recruiting/isolated.cjs')
  compiled.paths = module.paths
  compiled._compile(result.outputFiles[0].text, compiled.filename)
  const { Admin, Roadmap } = compiled.exports
  const { MemoryRouter } = require('react-router-dom')
  let root
  const text = () => document.body.textContent
  const button = label => [...document.querySelectorAll('button')].find(el => el.textContent.trim() === label)
  const field = label => [...document.querySelectorAll('label')].find(el => el.textContent.trim().startsWith(label))?.querySelector('input,select,textarea')
  async function mount(Component) {
    if (root) await act(async () => root.unmount())
    document.body.innerHTML = '<div id="root"></div>'
    root = createRoot(document.getElementById('root'))
    await act(async () => root.render(React.createElement(MemoryRouter, {}, React.createElement(Component))))
  }
  async function enter(el, value) {
    assert(el, 'Expected form control')
    const prototype = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype
    await act(async () => {
      Object.getOwnPropertyDescriptor(prototype, 'value').set.call(el, value)
      el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
    })
  }
  try {
    await mount(Admin)
    await enter(field('Athlete first name'), 'Real athlete')
    await act(async () => button('Preview sample').click())
    assert.equal(field('Athlete first name').value, 'Maya')
    assert.equal(field('Athlete first name').disabled, true)
    assert.equal(button('Copy draft').disabled, true)
    assert(text().includes('Fictional sample preview'))
    await act(async () => button('Return to draft').click())
    assert.equal(field('Athlete first name').value, 'Real athlete')
    assert.equal(field('Graduation year').value, '', 'Sample must not populate real fields')
    await enter(document.querySelector('input[aria-label]'), 'zz-no-template-matches')
    assert(text().includes('No matching template'))
    assert.equal(button('Copy draft'), undefined, 'Empty search must not retain a hidden selection')
    console.log('PASS: sample isolation, disabled sample copy, real draft preservation and empty filters')

    await mount(Roadmap)
    const check = document.querySelector('input[type=checkbox]')
    await act(async () => check.click())
    assert(text().includes('1 of 11 actions complete'))
    await enter(field('Choose your stage'), 'senior')
    assert(text().includes('0 of 11 actions complete'))
    await enter(field('Choose your stage'), 'foundation')
    assert(text().includes('1 of 11 actions complete'), 'Grade switch retains stage-specific checks')
    await enter(field('Tuition and required fees'), '20000')
    await enter(field('Housing and meals'), '10000')
    await enter(field('Books, travel'), '2500')
    await enter(field('Confirmed athletic aid'), '8000')
    assert(!text().includes('$20,500.00'), 'Unknown gift aid must prevent a total')
    await enter(field('Confirmed academic'), '4000')
    assert(text().includes('$20,500.00'))
    assert.equal(button('Copy reviewed draft').disabled, true)
    await enter(field('Situation'), 'coach-engagement-response')
    await enter(field('Variation'), 'engagement-visit-thank-you')
    for (const label of ['Coach name', 'College program', 'Specific detail', 'Next action', 'Athlete full name']) await enter(field(label), 'Verified test detail')
    assert.equal(button('Copy reviewed draft').disabled, false)
    assert(document.querySelector('textarea[readonly]').value.includes('Thank you for the visit'))
    console.log('PASS: grade state, unknown costs, net price and completed athlete draft controls')
  } finally {
    if (root) await act(async () => root.unmount())
    dom.window.close()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
