import { NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function GET(request) {
    const response = {"message": 'Hello API endpoint should be working'}
    return Response.json(response, {status:200})
}