import usersRepo from "../../repo/users-repo";
import { NextResponse } from "next/server";
import masterRepo from "../../repo/master-repo";

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

// export async function GET(request) {
//   //GET all the users
//   // const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/users`}
//   const response = await masterRepo.getUsers();
//   return Response.json(response, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//     },
//   });
// }

export async function GET(request) {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    
    const user = await masterRepo.getUsers(username);
    return Response.json(user, {status : 203})
    console.log(user);
  }


