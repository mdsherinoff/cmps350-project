

export async function GET(req: Request) {
  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  redirectUrl.searchParams.set("client_id", process.env.GOOGLE_ID!);
  redirectUrl.searchParams.set("redirect_uri", "http://localhost:3000/api/auth/callback");
  redirectUrl.searchParams.set("response_type", "code");
  redirectUrl.searchParams.set("scope", "openid email profile");

  return Response.redirect(redirectUrl.toString());
}