import studentsRepo from "../../repo/students-repo";
import { NextResponse } from "next/server";

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(request) {
  const response = await studentsRepo.getStudents();
  return Response.json(response, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(request) {
  const students = await request.json();
  const newStudents = await studentsRepo.setStudents(students);
  return new Response(newStudents, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
