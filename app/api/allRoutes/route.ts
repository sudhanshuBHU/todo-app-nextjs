"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log(req.nextUrl.pathname);
  const routes = [{
    name: 'Login',
    path: '/api/login',
    type: 'POST',
  },
  {
    name: 'Signup',
    path: '/api/signup',
    type: 'POST',
  },
  {
    name: 'Change Email',
    path: '/api/changeemail',
    type: 'POST',
  },
  {
    name: 'Change Password',
    path: '/api/changepassword',
    type: 'POST',
  },
  {
    name: 'Get all Todos',
    path: '/api/todos',
    type: 'GET',
  },
  {
    name: 'Create Todo',
    path: '/api/todos',
    type: 'POST',
  },
  {
    name: 'Get Todo by ID',
    path: '/api/todos/:id',
    type: 'GET',
  },
  {
    name: 'Update Todo by ID',
    path: '/api/todos/:id',
    type: 'PUT',
  },
  {
    name: 'Delete Todo by ID',
    path: '/api/todos/:id',
    type: 'DELETE',
  },
  {
    name: 'List Routes',
    path: '/api/allRoutes',
    type: 'GET',
  }
  ];
  return NextResponse.json({ routes }, { status: 200 });
};
