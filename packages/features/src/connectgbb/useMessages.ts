import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { Conversation, Message } from './types'

export function useMessages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }

    const fetch = async () => {
      try {
        setLoading(true)
        const { data: convos } = await supabase
          .from('conversations')
          .select('*')
          .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
          .order('last_timestamp', { ascending: false })

        const otherIds = [...new Set((convos ?? []).map(c => c.participant_one === user.id ? c.participant_two : c.participant_one))]
        const nameMap: Record<string, { name: string; role: string }> = {}
        if (otherIds.length > 0) {
          const { data: profiles } = await supabase
            .from('member_profiles')
            .select('user_id, display_name, role')
            .in('user_id', otherIds)
          for (const p of profiles ?? []) nameMap[p.user_id] = { name: p.display_name, role: p.role }
        }

        const convoIds = (convos ?? []).map(c => c.id)
        const messagesMap: Record<string, Message[]> = {}
        if (convoIds.length > 0) {
          const { data: msgs } = await supabase
            .from('messages')
            .select('*')
            .in('conversation_id', convoIds)
            .order('created_at', { ascending: true })
          for (const m of msgs ?? []) {
            if (!messagesMap[m.conversation_id]) messagesMap[m.conversation_id] = []
            const convo = (convos ?? []).find(c => c.id === m.conversation_id)
            const otherId = convo ? (convo.participant_one === user.id ? convo.participant_two : convo.participant_one) : ''
            const info = nameMap[otherId] || { name: 'Unknown', role: 'player' }
            messagesMap[m.conversation_id].push({
              id: m.id,
              senderId: m.sender_id,
              senderName: m.sender_id === user.id ? 'You' : info.name,
              content: m.content,
              timestamp: m.created_at,
              read: m.read,
            })
          }
        }

        const mapped: Conversation[] = (convos ?? []).map(c => {
          const otherId = c.participant_one === user.id ? c.participant_two : c.participant_one
          const info = nameMap[otherId] || { name: 'Unknown', role: 'player' }
          const unread = c.participant_one === user.id ? c.participant_one_unread : c.participant_two_unread
          return {
            id: c.id,
            participantId: otherId,
            participantName: info.name,
            participantAvatar: info.name[0]?.toUpperCase() || '?',
            participantRole: info.role,
            lastMessage: c.last_message,
            lastTimestamp: c.last_timestamp,
            unread,
            messages: messagesMap[c.id] ?? [],
          }
        })
        setConversations(mapped)
      } catch (e) { console.error('useMessages:', e) }
      setLoading(false)
    }
    fetch()
  }, [user])

  const activeConvo = conversations.find(c => c.id === activeConvoId) || null

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConvoId || !user) return
    const content = newMessage.trim()
    try {
      const { data: msgData } = await supabase.from('messages').insert({
        conversation_id: activeConvoId,
        sender_id: user.id,
        content,
      }).select().single()

      const convo = conversations.find(c => c.id === activeConvoId)
      const otherParticipant = convo
        ? (convo.participantId)
        : null
      const otherUnreadField = convo
        ? (convo.participantId === convo.participantId ? 'participant_two_unread' : 'participant_one_unread')
        : 'participant_two_unread'

      await supabase.from('conversations').update({
        last_message: content,
        last_timestamp: new Date().toISOString(),
        [otherUnreadField]: supabase.rpc('increment', { x: 1 }),
      }).eq('id', activeConvoId)

      if (msgData) {
        setNewMessage('')
        setConversations(prev => prev.map(c => {
          if (c.id !== activeConvoId) return c
          const newMsg: Message = {
            id: msgData.id,
            senderId: msgData.sender_id,
            senderName: 'You',
            content: msgData.content,
            timestamp: msgData.created_at,
            read: true,
          }
          return { ...c, lastMessage: content, lastTimestamp: new Date().toISOString(), messages: [...c.messages, newMsg] }
        }))
      }
    } catch (e) { console.error('sendMessage:', e) }
  }, [newMessage, activeConvoId, user, conversations])

  return { conversations, activeConvo, activeConvoId, newMessage, setNewMessage, setActiveConvoId, sendMessage, loading }
}
