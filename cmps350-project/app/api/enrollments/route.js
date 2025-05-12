import MasterRepo from "../../repo/master-repo";

export async function POST(request) {
  const { studentUId, crn } = await request.json();
  const enrollment = await MasterRepo.registerStudentInCourse(
    studentUId,
    null,
    crn
  );
  return Response.json(enrollment, { status: 201 });
}
