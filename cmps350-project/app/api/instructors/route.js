import { NextResponse } from 'next/server';

export async function GET(request) {//GET all the instructors
    const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/instructors`}
    return Response.json(message, {status:200})
}