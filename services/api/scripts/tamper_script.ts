import fetch from 'node-fetch'

const WEBHOOK_ENDPOINT = 'http://localhost:3001/api/payments/webhook'

async function runTamperTest() {
  console.log('🚀 Starting Tamper Security Test...')
  console.log(`🎯 Target: ${WEBHOOK_ENDPOINT}`)

  const payload = {
    id: 'evt_tamper_123',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_tamper_abc'
      }
    }
  }

  const payloadString = JSON.stringify(payload)

  console.log('\n[Test 1] Missing Signature Header')
  const res1 = await fetch(WEBHOOK_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payloadString
  })
  
  if (res1.status === 400) {
    console.log('✅ PASS: Rejected missing signature (400 Bad Request)')
  } else {
    console.log(`⚠️ FAIL: Expected 400, got ${res1.status}`)
  }

  console.log('\n[Test 2] Invalid/Forged Signature Header')
  const res2 = await fetch(WEBHOOK_ENDPOINT, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'stripe-signature': 't=12345,v1=forged_signature_hash_here'
    },
    body: payloadString
  })

  if (res2.status === 400) {
    console.log('✅ PASS: Rejected invalid signature (400 Bad Request)')
  } else {
    console.log(`⚠️ FAIL: Expected 400, got ${res2.status}`)
  }
}

runTamperTest()
