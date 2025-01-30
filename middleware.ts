"use server";

import { NextResponse, NextRequest } from 'next/server'
import {jwtVerify} from 'jose';

export async function middleware(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');
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
    matcher: ['/api/changeemail', '/api/changepassword', '/api/todos/:id', '/api/todos'],
}