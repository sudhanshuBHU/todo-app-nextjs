"use server";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        const { email, newEmail } = await req.json();
        const user = await User.findOne({ email });
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
        }
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 });
        }
        // Update email
        user.email = newEmail;
        await user.save();
        return new Response('Email changed successfully', { status: 200 });
    } catch (error) {
        // console.log(error);
        return NextResponse.json({ message: 'An error occurred. Please try again.', error }, { status: 500 });
    }
}
