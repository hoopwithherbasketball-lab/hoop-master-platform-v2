import fetch from 'node-fetch'

const SIMULATE_ENDPOINT = 'http://localhost:3001/api/payments/simulate-payment'

async function runBlast() {
  console.log('🚀 Starting Concurrent Blast Test...')
  console.log(`🎯 Target: ${SIMULATE_ENDPOINT}`)

  // Create a single, deterministic mock webhook payload
  const mockSessionId = 'cs_test_blast_' + Date.now()
  const mockEventId = 'evt_test_blast_' + Date.now()
  
  const payload = {
    id: mockEventId,
    type: 'checkout.session.completed',
    data: {
      object: {
        id: mockSessionId
      }
    }
  }

  const payloadString = JSON.stringify(payload)
  const CONCURRENT_REQUESTS = 50

  console.log(`💥 Firing ${CONCURRENT_REQUESTS} identical requests simultaneously...`)
  const startTime = Date.now()

  // Fire requests simultaneously using Promise.all
  const promises = Array.from({ length: CONCURRENT_REQUESTS }).map((_, i) => {
    return fetch(SIMULATE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payloadString
    }).then(res => res.json().then(data => ({ status: res.status, data, index: i })))
      .catch(err => ({ status: 500, error: err.message, index: i }))
  })

  const results = await Promise.all(promises)
  const endTime = Date.now()

  console.log(`⏱️  Completed in ${endTime - startTime}ms`)

  // Analyze Results
  let successes = 0
  let duplicates = 0
  let errors = 0

  results.forEach(res => {
    if (res.data?.note === 'duplicate_caught') {
      duplicates++
    } else if (res.data?.success) {
      successes++
    } else {
      errors++
      console.error(`Error on request ${res.index}:`, res)
    }
  })

  console.log('\n📊 RESULTS:')
  console.log(`✅ Successes (Atomic Fulfillments): ${successes}`)
  console.log(`🛡️  Duplicates Caught (Ignored):     ${duplicates}`)
  console.log(`❌ Errors:                           ${errors}`)

  if (successes === 1 && duplicates === 49) {
    console.log('\n🏆 PASS: Idempotency locks held perfectly against extreme concurrency!')
  } else {
    console.log('\n⚠️  FAIL: Race conditions or failures detected.')
  }
}

runBlast()
