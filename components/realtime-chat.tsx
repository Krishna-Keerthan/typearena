'use client'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from '@/components/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ChatRoom from './ChatRoom'

interface RealtimeChatProps {
  roomName: string
  username: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
    participants
  } = useRealtimeChat({
    roomName,
    username,
  })
  const [newMessage, setNewMessage] = useState('')

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    return uniqueMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) onMessage(allMessages)
  }, [allMessages, onMessage])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected) return
      sendMessage(newMessage)
      setNewMessage('')
    },
    [newMessage, isConnected, sendMessage]
    
  )

console.log(isConnected)

  return (
    <div className="flex h-full gap-4">
      {/* Chat Section */}
      <div className="flex flex-col flex-1 h-[400px] bg-card p-6 rounded-lg text-foreground antialiased">
  {/* Messages area (scrollable) */}
  <div ref={containerRef} className="flex-1 overflow-y-scroll p-4 space-y-4">
    {allMessages.length === 0 ? (
      <div className="text-center text-sm text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    ) : (
      <div className="space-y-1">
        {allMessages.map((message, index) => {
          const prevMessage = index > 0 ? allMessages[index - 1] : null
          const showHeader =
            !prevMessage || prevMessage.user.name !== message.user.name

          return (
            <div
              key={message.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              <ChatMessageItem
                message={message}
                isOwnMessage={message.user.name === username}
                showHeader={showHeader}
              />
            </div>
          )
        })}
      </div>
    )}
  </div>

  {/* Input (fixed at bottom) */}
  <form
    onSubmit={handleSendMessage}
    className="flex w-full gap-2 border-t border-border p-4"
  >
    <Input
      className={cn(
        'rounded-full bg-background text-sm transition-all duration-300',
        isConnected && newMessage.trim()
          ? 'w-[calc(100%-36px)]'
          : 'w-full'
      )}
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type a message..."
      disabled={!isConnected}
    />
    {isConnected && newMessage.trim() && (
      <Button
        className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
        type="submit"
        disabled={!isConnected}
      >
        <Send className="size-4" />
      </Button>
    )}
  </form>
</div>

      {/* Participants Section */}
      <div className="w-[500px] bg-card p-4 rounded-lg border border-border">
        <ChatRoom roomName={roomName} username={username} participants={participants} />
      </div>
    </div>
  )
}
