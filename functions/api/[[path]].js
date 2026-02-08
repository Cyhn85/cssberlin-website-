/**
 * Cloudflare Pages Function - API Proxy
 * Proxies all /api/* requests to Hetzner backend with HTTPS
 * This solves the mixed content security issue
 */

export async function onRequest(context) {
    const { request, env } = context;

    // Backend API URL (Hetzner server)
    const BACKEND_URL = 'https://195.201.146.224:8000';

    // Extract the path from the request
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api/, '');
    const searchParams = url.search;

    // Construct the backend URL
    const backendUrl = `${BACKEND_URL}${path}${searchParams}`;

    console.log(`[API Proxy] ${request.method} ${backendUrl}`);

    try {
        // Forward the request to backend
        const backendRequest = new Request(backendUrl, {
            method: request.method,
            headers: request.headers,
            body: request.method !== 'GET' && request.method !== 'HEAD'
                ? await request.arrayBuffer()
                : undefined,
        });

        // Get response from backend
        const backendResponse = await fetch(backendRequest);

        // Create new response with CORS headers
        const response = new Response(backendResponse.body, {
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            headers: backendResponse.headers,
        });

        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }

        return response;

    } catch (error) {
        console.error('[API Proxy] Error:', error);

        return new Response(JSON.stringify({
            error: 'API Proxy Error',
            message: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}
