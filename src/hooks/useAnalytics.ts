import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export const useAnalytics = () => {
    const { user } = useAuth();

    const trackAction = useCallback(async (storeName: string, actionType: 'whatsapp' | 'call' | 'view') => {
        try {
            const { error } = await supabase.from('leads').insert({
                store_name: storeName,
                action_type: actionType,
                user_id: user?.id || null, // null if anonymous
            });

            if (error) {
                console.error('Error tracking analytics:', error);
            }
        } catch (err) {
            console.error('Failed to track action:', err);
        }
    }, [user]);

    return { trackAction };
};
