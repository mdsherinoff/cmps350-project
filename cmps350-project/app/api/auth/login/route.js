// import { getUsers } from "./users-repo"
// import { verifyJwt } from "@/app/lib/jwt"

// export async function GET(request) {
//   const idToken = request.headers.get("authorization");
//   if (!idToken) {
//     return Response.json(
//       { error: "🚫 Unauthorized - id token is missing" },
//       { status: 401 }
//     );
//   }

//   const user = verifyJwt(idToken);
//   if (!user) {
//     return Response.json(
//       { error: "🚫 Unauthorized - id token is invalid." },
//       { status: 401 }
//     );
//   }

//   if (!user.role || user.role.toLowerCase() !== "admin") {
//     return Response.json(
//       { error: `⛔ Forbidden - Role should be Admin. Désolé ${user.name}!` },
//       { status: 403 }
//     );
//   }

//   const users = await getUsers();
//   return Response.json(users);
// }
