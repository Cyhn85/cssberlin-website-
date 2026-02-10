import type { OpenNextConfig } from 'opennext/types/open-next';

const config: OpenNextConfig = {
    default: {
        // Cloudflare Workers (Node.js uyumlu mod)
        override: {
            wrapper: 'cloudflare-node',
            converter: 'edge',
        },
    },
    // Kenar durumları için (Opsiyonel)
    edge: {
        override: {
            wrapper: 'cloudflare-edge',
            converter: 'edge',
        },
    },
};

export default config;