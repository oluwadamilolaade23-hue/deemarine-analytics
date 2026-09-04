import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith("sha256_salted$")) {
    const parts = storedHash.split("$");
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const expectedHash = parts[2];
    const computedHash = await sha256Hex(salt + ":" + pin);
    return computedHash === expectedHash;
  }
  const legacyHash = await sha256Hex(pin + "::bdh_salt_2026");
  return legacyHash === storedHash;
}

function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPin(pin: string): Promise<string> {
  const salt = generateSalt();
  const hash = await sha256Hex(salt + ":" + pin);
  return `sha256_salted$${salt}$${hash}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const body = await req.json();
    const { action } = body;

    const adminHeaders = {
      apikey: SERVICE_ROLE_KEY,
      Authorization: "Bearer " + SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    if (action === "change_pin") {
      const { reference, current_pin, new_pin } = body;

      if (!reference || !current_pin || !new_pin) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields: reference, current_pin, new_pin" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!/^\d{6}$/.test(new_pin)) {
        return new Response(
          JSON.stringify({ success: false, error: "New PIN must be exactly 6 digits" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      const participantResp = await fetch(
        SUPABASE_URL + "/rest/v1/portal_participants?reference_number=eq." + encodeURIComponent(reference) + "&select=id,reference_number",
        { headers: adminHeaders }
      );
      const participants = await participantResp.json();
      if (!participants || participants.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "Participant not found" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      const participantId = participants[0].id;

      const accessResp = await fetch(
        SUPABASE_URL + "/rest/v1/portal_participant_access?participant_id=eq." + participantId + "&select=id,pin_hash,is_active",
        { headers: adminHeaders }
      );
      const accessRecords = await accessResp.json();
      if (!accessRecords || accessRecords.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "Access record not found" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      const accessRecord = accessRecords[0];
      if (!accessRecord.is_active) {
        return new Response(
          JSON.stringify({ success: false, error: "Account is deactivated" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      const currentValid = await verifyPin(current_pin, accessRecord.pin_hash);
      if (!currentValid) {
        return new Response(
          JSON.stringify({ success: false, error: "Current PIN is incorrect" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      const newHash = await hashPin(new_pin);
      const updateResp = await fetch(
        SUPABASE_URL + "/rest/v1/portal_participant_access?id=eq." + accessRecord.id,
        {
          method: "PATCH",
          headers: adminHeaders,
          body: JSON.stringify({ pin_hash: newHash }),
        }
      );
      if (!updateResp.ok) {
        const errText = await updateResp.text();
        console.error("PIN update failed:", errText);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to update PIN" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      await fetch(
        SUPABASE_URL + "/rest/v1/portal_participants?id=eq." + participantId,
        {
          method: "PATCH",
          headers: adminHeaders,
          body: JSON.stringify({ first_login: false }),
        }
      );

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (action === "clear_first_login") {
      const { reference } = body;

      if (!reference) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required field: reference" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      const participantResp = await fetch(
        SUPABASE_URL + "/rest/v1/portal_participants?reference_number=eq." + encodeURIComponent(reference) + "&select=id",
        { headers: adminHeaders }
      );
      const participants = await participantResp.json();
      if (!participants || participants.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "Participant not found" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      const participantId = participants[0].id;

      const updateResp = await fetch(
        SUPABASE_URL + "/rest/v1/portal_participants?id=eq." + participantId,
        {
          method: "PATCH",
          headers: adminHeaders,
          body: JSON.stringify({ first_login: false }),
        }
      );
      if (!updateResp.ok) {
        const errText = await updateResp.text();
        console.error("clear_first_login failed:", errText);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to update first_login" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Unknown action" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("bdh-portal-pin error:", e);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
