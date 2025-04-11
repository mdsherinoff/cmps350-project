import instructorsRepo from "../../repo/instructors-repo";
import { NextResponse } from 'next/server';

export async function GET(request) {//GET all the instructors
    // const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/instructors`}
    const response = await instructorsRepo.getInstructors();
    return Response.json(response, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
}