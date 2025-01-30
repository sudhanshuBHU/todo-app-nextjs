"use server";

import { NextRequest, NextResponse } from "next/server";
import Todo from "@/models/Todo";
import connectMongoDB from "@/libs/mongoConnect";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { title, description, user } = await req.json();
        const newTodo = new Todo({
            userId: user,
            title,
            description,
            completed: false,
        });
        const savedTodo = await newTodo.save();
        return NextResponse.json({savedTodo,status: true}, { status: 201 });   
    } catch (error) {
        return NextResponse.json({ message: 'Error creating todo', error, status: false }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    try {
        await connectMongoDB();
        const userId = req.headers.get('user');
        const todos = await Todo.find({ userId });
        return NextResponse.json({ todos }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching todos', error }, { status: 500 });
    }
}


