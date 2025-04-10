import coursesRepo from "@/app/repo/courses-repo.js";
export async function GET(request) {//GET all the courses
    // const message = {message: `This is the API endpoint for GET @ http://localhost:3000/api/courses`}
    const response = await coursesRepo.getCourses();
    return Response.json(response)
}
export async function POST(request) {//SET courses in case of add
    const courses = await request.json()
    const newCourses = await coursesRepo.setCourses(courses);
    return Response.json(newCourses)
}
