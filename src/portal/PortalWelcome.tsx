import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ship, ArrowRight, BookOpen, FlaskConical, Users, Target, KeyRound, Check, AlertCircle } from "lucide-react";
import { usePortalAuth } from "./PortalAuth";
import { changeParticipantPin, validatePassword } from "@/lib/portal-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const SESSION_KEY = "bdh_portal_session";

export function PortalWelcome() {
  const { participant, clearFirstLogin } = usePortalAuth();
  const navigate = useNavigate();

  // PIN change state
  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChanging, setPinChanging] = useState(false);
  const [pinResult, setPinResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleEnter = () => {
    clearFirstLogin();
    navigate("/portal");
  };

  /** Retrieve the access_token stored in session by the login flow. */
  const getAccessToken = (): string | undefined => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (!stored) return undefined;
      return JSON.parse(stored).accessToken;
    } catch { return undefined; }
  };

  const handleChangePin = async () => {
    if (!participant) return;
    const { valid, errors: validationErrors } = validatePassword(newPin);
    if (!valid) {
      setPinResult({ success: false, message: validationErrors[0] || "Password does not meet requirements." });
      return;
    }
    if (newPin !== confirmPin) {
      setPinResult({ success: false, message: "New password and confirmation do not match." });
      return;
    }
    if (currentPin === newPin) {
      setPinResult({ success: false, message: "New password must be different from your current password." });
      return;
    }

    setPinChanging(true);
    setPinResult(null);
    const accessToken = getAccessToken();
    const result = await changeParticipantPin(
      participant.id,
      currentPin,
      newPin,
      participant.reference_number,
      accessToken,
    );
    setPinChanging(false);

    if (result.success) {
      setPinResult({ success: true, message: "PIN changed successfully!" });
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } else {
      setPinResult({ success: false, message: result.error || "Failed to change PIN." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg shadow-blue-500/30">
          <Ship className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Welcome to DMA BlueData Hub
        </h1>

        <p className="text-cyan-400 text-lg md:text-xl mb-8 font-medium">
          You have been selected to join a community of emerging maritime problem-solvers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            { icon: BookOpen, label: "You will learn", desc: "Applied maritime data analytics, research methods, and the tools required for your project." },
            { icon: FlaskConical, label: "You will build", desc: "A real maritime analytics project with your assigned team." },
            { icon: Target, label: "You will analyse", desc: "Realistic maritime datasets, operational indicators, and industry challenges." },
            { icon: Users, label: "You will collaborate", desc: "With your department team, mentors, and the wider BlueData Hub community." },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800 p-5 text-left">
              <item.icon className="h-6 w-6 text-cyan-400 mb-2" />
              <p className="text-white font-semibold text-sm">{item.label}</p>
              <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-slate-400 text-sm mb-8 max-w-lg mx-auto">
          Turn maritime data into practical insights while building a portfolio project you can demonstrate beyond the programme.
        </p>

        {/* Optional PIN Change */}
        <div className="mb-6">
          {!showPinChange ? (
            <button
              onClick={() => setShowPinChange(true)}
              className="text-cyan-500 hover:text-cyan-400 text-sm flex items-center gap-1.5 mx-auto transition-colors"
            >
              <KeyRound className="h-4 w-4" />
              Change my temporary password
            </button>
          ) : (
            <Card className="bg-slate-900/80 border-slate-700 text-left max-w-sm mx-auto">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                  <KeyRound className="h-4 w-4" />
                  Change Your Password
                </div>

                <div>
                  <Label className="text-slate-300 text-xs">Current Password</Label>
                  <Input
                    type="password"
                    value={currentPin}
                    onChange={(e) => { setCurrentPin(e.target.value); setPinResult(null); }}
                    placeholder="Enter current password"
                    className="bg-slate-800 border-slate-600 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-slate-300 text-xs">New Password (min. 8 characters)</Label>
                  <Input
                    type="password"
                    value={newPin}
                    onChange={(e) => { setNewPin(e.target.value); setPinResult(null); }}
                    placeholder="Enter new password"
                    className="bg-slate-800 border-slate-600 text-white mt-1"
                  />
                  {newPin.length > 0 && (() => {
                    const strength = newPin.length >= 12 && /[A-Z]/.test(newPin) && /[a-z]/.test(newPin) && /\d/.test(newPin) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPin)
                      ? { label: "Strong", color: "bg-green-500", width: "w-full" }
                      : newPin.length >= 8 && /[A-Z]/.test(newPin) && /[a-z]/.test(newPin) && /\d/.test(newPin)
                        ? { label: "Medium", color: "bg-amber-500", width: "w-2/3" }
                        : { label: "Weak", color: "bg-red-500", width: "w-1/3" };
                    return (
                      <div className="mt-1.5">
                        <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full ${strength.color} ${strength.width} rounded-full transition-all duration-300`} />
                        </div>
                        <p className={`text-xs mt-0.5 ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <Label className="text-slate-300 text-xs">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => { setConfirmPin(e.target.value); setPinResult(null); }}
                    placeholder="Confirm new password"
                    className="bg-slate-800 border-slate-600 text-white mt-1"
                  />
                </div>

                {pinResult && (
                  <div className={`flex items-center gap-2 text-xs ${pinResult.success ? "text-green-400" : "text-red-400"}`}>
                    {pinResult.success ? <Check className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                    {pinResult.message}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleChangePin}
                    disabled={pinChanging || !currentPin || !newPin || !confirmPin}
                    size="sm"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    {pinChanging ? "Changing..." : "Change Password"}
                  </Button>
                  <Button
                    onClick={() => { setShowPinChange(false); setPinResult(null); setCurrentPin(""); setNewPin(""); setConfirmPin(""); }}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Button
          onClick={handleEnter}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold px-8 py-6 text-base shadow-lg shadow-blue-500/20"
        >
          Enter My Blue Data Hub
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>

        {participant && (
          <p className="text-slate-600 text-xs mt-6">
            {participant.reference_number} · {participant.full_name}
          </p>
        )}
      </div>
    </div>
  );
}