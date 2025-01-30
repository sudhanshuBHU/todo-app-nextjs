"use server";

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongoDB from '@/libs/mongoConnect';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { email, currentPassword, newPassword } = await req.json();
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Error changing password', error }, { status: 500 });
    }
}