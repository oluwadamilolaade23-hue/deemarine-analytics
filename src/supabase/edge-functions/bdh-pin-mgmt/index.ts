const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const action = body.action || "";

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ success: false, error: "Server configuration error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Helper: service-role Supabase REST call
    const sbFetch = async (table: string, method: string, queryStr: string, bodyObj?: any) => {
      const url = `${supabaseUrl}/rest/v1/${table}${queryStr}`;
      const opts: any = {
        method,
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
      };
      if (bodyObj) opts.body = JSON.stringify(bodyObj);
      const res = await fetch(url, opts);
      return res;
    };

    // Helper: SHA-256 hex
    const sha256Hex = async (input: string): Promise<string> => {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
    };

    // Helper: verify PIN against sha256_salted$salt$hash format
    const verifyPin = async (pin: string, storedHash: string): Promise<boolean> => {
      if (storedHash.startsWith("sha256_salted$")) {
        const parts = storedHash.split("$");
        if (parts.length !== 3) return false;
        const salt = parts[1];
        const expectedHash = parts[2];
        const computedHash = await sha256Hex(salt + ":" + pin);
        return computedHash === expectedHash;
      }
      // Legacy format
      const legacyHash = await sha256Hex(pin + "::bdh_salt_2026");
      return legacyHash === storedHash;
    };

    // Helper: generate salt + hash for new PIN
    const hashPin = async (pin: string): Promise<string> => {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      const salt = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
      const hash = await sha256Hex(salt + ":" + pin);
      return `sha256_salted$${salt}$${hash}`;
    };

    // ─── clear_first_login ───
    if (action === "clear_first_login") {
      const reference = (body.reference || "").trim().toUpperCase();
      const accessToken = body.access_token || "";

      if (!reference) {
        return new Response(JSON.stringify({ success: false, error: "Reference number required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Look up participant by reference number
      const lookupRes = await sbFetch(
        "portal_participants",
        "GET",
        `?reference_number=eq.${reference}&select=id,reference_number,first_login`
      );
      const participants = await lookupRes.json();
      if (!participants || participants.length === 0) {
        return new Response(JSON.stringify({ success: false, error: "Participant not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const participant = participants[0];

      // Update first_login to false (service role bypasses RLS)
      const updateRes = await sbFetch(
        "portal_participants",
        "PATCH",
        `?id=eq.${participant.id}`,
        { first_login: false }
      );

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        return new Response(JSON.stringify({ success: false, error: "Failed to update first_login", detail: errText }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, reference_number: reference }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── change_pin ───
    if (action === "change_pin") {
      const reference = (body.reference || "").trim().toUpperCase();
      const currentPin = String(body.current_pin || "");
      const newPin = String(body.new_pin || "");
      const accessToken = body.access_token || "";

      if (!reference || !currentPin || !newPin) {
        return new Response(JSON.stringify({ success: false, error: "Reference, current_pin, and new_pin are required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate new PIN is exactly 6 digits
      if (!/^\d{6}$/.test(newPin)) {
        return new Response(JSON.stringify({ success: false, error: "New PIN must be exactly 6 digits" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Look up participant + access record
      const pRes = await sbFetch(
        "portal_participants",
        "GET",
        `?reference_number=eq.${reference}&select=id,reference_number,first_login`
      );
      const participants = await pRes.json();
      if (!participants || participants.length === 0) {
        return new Response(JSON.stringify({ success: false, error: "Participant not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const participant = participants[0];

      // Get access record
      const aRes = await sbFetch(
        "portal_participant_access",
        "GET",
        `?participant_id=eq.${participant.id}&select=id,pin_hash,is_active,locked_until,failed_attempts`
      );
      const accessRecords = await aRes.json();
      if (!accessRecords || accessRecords.length === 0) {
        return new Response(JSON.stringify({ success: false, error: "No access record found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const access = accessRecords[0];

      // Check if account is active
      if (!access.is_active) {
        return new Response(JSON.stringify({ success: false, error: "Account is deactivated" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if locked
      if (access.locked_until && new Date(access.locked_until) > new Date()) {
        return new Response(JSON.stringify({ success: false, error: "Account is temporarily locked" }), {
          status: 423, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify current PIN
      const pinValid = await verifyPin(currentPin, access.pin_hash);
      if (!pinValid) {
        // Increment failed attempts
        const newAttempts = (access.failed_attempts || 0) + 1;
        const lockUpdate: any = { failed_attempts: newAttempts };
        if (newAttempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
          lockUpdate.locked_until = lockUntil;
        }
        await sbFetch("portal_participant_access", "PATCH", `?id=eq.${access.id}`, lockUpdate);

        return new Response(JSON.stringify({ success: false, error: "Current PIN is incorrect" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Hash new PIN and update
      const newPinHash = await hashPin(newPin);
      const updateRes = await sbFetch(
        "portal_participant_access",
        "PATCH",
        `?id=eq.${access.id}`,
        { pin_hash: newPinHash, failed_attempts: 0, locked_until: null }
      );

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        return new Response(JSON.stringify({ success: false, error: "Failed to update PIN", detail: errText }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Also clear first_login if it was set
      if (participant.first_login) {
        await sbFetch("portal_participants", "PATCH", `?id=eq.${participant.id}`, { first_login: false });
      }

      return new Response(JSON.stringify({ success: true, reference_number: reference }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── ping ───
    if (action === "ping") {
      return new Response(JSON.stringify({ success: true, action: "ping" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Unknown action
    return new Response(JSON.stringify({ success: false, error: `Unknown action: ${action}` }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: `Internal error: ${err instanceof Error ? err.message : String(err)}` }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});