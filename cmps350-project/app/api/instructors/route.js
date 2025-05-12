import instructorsRepo from "../../repo/instructors-repo";
import { NextResponse } from "next/server";

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // allow all origins
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(request) {
  //GET all the instructors
  // const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/instructors`}
  const response = await instructorsRepo.getInstructors();
  return Response.json(response, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(request) {
  const courses = await request.json();
  const newInstructors = await instructorsRepo.setInstructors(courses);
  return new Response(JSON.stringify(newInstructors), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}