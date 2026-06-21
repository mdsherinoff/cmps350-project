import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "This auth login endpoint is not implemented." },
    { status: 404 },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "This auth login endpoint is not implemented." },
    { status: 404 },
  );
}
