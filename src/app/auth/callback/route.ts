import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (tokenHash && type) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any });
  }

  // el flujo con "code" (PKCE) no manda type=recovery en la URL, así que
  // usamos nuestra propia marca "next" para saber que es un reseteo de clave.
  if (type === "recovery" || next === "/auth/reset") {
    return NextResponse.redirect(`${origin}/auth/reset`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("team_id")
      .eq("id", user.id)
      .single();
    if (!profile?.team_id) {
      return NextResponse.redirect(`${origin}/equipo/nuevo`);
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
