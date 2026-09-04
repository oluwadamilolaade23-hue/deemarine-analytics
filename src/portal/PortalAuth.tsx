import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { logActivity } from "@/lib/portal-data";
import type { Participant } from "@/lib/portal-data";

interface LoginError {
  message: string;
  type: "invalid_pin" | "locked" | "deactivated" | "not_found" | "config" | "generic";
  attemptsRemaining?: number;
  lockoutMinutes?: number;
  lockoutUntil?: string; // ISO timestamp
}

interface PortalAuthContextType {
  participant: Participant | null;
  loading: boolean;
  login: (reference: string, pin: string) => Promise<{ success: boolean; error?: string; errorDetail?: LoginError }>;
  logout: () => void;
  isFirstLogin: boolean;
  clearFirstLogin: () => void;
}

const PortalAuthContext = createContext<PortalAuthContextType | undefined>(undefined);

const SESSION_KEY = "bdh_portal_session";

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check session expiration (2 hours) and fingerprint
        if (parsed.expiresAt && Date.now() < parsed.expiresAt && parsed.fingerprint === btoa(navigator.userAgent)) {
          setParticipant(parsed.participant);
          setIsFirstLogin(parsed.participant?.first_login ?? false);
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (reference: string, pin: string): Promise<{ success: boolean; error?: string; errorDetail?: LoginError }> => {
    if (!isSupabaseConfigured) {
      const detail: LoginError = {
        message: "Portal authentication requires database connection. Please contact BlueData Hub Support.",
        type: "config",
      };
      return { success: false, error: detail.message, errorDetail: detail };
    }

    try {
      // Use bdh-portal-auth Edge Function for all login logic
      // (PIN verification, lockout, failed-attempt tracking are handled server-side)
      const { data, error } = await supabase.functions.invoke("bdh-portal-auth", {
        body: {
          action: "login",
          reference: reference.trim().toUpperCase(),
          pin,
        },
      });

      if (error) {
        const detail: LoginError = {
          message: "Something went wrong on our end. Please wait a moment and try again.",
          type: "generic",
        };
        return { success: false, error: detail.message, errorDetail: detail };
      }

      if (!data?.success) {
        // Map Edge Function error to user-friendly message
        const serverError = data?.error || "Login failed";
        let detail: LoginError;

        if (serverError.toLowerCase().includes("locked")) {
          detail = {
            message: "Your account is temporarily locked due to too many failed attempts. Please try again later.",
            type: "locked",
          };
        } else if (serverError.toLowerCase().includes("deactivated") || serverError.toLowerCase().includes("inactive")) {
          detail = {
            message: "Your portal access has been deactivated. If you believe this is an error, please contact BlueData Hub Support for assistance.",
            type: "deactivated",
          };
        } else {
          // Generic "Invalid reference number or PIN" — don't reveal which one is wrong
          detail = {
            message: "That reference number or PIN isn't correct. Please double-check and try again.",
            type: "invalid_pin",
          };
        }
        return { success: false, error: detail.message, errorDetail: detail };
      }

      // Success — map Edge Function response to Participant type
      const efParticipant = data.participant;
      const participantData: Participant = {
        id: efParticipant.id,
        reference_number: efParticipant.reference_number,
        full_name: efParticipant.full_name,
        email: efParticipant.email,
        department: efParticipant.department,
        group_id: efParticipant.group_name,
        project_id: efParticipant.project_name,
        programme_status: efParticipant.programme_status || "active",
        access_status: "active",
        first_login: data.must_change_pin ?? efParticipant.first_login ?? false,
      };

      // Log activity (fire-and-forget, non-blocking)
      logActivity(participantData.id, "login", "Participant logged in").catch(() => {});

      // Create session (2 hour expiration, store access_token for Edge Function calls)
      const sessionData = {
        participant: participantData,
        accessToken: data.access_token,
        fingerprint: btoa(navigator.userAgent),
        expiresAt: Date.now() + 2 * 60 * 60 * 1000,
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

      setParticipant(participantData);
      setIsFirstLogin(participantData.first_login);
      return { success: true };
    } catch (e) {
      const detail: LoginError = {
        message: "Something went wrong on our end. Please wait a moment and try again.",
        type: "generic",
      };
      return { success: false, error: detail.message, errorDetail: detail };
    }
  };

  const logout = () => {
    if (participant) {
      logActivity(participant.id, "logout", "Participant logged out");
    }
    sessionStorage.removeItem(SESSION_KEY);
    setParticipant(null);
    setIsFirstLogin(false);
  };

  const clearFirstLogin = () => {
    setIsFirstLogin(false);
    if (participant) {
      const updated = { ...participant, first_login: false };
      setParticipant(updated);
      const stored = sessionStorage.getItem(SESSION_KEY);
      let sessionObj: { participant?: Participant; accessToken?: string; expiresAt?: number } | null = null;
      if (stored) {
        try {
          sessionObj = JSON.parse(stored);
          sessionObj.participant = updated;
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
        } catch { /* ignore parse error */ }
      }
      // Update via bdh-pin-mgmt Edge Function (avoids RLS 401 on direct table update)
      if (isSupabaseConfigured) {
        supabase.functions.invoke("bdh-pin-mgmt", {
          body: {
            action: "clear_first_login",
            reference: participant.reference_number,
            access_token: sessionObj?.accessToken,
          },
        }).then(({ error }) => {
          if (error) console.warn("clearFirstLogin Edge Function error:", error.message);
        }).catch(() => {});
      }
    }
  };

  return (
    <PortalAuthContext.Provider
      value={{ participant, loading, login, logout, isFirstLogin, clearFirstLogin }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}

export type { LoginError };