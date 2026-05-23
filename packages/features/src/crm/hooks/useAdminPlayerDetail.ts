import { useState } from 'react'

export interface AdminPlayerDetail {
  id: string
  name: string
  email: string
  position: string
  gradClass: string
  school: string
  city: string
  state: string
  height: string
  gpa: string
  package: string
  status: 'active' | 'inactive' | 'suspended'
  joined: string
  evalCount: number
  connectionCount: number
  lastActive: string
}

const MOCK: AdminPlayerDetail = {
  id: '1', name: 'Ava Grant', email: 'ava.grant@email.com', position: 'SG', gradClass: '2026',
  school: 'Sierra Canyon', city: 'Chatsworth', state: 'CA', height: "5'11\"", gpa: '3.8',
  package: 'Elite Track', status: 'active', joined: '2026-01-15',
  evalCount: 3, connectionCount: 28, lastActive: '2026-05-22',
}

export function useAdminPlayerDetail(id: string) {
  const [detail] = useState(MOCK)
  return { detail: { ...detail, id }, loading: false }
}
