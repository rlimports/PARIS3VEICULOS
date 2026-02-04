
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ccscbairmjdoatubgjbf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2NiYWlybWpkb2F0dWJnamJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTAxMjUsImV4cCI6MjA4NDMyNjEyNX0.lgLZFOfAgUE9IvhIT7BDtBTQAMRqpIwTGJ7UuSvAuJs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
    global: {
        headers: {
            'x-my-custom-header': 'paris3-veiculos',
        },
    },
    db: {
        schema: 'public',
    },
});

// Função para testar conexão
export const testConnection = async (): Promise<boolean> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const { error } = await supabase
            .from('vehicles')
            .select('id')
            .limit(1)
            .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (error) {
            console.error('Supabase connection error:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Supabase connection failed:', err);
        return false;
    }
};
