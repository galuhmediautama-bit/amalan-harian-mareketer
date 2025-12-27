import { supabase } from './supabase';
import { AppState } from '../types';

export interface Partnership {
  id: number;
  user1_id: string;
  user2_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  invited_by: string;
  created_at: string;
  updated_at: string;
  partner?: {
    id: string;
    email: string;
    name?: string;
  };
}

/**
 * Get current user's partnership
 */
export const getMyPartnership = async (): Promise<Partnership | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq('status', 'accepted')
      .maybeSingle();

    if (error) {
      console.error('Error getting partnership:', error);
      return null;
    }

    if (!data) return null;

    // Get partner info
    const partnerId = data.user1_id === user.id ? data.user2_id : data.user1_id;
    const { data: partnerData } = await supabase.auth.admin.getUserById(partnerId).catch(() => ({ data: { user: null } }));
    
    // Alternative: Get from auth.users via RPC or public profile
    // For now, we'll use email from metadata if available
    const partnership: Partnership = {
      ...data,
      partner: {
        id: partnerId,
        email: '', // Will be populated if we have access
        name: ''
      }
    };

    return partnership;
  } catch (error) {
    console.error('Error getting partnership:', error);
    return null;
  }
};

/**
 * Get pending invitations (sent or received)
 */
export const getPendingInvitations = async (): Promise<{ sent: Partnership[]; received: Partnership[] }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { sent: [], received: [] };

    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq('status', 'pending');

    if (error) {
      console.error('Error getting invitations:', error);
      return { sent: [], received: [] };
    }

    const sent = (data || []).filter(p => p.invited_by === user.id);
    const received = (data || []).filter(p => p.invited_by !== user.id);

    return { sent, received };
  } catch (error) {
    console.error('Error getting invitations:', error);
    return { sent: [], received: [] };
  }
};

/**
 * Invite partner by email
 */
export const invitePartner = async (email: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Find user by email (this requires a public profiles table or RPC function)
    // For now, we'll create a pending partnership with email stored
    // In production, you'd want to look up the user_id from email
    
    // Note: This is a simplified version. In production, you'd need:
    // 1. A public profiles table with email
    // 2. Or an RPC function to find user by email
    // 3. Or send invitation via email with a link
    
    throw new Error('Partner invitation by email requires additional setup. Please use partner user ID directly for now.');
  } catch (error) {
    console.error('Error inviting partner:', error);
    throw error;
  }
};

/**
 * Invite partner by user ID (for testing/direct connection)
 */
export const invitePartnerById = async (partnerUserId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (user.id === partnerUserId) {
      throw new Error('Cannot invite yourself');
    }

    // Check if partnership already exists
    const { data: existing } = await supabase
      .from('partnerships')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .or(`user1_id.eq.${partnerUserId},user2_id.eq.${partnerUserId}`)
      .maybeSingle();

    if (existing) {
      throw new Error('Partnership already exists or is pending');
    }

    // Create partnership (always use smaller user_id as user1_id for consistency)
    const user1Id = user.id < partnerUserId ? user.id : partnerUserId;
    const user2Id = user.id < partnerUserId ? partnerUserId : user.id;

    const { error } = await supabase
      .from('partnerships')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        status: 'pending',
        invited_by: user.id
      });

    if (error) {
      console.error('Error creating partnership:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error inviting partner:', error);
    throw error;
  }
};

/**
 * Accept partnership invitation
 */
export const acceptPartnership = async (partnershipId: number): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('partnerships')
      .update({ status: 'accepted' })
      .eq('id', partnershipId)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq('status', 'pending');

    if (error) {
      console.error('Error accepting partnership:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error accepting partnership:', error);
    throw error;
  }
};

/**
 * Reject partnership invitation
 */
export const rejectPartnership = async (partnershipId: number): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('partnerships')
      .update({ status: 'rejected' })
      .eq('id', partnershipId)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq('status', 'pending');

    if (error) {
      console.error('Error rejecting partnership:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error rejecting partnership:', error);
    throw error;
  }
};

/**
 * Get partner's progress data
 */
export const getPartnerProgress = async (partnerUserId: string): Promise<AppState | null> => {
  try {
    // First verify partnership exists and is accepted
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: partnership } = await supabase
      .from('partnerships')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .or(`user1_id.eq.${partnerUserId},user2_id.eq.${partnerUserId}`)
      .eq('status', 'accepted')
      .maybeSingle();

    if (!partnership) return null;

    // Try using RPC function first, fallback to direct query if RPC doesn't exist
    let result: any = null;
    
    try {
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_partner_progress', { partner_user_id: partnerUserId });
      
      if (!rpcError && rpcData && rpcData.length > 0) {
        result = rpcData[0];
      }
    } catch (rpcErr) {
      // RPC function might not exist yet, try direct query
      console.log('RPC function not available, trying direct query');
    }

    // Fallback: Direct query (requires RLS policy to allow viewing partner's data)
    if (!result) {
      const { data, error } = await supabase
        .from('user_progress')
        .select('current_date_value, progress')
        .eq('user_id', partnerUserId)
        .maybeSingle();

      if (error || !data) return null;
      result = data;
    }

    return {
      currentDate: result.current_date_value || new Date().toISOString().split('T')[0],
      progress: (result.progress as Record<string, any>) || {}
    };
  } catch (error) {
    console.error('Error getting partner progress:', error);
    return null;
  }
};

/**
 * Subscribe to partnership changes
 */
export const subscribeToPartnership = (
  callback: (partnership: Partnership | null) => void
): (() => void) => {
  let subscription: any = null;

  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) {
      callback(null);
      return;
    }

    subscription = supabase
      .channel('partnership_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partnerships',
          filter: `user1_id=eq.${user.id}`
        },
        async () => {
          const partnership = await getMyPartnership();
          callback(partnership);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partnerships',
          filter: `user2_id=eq.${user.id}`
        },
        async () => {
          const partnership = await getMyPartnership();
          callback(partnership);
        }
      )
      .subscribe();

    // Initial load
    getMyPartnership().then(callback);
  });

  return () => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  };
};

