
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getChatMessages, sendChatMessage } from '@/lib/chatHelpers';
import ChatMessage from '@/components/chat/ChatMessage';

interface ChatRoomComponentProps {
  roomId: string;
}

interface EnhancedChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  sender_name: string;
  sender_avatar: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
    photo_url: string | null;
  };
}

const ChatRoomComponent: React.FC<ChatRoomComponentProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        console.log('Loading messages for room:', roomId);
        const chatMessages = await getChatMessages(roomId);
        console.log('Loaded messages:', chatMessages);
        setMessages(chatMessages as EnhancedChatMessage[]);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: 'Error loading messages',
          description: 'Could not load chat messages. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      loadMessages();
    }
  }, [roomId, toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!roomId) return;

    console.log('Setting up real-time subscription for room:', roomId);

    const channel = supabase
      .channel(`chat-room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          console.log('New message received via realtime:', payload);
          
          try {
            // Fetch the complete message with profile data
            const { data: messageWithProfile, error } = await supabase
              .from('chat_messages')
              .select(`
                *,
                profiles!chat_messages_user_id_fkey (
                  first_name,
                  last_name,
                  photo_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (error) {
              console.error('Error fetching message with profile:', error);
              throw error;
            }

            if (messageWithProfile) {
              const profile = messageWithProfile.profiles as any;
              const enhancedMessage: EnhancedChatMessage = {
                ...messageWithProfile,
                sender_name: profile ? 
                  `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User' : 
                  'Unknown User',
                sender_avatar: profile?.photo_url || null,
                profiles: profile
              };

              console.log('Enhanced message:', enhancedMessage);
              
              setMessages(prev => {
                // Check if message already exists to prevent duplicates
                const messageExists = prev.some(msg => msg.id === enhancedMessage.id);
                if (messageExists) {
                  console.log('Message already exists, skipping duplicate');
                  return prev;
                }
                console.log('Adding new message to state');
                return [...prev, enhancedMessage];
              });
            }
          } catch (error) {
            console.error('Error processing real-time message:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to real-time updates');
          toast({
            title: 'Connection Error',
            description: 'Unable to connect to real-time updates. Messages may not appear immediately.',
            variant: 'destructive',
          });
        }
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [roomId, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user?.id || sending) return;
    
    const messageContent = newMessage.trim();
    console.log('Sending message:', messageContent);
    
    try {
      setSending(true);
      const result = await sendChatMessage(roomId, messageContent);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      console.log('Message sent successfully');
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: 'Your message could not be sent. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm text-muted-foreground">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isCurrentUser={message.user_id === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSendMessage}
        className="border-t bg-background p-4 flex items-center gap-2"
      >
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
          disabled={!user?.id || sending}
        />
        <Button type="submit" disabled={!newMessage.trim() || !user?.id || sending}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatRoomComponent;
