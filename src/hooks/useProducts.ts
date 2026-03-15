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
                // Fetch products that are active
                // We also filter by store status in the client if the join is complex
                const { data, error } = await supabase
                    .from('products')
                    .select('*, stores(status, name)')
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (!data || data.length === 0) {
                    console.log("No real products found, using localProducts as fallback");
                    setProducts(localProducts);
                } else {
                    // Filter to only show products from active stores
                    const activeProducts = data.filter((p: any) => p.stores?.status === 'active');
                    
                    if (activeProducts.length === 0) {
                        setProducts(localProducts);
                    } else {
                        // Map store name for compatibility if needed
                        const mappedProducts = activeProducts.map((p: any) => ({
                            ...p,
                            store_name: p.stores?.business_name || p.stores?.name || 'Negocio'
                        }));
                        setProducts(mappedProducts);
                    }
                }
            } catch (err: any) {
                console.error("Error fetching products:", err);
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
