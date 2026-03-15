import { createClient } from '@supabase/supabase-client';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPending() {
    console.log("Checking pending products...");
    const { data, error } = await supabase
        .from('products')
        .select('id, name, status, store_id')
        .eq('status', 'pending');
    
    if (error) {
        console.error("Error fetching pending products:", error);
    } else {
        console.log("Found pending products:", data?.length || 0);
        console.log(JSON.stringify(data, null, 2));
    }

    console.log("\nChecking stores...");
    const { data: stores, error: storeErr } = await supabase
        .from('stores')
        .select('id, name, status');
    
    if (storeErr) {
        console.error("Error fetching stores:", storeErr);
    } else {
        console.log("Found stores:", stores?.length || 0);
        console.log(JSON.stringify(stores, null, 2));
    }
}

checkPending();
