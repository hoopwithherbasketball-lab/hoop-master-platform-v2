// Run: node tests/nil/nil-hub.test.cjs
// Isolated component tests: fake Supabase responses, no credentials or network writes.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { JSDOM } = require('jsdom')
const { build } = require('esbuild')

async function main() {
  const dom = new JSDOM(
    '<!doctype html><html><body><div id="root"></div></body></html>',
    { url: 'http://localhost', pretendToBeVisual: true }
  )
  for (const name of [
    'window',
    'document',
    'navigator',
    'HTMLElement',
    'HTMLInputElement',
    'HTMLTextAreaElement',
    'HTMLSelectElement',
    'HTMLButtonElement',
    'Node',
    'NodeFilter',
    'Event',
    'CustomEvent',
    'MutationObserver',
    'getComputedStyle',
  ])
    global[name] =
      name === 'getComputedStyle'
        ? dom.window.getComputedStyle.bind(dom.window)
        : dom.window[name]
  global.requestAnimationFrame = dom.window.requestAnimationFrame.bind(
    dom.window
  )
  global.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
  global.IS_REACT_ACT_ENVIRONMENT = true
  const React = require('react')
  const { act } = React
  const { createRoot } = require('react-dom/client')
  const bundle = path.resolve('tests/nil/.harness.cjs')
  const calls = []
  let failBrands = true,
    failSave = false,
    failOverview = false
  let saved = []
  global.__nilTestQuery = (table) => {
    assert.notEqual(table, 'crm_partners', 'NIL must not query CRM partners')
    assert.notEqual(
      table,
      'sponsorship_inventory',
      'NIL must not require inventory'
    )
    let method = 'read',
      payload,
      filters = [],
      single = false,
      head = false
    const query = {
      select(_columns, options) {
        head = !!options?.head
        return this
      },
      eq(key, value) {
        filters.push([key, value])
        return this
      },
      in() {
        return this
      },
      order() {
        return this
      },
      range() {
        return this
      },
      limit() {
        return this
      },
      insert(value) {
        method = 'insert'
        payload = value
        return this
      },
      update(value) {
        method = 'update'
        payload = value
        return this
      },
      delete() {
        method = 'delete'
        return this
      },
      single() {
        single = true
        return this
      },
      then(resolve, reject) {
        calls.push({ table, method, payload, filters })
        if (
          (table === 'nil_companies' && failBrands) ||
          (method !== 'read' && failSave) ||
          failOverview
        )
          return Promise.resolve({
            data: null,
            error: { message: 'Test failure' },
          }).then(resolve, reject)
        if (table === 'proposals' && method !== 'read') {
          assert.equal('partner_id' in payload, false)
          assert.equal(payload.package_details.company_id, null)
          assert.equal(payload.package_details.source, 'nil-hub')
          assert.equal(payload.status, 'Draft')
          saved.push({
            id: 'nil-proposal-1',
            ...payload,
            created_at: '2026-09-10',
          })
          return Promise.resolve({
            data: { id: 'nil-proposal-1' },
            error: null,
          }).then(resolve, reject)
        }
        let data =
          table === 'proposals'
            ? saved
            : table === 'nil_opportunities'
              ? [
                  {
                    id: 'opportunity-1',
                    brand: 'Test brand',
                    athlete_name: 'Test athlete',
                    value_cents: 125050,
                    status: 'matched',
                  },
                ]
              : []
        return Promise.resolve({
          data: head ? null : single ? data[0] : data,
          error: null,
          count: data.length,
        }).then(resolve, reject)
      },
    }
    return query
  }
  await build({
    entryPoints: ['tests/nil/harness.tsx'],
    outfile: bundle,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    jsx: 'automatic',
    packages: 'external',
    plugins: [
      {
        name: 'isolated-test-data',
        setup(b) {
          b.onResolve({ filter: /^@hoop-master\/supabase$/ }, () => ({
            path: 'test-client',
            namespace: 'test',
          }))
          b.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
            contents:
              'export const supabase = { from: (table) => globalThis.__nilTestQuery(table) }',
            loader: 'js',
          }))
          b.onResolve({ filter: /^@hoop-master\/features\/nil$/ }, () => ({
            path: path.resolve('packages/features/src/nil/index.ts'),
          }))
        },
      },
    ],
  })
  const {
    ProposalHarness,
    OverviewHarness,
    OpportunityHarness,
    GuardHarness,
  } = require(bundle)
  let root
  async function mount(Component, props = {}) {
    if (root) await act(async () => root.unmount())
    document.body.innerHTML = '<div id="root"></div>'
    root = createRoot(document.getElementById('root'))
    await act(async () => root.render(React.createElement(Component, props)))
  }
  const text = () => document.body.textContent
  async function input(id, value) {
    const el = document.getElementById(id)
    assert(el, `Expected input ${id}`)
    const prototype =
      el.tagName === 'TEXTAREA'
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype
    await act(async () => {
      Object.getOwnPropertyDescriptor(prototype, 'value').set.call(el, value)
      el.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }
  async function click(label) {
    const button = [...document.querySelectorAll('button')].find(
      (el) => el.textContent.trim() === label
    )
    assert(button, `Expected button ${label}`)
    await act(async () => button.click())
  }
  let closed = false
  try {
    await mount(ProposalHarness, {
      onClose: () => {
        closed = true
      },
    })
    assert(text().includes('You can still enter a recipient'))
    await input('nil-title', 'Independent NIL proposal')
    await input('nil-recipient', 'Local business')
    await input('nil-amount', '1250.50')
    await input('nil-deliverables', 'Two appearances and one athlete feature.')
    assert(
      text().includes('$1,250.50'),
      'Live preview must reflect entered value'
    )
    failSave = true
    await click('Save draft')
    assert(
      !closed && saved.length === 0,
      'A failed save must preserve the draft'
    )
    assert(text().includes('Your proposal was not saved'))
    assert.equal(
      document.getElementById('nil-title').value,
      'Independent NIL proposal'
    )
    failSave = false
    await click('Save draft')
    assert(closed && saved.length === 1, 'Retry should save and close')
    assert.equal(saved[0].package_details.amount, 1250.5)
    assert(
      calls.some(
        (c) =>
          c.table === 'proposals' &&
          c.filters.some(
            ([k, v]) => k === 'package_details->>source' && v === 'nil-hub'
          )
      )
    )
    console.log(
      'PASS: proposal creation without CRM or brand availability, exact amount, failure recovery, source scoping'
    )

    failBrands = false
    await mount(OpportunityHarness)
    await click('Edit opportunity')
    assert.equal(
      document.getElementById('opp-value').value,
      '1250.5',
      'Editing must retain stored value'
    )
    console.log('PASS: opportunity editing preserves existing cents')

    failOverview = true
    await mount(OverviewHarness)
    assert(
      text().includes('could not be loaded'),
      'Dashboard failure must not show false zero metrics'
    )
    failOverview = false
    await click('Retry')
    assert(text().includes('Test brand'), 'Retry must reload actual records')
    assert(!text().includes('Partner Portal Integration'))
    console.log('PASS: overview error recovery and independent navigation')

    for (const props of [
      { authenticated: false, admin: false },
      { authenticated: true, admin: false },
    ]) {
      await mount(GuardHarness, props)
      assert(!text().includes('Authorized NIL content'))
    }
    await mount(GuardHarness, { authenticated: true, admin: true })
    assert(text().includes('Authorized NIL content'))
    console.log('PASS: existing authentication and admin guard behavior')
  } finally {
    if (root) await act(async () => root.unmount())
    fs.unlinkSync(bundle)
    dom.window.close()
  }
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
