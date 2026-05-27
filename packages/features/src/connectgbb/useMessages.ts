import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { Conversation, Message } from './types'

export function useMessages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      try {
        const { data: convos } = await supabase
          .from('conversations')
          .select('*')
          .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
          .order('last_timestamp', { ascending: false })

        const otherIds = [...new Set((convos ?? []).map(c => c.participant_one === user.id ? c.participant_two : c.participant_one))]
        let nameMap: Record<string, { name: string; role: string }> = {}
        if (otherIds.length > 0) {
          const { data: profiles } = await supabase
            .from('member_profiles')
            .select('user_id, display_name, role')
            .in('user_id', otherIds)
          for (const p of profiles ?? []) nameMap[p.user_id] = { name: p.display_name, role: p.role }
        }

        const mapped: Conversation[] = await Promise.all((convos ?? []).map(async c => {
          const otherId = c.participant_one === user.id ? c.participant_two : c.participant_one
          const info = nameMap[otherId] || { name: 'Unknown', role: 'player' }
          const unread = c.participant_one === user.id ? c.participant_one_unread : c.participant_two_unread

          const { data: msgs } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', c.id)
            .order('created_at', { ascending: true })

          return {
            id: c.id,
            participantId: otherId,
            participantName: info.name,
            participantAvatar: info.name[0]?.toUpperCase() || '?',
            participantRole: info.role,
            lastMessage: c.last_message,
            lastTimestamp: c.last_timestamp,
            unread,
            messages: (msgs ?? []).map(m => ({
              id: m.id,
              senderId: m.sender_id,
              senderName: m.sender_id === user.id ? 'You' : info.name,
              content: m.content,
              timestamp: m.created_at,
              read: m.read,
            })),
          }
        }))
        setConversations(mapped)
      } catch (e) { console.error('useMessages:', e) }
    }
    fetch()
  }, [user])

  const activeConvo = conversations.find(c => c.id === activeConvoId) || null

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConvoId || !user) return
    const content = newMessage.trim()
    setNewMessage('')
    try {
      await supabase.from('messages').insert({
        conversation_id: activeConvoId,
        sender_id: user.id,
        content,
      })
      await supabase.from('conversations').update({
        last_message: content,
        last_timestamp: new Date().toISOString(),
      }).eq('id', activeConvoId)
      setConversations(prev => prev.map(c => {
        if (c.id !== activeConvoId) return c
        const newMsg: Message = { id: Date.now().toString(), senderId: 'me', senderName: 'You', content, timestamp: new Date().toISOString(), read: true }
        return { ...c, lastMessage: content, lastTimestamp: new Date().toISOString(), messages: [...c.messages, newMsg] }
      }))
    } catch (e) { console.error('sendMessage:', e) }
  }, [newMessage, activeConvoId, user])

  return { conversations, activeConvo, activeConvoId, newMessage, setNewMessage, setActiveConvoId, sendMessage }
}
