import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { localProducts } from '../data/localData';
import type { Product } from '../data/localData';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, stores!inner(status)')
                    .eq('stores.status', 'active')
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                if (error || !data || data.length === 0) {
                    console.log("Supabase falló o está vacío, usando localProducts");
                    setProducts(localProducts);
                } else {
                    setProducts(data);
                }
            } catch (err: any) {
                console.error("Error fetching products, usando localProducts fallback:", err);
                setError(err.message || 'Error fetching products');
                setProducts(localProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};
