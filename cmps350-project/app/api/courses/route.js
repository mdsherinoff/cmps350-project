import coursesRepo from "../../repo/courses-repo"; // Relative path to the repo file

export async function GET(request) {
  const response = await coursesRepo.getCourses();
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });

}

export async function POST(request) {
  const courses = await request.json();
  const newCourses = await coursesRepo.setCourses(courses);
  return new Response(JSON.stringify(newCourses), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}
