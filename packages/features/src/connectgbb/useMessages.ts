import { useState } from 'react'

export interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  participantRole: string
  lastMessage: string
  lastTimestamp: string
  unread: number
  messages: Message[]
}

const MOCK_CONVOS: Conversation[] = [
  {
    id: 'c1', participantId: 'p2', participantName: 'Coach Williams', participantAvatar: 'CW',
    participantRole: 'College Scout', lastMessage: 'Great film from your last game! Would love to chat.', lastTimestamp: '2026-05-22T14:30:00Z', unread: 2,
    messages: [
      { id: 'm1', senderId: 'p2', senderName: 'Coach Williams', content: 'Hey Ava, I saw your highlights from the tournament. Impressive stuff!', timestamp: '2026-05-21T10:00:00Z', read: true },
      { id: 'm2', senderId: 'p2', senderName: 'Coach Williams', content: 'Great film from your last game! Would love to chat.', timestamp: '2026-05-22T14:30:00Z', read: false },
      { id: 'm3', senderId: 'me', senderName: 'You', content: 'Thank you! I have more film from this season I can share.', timestamp: '2026-05-22T15:00:00Z', read: true },
    ],
  },
  {
    id: 'c2', participantId: 'p3', participantName: 'Taylor Reed', participantAvatar: 'TR',
    participantRole: 'Recruiting Coordinator', lastMessage: 'Confirming your visit for next month.', lastTimestamp: '2026-05-20T09:00:00Z', unread: 0,
    messages: [
      { id: 'm4', senderId: 'p3', senderName: 'Taylor Reed', content: 'Confirming your visit for next month.', timestamp: '2026-05-20T09:00:00Z', read: true },
    ],
  },
]

export function useMessages() {
  const [conversations] = useState(MOCK_CONVOS)
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  const activeConvo = conversations.find(c => c.id === activeConvoId) || null

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConvoId) return
    setNewMessage('')
  }

  return { conversations, activeConvo, activeConvoId, newMessage, setNewMessage, setActiveConvoId, sendMessage }
}
