"use server";

import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose';


const idToRequestCount = new Map<string, number>(); // keeps track of individual users
const rateLimiter = {
    windowStart: Date.now(),
    windowSize: 10000,  // 10 seconds
    maxRequests: 10,   // 10 requests per window
};


export async function middleware(request: NextRequest) {

    const ip = request.headers.get('x-forwarded-for')?.split(",")[0] || "unknown";
    // console.log(ip);
    // Rate limit check
    const success = limit(ip);

    if (success) {
        return NextResponse.redirect(new URL('/blocked', request.url));
    }
    const path = request.nextUrl.pathname;
    if (path === '/login') {
        return NextResponse.next();
    }

    const authHeader = request.headers.get('Authorization');
    // const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!authHeader) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
        const { payload } = await jwtVerify(token, secret);
        if (!payload) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: ['/api/changeemail', '/api/changepassword', '/api/todos/:id', '/api/todos', '/login'],
}






// custom rate limiter
const limit = (ip: string) => {
    const now = Date.now();

    // Reset window if the time has elapsed
    if (now - rateLimiter.windowStart > rateLimiter.windowSize) {
        rateLimiter.windowStart = now;
        idToRequestCount.clear(); // Reset all users' request counts
    }

    // Increment request count for this IP
    const currentCount = idToRequestCount.get(ip) ?? 0;
    if (currentCount >= rateLimiter.maxRequests) return true;

    idToRequestCount.set(ip, currentCount + 1);
    return false;
};