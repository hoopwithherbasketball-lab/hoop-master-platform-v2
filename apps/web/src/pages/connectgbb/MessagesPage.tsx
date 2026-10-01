import { useMessages } from '@hoop-master/features/connectgbb'
import { useCommunityMembership } from '@hoop-master/features/connectgbb'
import { PageShell } from '@hoop-master/ui'
import { Send } from 'lucide-react'
import { useAuth } from '../../lib/auth'

export default function MessagesPage() {
  const { user } = useAuth()
  const { canAccessCommunity } = useCommunityMembership()
  const { conversations, activeConvo, activeConvoId, newMessage, setNewMessage, setActiveConvoId, sendMessage, loading, error } = useMessages()

  if (!canAccessCommunity) {
    return (
      <PageShell title="Messages" description="Secure messaging is available to active members only." badge="ConnectGBB">
        <div className="max-w-2xl mx-auto bg-navy-800 border border-white/10 rounded-xl p-8 text-center" data-testid="messages-locked-state">
          <h2 className="text-2xl font-semibold text-white mb-3">Messaging Locked</h2>
          <p className="text-slate-400">Activate your membership to access premium in-network messaging.</p>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title="Messages" description="In-app messaging with coaches, scouts, and programs." badge="ConnectGBB">
      {error && <p className="text-red-300 mb-4" data-testid="messages-error-text">{error}</p>}
      <div className="flex flex-col lg:flex-row h-auto lg:h-[600px] bg-navy-800 rounded-xl shadow-md overflow-hidden">
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col max-h-[320px] lg:max-h-none">
          <div className="p-3 border-b border-white/10 bg-white/5"><h3 className="font-semibold text-white text-sm">Conversations</h3></div>
          <div className="flex-1 overflow-y-auto">
            {loading && <p className="p-4 text-xs text-slate-400">Loading conversations…</p>}
            {conversations.map(c => (
              <button key={c.id} data-testid={`messages-conversation-button-${c.id}`} onClick={() => setActiveConvoId(c.id)} className={`w-full text-left p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${activeConvoId === c.id ? 'bg-blue-500/10' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#0134BD] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{c.participantAvatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white text-sm truncate">{c.participantName}</p>
                      <p className="text-xs text-gray-400">{c.lastTimestamp.slice(5, 10)}</p>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && <span className="w-5 h-5 bg-[#FB6C1D] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">{c.unread}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-[420px]">
          {activeConvo ? (
            <>
              <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#0134BD] rounded-full flex items-center justify-center text-white text-xs font-bold">{activeConvo.participantAvatar}</div>
                <div><p className="font-semibold text-white text-sm">{activeConvo.participantName}</p><p className="text-xs text-gray-400">{activeConvo.participantRole}</p></div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConvo.messages.map(m => {
                  const isMe = m.senderId === user?.id
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-xl ${isMe ? 'bg-[#0134BD] text-white' : 'bg-white/10 text-gray-200'}`}>
                        <p className="text-sm">{m.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>{m.timestamp.slice(11, 16)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="p-3 sm:p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <input data-testid="messages-input" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 p-3 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#0134BD] text-sm" />
                  <button data-testid="messages-send-button" onClick={sendMessage} className="w-10 h-10 bg-[#0134BD] text-white rounded-xl flex items-center justify-center hover:bg-[#002a80]"><Send size={16} /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400"><p>Select a conversation</p></div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
