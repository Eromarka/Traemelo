import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { localCategories } from '../data/localData';

export const useCategories = () => {
    const [categories, setCategories] = useState<any[]>(localCategories);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .order('order', { ascending: true });

                if (error) {
                    throw error;
                }

                if (data && data.length > 0) {
                    setCategories(data);
                }
            } catch (err) {
                console.warn('Usando fallback de categorias locales:', err);
                setCategories(localCategories);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading };
};
