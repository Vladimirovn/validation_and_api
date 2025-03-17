import { ref } from 'vue';

interface ApiRequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
}

export function useApi(options: ApiRequestOptions) {
    const data = ref(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const success = ref(false);

    const fetchData = async () => {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            const response = await fetch(options.url, {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                body: options.body ? JSON.stringify(options.body) : undefined,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            data.value = await response.json();
            success.value = true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'ERROR';
        } finally {
            loading.value = false;
        }
    };

    return {
        data,
        loading,
        error,
        success,
        fetchData,
    };
}