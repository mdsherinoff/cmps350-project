import { NextResponse } from "next/server";

const createErrorResponse = (request, method) => {
  const url = new URL(request.url);
  return NextResponse.json(
    {
      error: `The ${method} method is not available at ${url.pathname}. NextAuth is not configured for this route.`,
    },
    { status: 404 }
  );
};

export async function GET(request) {
  return createErrorResponse(request, "GET");
}

export async function POST(request) {
  return createErrorResponse(request, "POST");
}
