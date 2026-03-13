import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Store {
    id: string;
    business_name: string;
    image_url: string;
    address: string;
    description: string;
    status: string;
    category_id: string;
}

export const useStores = (categoryId?: string) => {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            let query = supabase
                .from('stores')
                .select('*')
                .eq('status', 'active');
            
            if (categoryId) {
                query = query.eq('category_id', categoryId);
            }

            const { data, error } = await query;
            if (!error && data) {
                setStores(data);
            }
            setLoading(false);
        };

        fetchStores();
    }, [categoryId]);

    return { stores, loading };
};
