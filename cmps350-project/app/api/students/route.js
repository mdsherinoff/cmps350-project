import studentsRepo from "../../repo/students-repo";
import { NextResponse } from 'next/server';

export async function GET(request) {//GET all the students
    // const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/students`}
    const response = await studentsRepo.getStudents();
    return Response.json(response, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
}
export async function POST(request) {//SET students in 
    const students = await request.json()
    const newStudents = await studentsRepo.setStudents(students);
    return Response.json(newStudents)
}