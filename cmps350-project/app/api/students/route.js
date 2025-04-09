import { NextResponse } from 'next/server';

export async function GET(request) {//GET all the students
    const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/students`}
    return Response.json(message, {status:200})
}