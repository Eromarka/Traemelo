import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface UploadState {
    uploading: boolean;
    progress: number; // 0-100
    error: string | null;
}

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const BUCKET_NAME = 'products';

export const useProductImage = (userId?: string) => {
    const [state, setState] = useState<UploadState>({
        uploading: false,
        progress: 0,
        error: null,
    });

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Formato inválido. Usa JPG, PNG, WEBP o HEIC.';
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return `El archivo es demasiado grande. Máximo ${MAX_SIZE_MB}MB.`;
        }
        return null;
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        const validationError = validateFile(file);
        if (validationError) {
            setState(s => ({ ...s, error: validationError }));
            return null;
        }

        setState({ uploading: true, progress: 10, error: null });

        try {
            const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
            const timestamp = Date.now();
            const filePath = userId
                ? `${userId}/${timestamp}.${fileExt}`
                : `public/${timestamp}.${fileExt}`;

            setState(s => ({ ...s, progress: 30 }));

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type
                });

            if (uploadError) throw uploadError;

            setState(s => ({ ...s, progress: 80 }));

            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(filePath);

            setState({ uploading: false, progress: 100, error: null });

            // Reset progress después de un momento
            setTimeout(() => setState(s => ({ ...s, progress: 0 })), 1500);

            return publicUrl;
        } catch (err: any) {
            const msg = err?.message?.includes('Bucket not found')
                ? 'El bucket "products" no existe aún. Ve a Supabase Storage y créalo.'
                : err?.message || 'Error desconocido al subir la imagen.';

            setState({ uploading: false, progress: 0, error: msg });
            return null;
        }
    };

    const clearError = () => setState(s => ({ ...s, error: null }));

    return {
        uploadImage,
        uploading: state.uploading,
        progress: state.progress,
        error: state.error,
        clearError,
    };
};
