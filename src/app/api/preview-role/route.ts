import { NextResponse, type NextRequest } from "next/server";
import { requireUser, isAdmin, PREVIEW_ROLES } from "@/lib/auth";

const PREVIEW_COOKIE = "kurku_preview_role";

export async function GET(request: NextRequest) {
  const { realProfile } = await requireUser();
  const { origin, searchParams } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/dashboard`);

  if (!isAdmin(realProfile)) {
    return response;
  }

  const role = searchParams.get("role") ?? "";
  if ((PREVIEW_ROLES as readonly string[]).includes(role)) {
    response.cookies.set(PREVIEW_COOKIE, role, {
      path: "/",
      maxAge: 60 * 60 * 6,
    });
  } else {
    response.cookies.delete(PREVIEW_COOKIE);
  }

  return response;
}
