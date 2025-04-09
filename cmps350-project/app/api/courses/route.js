import { NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function GET(request) {//GET all the courses
    const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/courses`}
    return Response.json(message, {status:200})
}