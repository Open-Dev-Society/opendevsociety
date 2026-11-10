import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const slug = path.join('/');
    const query = request.nextUrl.search; // includes ?per_page=100 etc.

    const targetUrl = `https://api.github.com/${slug}${query}`;
    console.log(`[API Proxy] Forwarding to: ${targetUrl}`);

    try {
        const res = await fetch(targetUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Open-Dev-Society-Site'
            }
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("[API Proxy] Error:", error);
        return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: 500 });
    }
}
