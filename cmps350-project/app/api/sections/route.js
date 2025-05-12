import MasterRepo from "../../repo/master-repo";

export async function GET() {
  const sections = await MasterRepo.getAllSections();
  return Response.json(sections, { status: 200 });
}

export async function POST(request) {
  const data = await request.json();
  const section = await MasterRepo.createSection(data);
  return Response.json(section, { status: 201 });
}

// Add PUT and DELETE as needed
