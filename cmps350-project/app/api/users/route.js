import { NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function GET(request) {//GET all the users
    const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/users`}
    return Response.json(message, {status:200})
}
