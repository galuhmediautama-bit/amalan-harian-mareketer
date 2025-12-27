import { supabase } from './supabase';

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  read: boolean;
  created_at: string;
  sender?: {
    email: string;
    name?: string;
  };
}

/**
 * Get messages between current user and partner
 */
export const getMessages = async (partnerUserId: string): Promise<Message[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerUserId}),and(sender_id.eq.${partnerUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error getting messages:', error);
      return [];
    }

    return (data || []) as Message[];
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

/**
 * Send message to partner
 */
export const sendMessage = async (partnerUserId: string, message: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Verify partnership exists
    const { data: partnership } = await supabase
      .from('partnerships')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .or(`user1_id.eq.${partnerUserId},user2_id.eq.${partnerUserId}`)
      .eq('status', 'accepted')
      .maybeSingle();

    if (!partnership) {
      throw new Error('Partnership not found or not accepted');
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: partnerUserId,
        message: message.trim()
      });

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Mark message as read
 */
export const markMessageAsRead = async (messageId: number): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
      .eq('receiver_id', user.id)
      .eq('read', false);

    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

/**
 * Subscribe to messages
 */
export const subscribeToMessages = (
  partnerUserId: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  let subscription: any = null;

  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) {
      callback([]);
      return;
    }

    subscription = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id},receiver_id=eq.${partnerUserId}`
        },
        async () => {
          const messages = await getMessages(partnerUserId);
          callback(messages);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${partnerUserId},receiver_id=eq.${user.id}`
        },
        async () => {
          const messages = await getMessages(partnerUserId);
          callback(messages);
        }
      )
      .subscribe();

    // Initial load
    getMessages(partnerUserId).then(callback);
  });

  return () => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  };
};

