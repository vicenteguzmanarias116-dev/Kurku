"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireUser, isAdmin, PREVIEW_ROLES } from "@/lib/auth";

const PREVIEW_COOKIE = "kurku_preview_role";

export async function setPreviewRole(formData: FormData) {
  const { realProfile } = await requireUser();
  if (!isAdmin(realProfile)) throw new Error("Solo el administrador.");

  const role = String(formData.get("role") || "");
  const cookieStore = await cookies();
  if ((PREVIEW_ROLES as readonly string[]).includes(role)) {
    cookieStore.set(PREVIEW_COOKIE, role, { path: "/", maxAge: 60 * 60 * 6 });
  }
  redirect("/dashboard");
}

export async function clearPreviewRole() {
  const cookieStore = await cookies();
  cookieStore.delete(PREVIEW_COOKIE);
  redirect("/dashboard");
}
