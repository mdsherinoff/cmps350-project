import coursesRepo from "../../repo/courses-repo";
import masterRepo from "../../repo/master-repo";

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

// export async function GET(request) {
//   const response = await masterRepo.getAllCourses();
//   return Response.json(response, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//     },
//   });
// }

export async function GET(request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  try {
    const courses = await masterRepo.getCoursesByCategory(category);
    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Failed to fetch courses:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const courses = await request.json();
  const newCourses = await coursesRepo.addCourse(courses);
  return new Response(JSON.stringify(newCourses), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function ASSIGN(request) {
  const students = await request.json();
  const newCourses = await coursesRepo.setCourses(courses);
  return new Response(newCourses, {
    status: 205,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
