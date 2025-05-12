// import usersRepo from "../../repo/users-repo";
import { NextResponse } from "next/server";
import masterRepo from "../../../repo/master-repo";

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
//     const url = new URL(request.url);
//     const username = url.searchParams.get("username");
    
//     const user = await masterRepo.findUserByUsername(username);
//     console.log(user);
//   }

  export async function GET(req, {params}){
    const meals = await masterRepo.findUserByUsername(params.username)
    return Response.json(meals, {status : 203})}

// export async function GET(request) {
//  return masterRepo.getAllStudents()
// }
