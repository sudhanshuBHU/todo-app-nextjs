"use server";

import connectMongoDB from "@/libs/mongoConnect";
import Todo from "@/models/Todo";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectMongoDB();
        const { title, completed, description } = await req.json();

        const id = (await params).id;
        // console.log(id, title, completed, description);

        const todo = await Todo.findByIdAndUpdate(id, { title, completed, description }, { new: true });
        // console.log(todo);

        if (todo) {
            return NextResponse.json(todo, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error updating todo', error }, { status: 500 });

    }
}

export async function DELETE(res: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectMongoDB();
        const id = (await params).id;
        // console.log(id);

        const todo = await Todo.findByIdAndDelete(id);
        // console.log(todo);

        if (todo) {
            return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }
    } catch (error) {
        // console.log(error);

        return NextResponse.json({ message: 'Error deleting todo', error }, { status: 500 });
    }
}