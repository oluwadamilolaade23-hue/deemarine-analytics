// ============================================================
// Supabase Edge Function: admin-pin-verify
// Runs PIN Access Verification Report queries with service role key
// This avoids exposing sensitive participant/access data to anon key users.
//
// Deploy: supabase functions deploy admin-pin-verify
// The function automatically has access to SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY environment variables.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Require admin authorization token to prevent unauthenticated access
    const adminToken = req.headers.get("x-admin-token");
    const expectedToken = Deno.env.get("ADMIN_API_TOKEN");
    if (expectedToken && adminToken !== expectedToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: invalid or missing admin token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // ── Fetch participants (service role bypasses RLS) ──
    const { data: participants, error: participantsError } = await adminClient
      .from("portal_participants")
      .select("id, reference_number, full_name, access_status, application_id")
      .order("created_at", { ascending: false });

    // ── Fetch access records (service role bypasses RLS) ──
    const { data: accessRecords, error: accessError } = await adminClient
      .from("portal_participant_access")
      .select("*")
      .order("created_at", { ascending: false });

    // ── Fetch applications (service role bypasses RLS) ──
    // Uses 'whatsapp' field (the actual column name — there is no 'phone' column)
    const { data: applications, error: applicationsError } = await adminClient
      .from("dma_bluedata_hub_applications")
      .select("id, selection_status, full_name, whatsapp, country, total_score, application_reference")
      .order("submitted_at", { ascending: false });

    const errors: string[] = [];
    if (participantsError) errors.push(`portal_participants: [${participantsError.code}] ${participantsError.message}`);
    if (accessError) errors.push(`portal_participant_access: [${accessError.code}] ${accessError.message}`);
    if (applicationsError) errors.push(`dma_bluedata_hub_applications: [${applicationsError.code}] ${applicationsError.message}`);

    return new Response(
      JSON.stringify({
        participants: participants ?? [],
        accessRecords: accessRecords ?? [],
        applications: applications ?? [],
        errors,
        phoneFieldUsed: "whatsapp",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});