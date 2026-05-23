import { useState } from 'react'

export interface Lead {
  id: string
  name: string
  email: string
  interest: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  date: string
  notes: string
}

const MOCK: Lead[] = [
  { id: '1', name: 'Madeline Harris', email: 'mharris@email.com', interest: 'Recruiting Plan', source: 'Website', status: 'new', date: '2026-05-20', notes: 'Looking for full recruiting package.' },
  { id: '2', name: 'Camila Ortiz', email: 'cortiz@email.com', interest: 'NIL Coaching', source: 'Referral', status: 'contacted', date: '2026-05-18', notes: 'Referred by Coach Williams.' },
  { id: '3', name: 'Alyssa Nguyen', email: 'anguyen@email.com', interest: 'Performance Audit', source: 'Social Media', status: 'qualified', date: '2026-05-15', notes: 'High-potential 2027 guard.' },
  { id: '4', name: 'Brianna Foster', email: 'bfoster@email.com', interest: 'Elite Track Package', source: 'Event', status: 'new', date: '2026-05-22', notes: 'Met at Adidas showcase.' },
  { id: '5', name: 'Chloe Washington', email: 'cwashington@email.com', interest: 'Highlight Reel', source: 'Website', status: 'converted', date: '2026-05-10', notes: 'Signed up for starter package.' },
]

const STATUS_ORDER: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'lost']

export function useAdminLeads() {
  const [leads] = useState(MOCK)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = leads.filter(l => {
    if (statusFilter && l.status !== statusFilter) return false
    if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase()) && !l.email.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return { leads: filtered, allLeads: leads, statusFilter, setStatusFilter, searchQuery, setSearchQuery, statuses: STATUS_ORDER }
}
