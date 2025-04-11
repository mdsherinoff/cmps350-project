import usersRepo from "../../repo/users-repo";
import { NextResponse } from 'next/server';

export async function GET(request) {//GET all the users
    // const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/users`}
    const response = await usersRepo.getUsers();    
    return Response.json(response, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
}
