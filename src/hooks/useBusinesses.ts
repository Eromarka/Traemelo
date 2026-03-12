import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { localRestaurants } from '../data/localData';

export const useBusinesses = () => {
    const [businesses, setBusinesses] = useState<any[]>(localRestaurants);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const { data, error } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                if (data && data.length > 0) {
                    setBusinesses(data);
                } else if (!error) {
                    // Si no hay error pero la data está vacía, mostrar vacío (no el fallback local)
                    setBusinesses([]);
                }
            } catch (err) {
                console.warn('Usando fallback de negocios locales por error:', err);
                setBusinesses(localRestaurants);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, []);

    return { businesses, loading };
};
