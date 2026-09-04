import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ship, Lock, ArrowRight, AlertCircle, AlertTriangle, ShieldOff, Clock, Waves, KeyRound, Shield } from "lucide-react";
import { usePortalAuth } from "./PortalAuth";
import type { LoginError } from "./PortalAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LockoutCountdown({ lockoutUntil, onExpired }: { lockoutUntil: string; onExpired: () => void }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date(lockoutUntil).getTime();

    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft("");
        onExpired();
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil, onExpired]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-3">
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-amber-500/40 bg-amber-500/10">
        <Clock className="h-5 w-5 text-amber-400" />
        <svg className="absolute inset-0 w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="2" />
        </svg>
      </div>
      <div>
        <p className="text-amber-400 font-mono text-2xl font-bold tracking-wider">{timeLeft}</p>
        <p className="text-amber-400/60 text-xs">until you can try again</p>
      </div>
    </div>
  );
}

function ErrorDisplay({ error, errorDetail, onLockoutExpired }: {
  error: string;
  errorDetail?: LoginError;
  onLockoutExpired: () => void;
}) {
  if (!error) return null;

  // Determine icon and color scheme based on error type
  const getConfig = () => {
    switch (errorDetail?.type) {
      case "invalid_pin":
        return {
          icon: <KeyRound className="h-5 w-5 flex-shrink-0" />,
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          iconColor: "text-amber-400",
          textColor: "text-amber-300",
          subColor: "text-amber-400/70",
        };
      case "locked":
        return {
          icon: <ShieldOff className="h-5 w-5 flex-shrink-0" />,
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          iconColor: "text-red-400",
          textColor: "text-red-300",
          subColor: "text-red-400/70",
        };
      case "deactivated":
        return {
          icon: <AlertTriangle className="h-5 w-5 flex-shrink-0" />,
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          iconColor: "text-red-400",
          textColor: "text-red-300",
          subColor: "text-red-400/70",
        };
      case "not_found":
        return {
          icon: <AlertCircle className="h-5 w-5 flex-shrink-0" />,
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
          iconColor: "text-orange-400",
          textColor: "text-orange-300",
          subColor: "text-orange-400/70",
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 flex-shrink-0" />,
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          iconColor: "text-red-400",
          textColor: "text-red-300",
          subColor: "text-red-400/70",
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`rounded-xl ${config.bg} border ${config.border} p-4 space-y-2`}>
      <div className="flex items-start gap-3">
        <div className={config.iconColor}>{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`${config.textColor} text-sm font-medium leading-relaxed`}>{error}</p>

          {/* Attempts remaining indicator for wrong PIN */}
          {errorDetail?.type === "invalid_pin" && errorDetail.attemptsRemaining !== undefined && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`${config.subColor} text-xs font-medium`}>Attempts remaining</span>
                <span className={`${config.subColor} text-xs`}>({errorDetail.attemptsRemaining} of 5)</span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      i < errorDetail.attemptsRemaining!
                        ? "bg-amber-400"
                        : "bg-amber-400/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lockout countdown timer */}
          {errorDetail?.type === "locked" && errorDetail.lockoutUntil && (
            <LockoutCountdown lockoutUntil={errorDetail.lockoutUntil} onExpired={onLockoutExpired} />
          )}

          {/* Deactivated account - extra help text */}
          {errorDetail?.type === "deactivated" && (
            <p className={`${config.subColor} text-xs mt-2`}>
              Contact us at support@deemarine.com or use the support link below.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function PortalLogin() {
  const navigate = useNavigate();
  const { login } = usePortalAuth();
  const [reference, setReference] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [errorDetail, setErrorDetail] = useState<LoginError | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleLockoutExpired = () => {
    setError("Your lockout period has ended. You can now try signing in again.");
    setErrorDetail({
      message: "Your lockout period has ended. You can now try signing in again.",
      type: "generic",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorDetail(undefined);
    setLoading(true);

    if (!reference.trim() || !pin.trim()) {
      setError("Please enter both your reference number and password.");
      setLoading(false);
      return;
    }

    const result = await login(reference, pin);
    if (result.success) {
      navigate("/portal");
    } else {
      setError(result.error || "Login failed. Please try again.");
      setErrorDetail(result.errorDetail);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background maritime data visual elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg viewBox="0 0 1200 800" className="w-full h-full">
            <defs>
              <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </linearGradient>
            </defs>
            <path d="M0,400 Q300,350 600,400 T1200,400 L1200,800 L0,800 Z" fill="url(#oceanGrad)" opacity="0.3" />
            <path d="M0,450 Q300,400 600,450 T1200,450 L1200,800 L0,800 Z" fill="url(#oceanGrad)" opacity="0.2" />
            <path d="M0,500 Q300,460 600,500 T1200,500 L1200,800 L0,800 Z" fill="url(#oceanGrad)" opacity="0.15" />
          </svg>
        </div>
        {/* Data grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/20"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 0.6; }
        }
      `}</style>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 shadow-lg shadow-blue-500/30">
            <Ship className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DMA BlueData Hub</h1>
          <p className="text-cyan-400 text-sm mt-1 font-medium">Real Maritime Data. Real Projects. Real Experience.</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Welcome Back</h2>
            <p className="text-slate-400 text-sm mt-1">Enter your reference number and password to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="reference" className="text-slate-300 text-sm font-medium">
                Participant Reference
              </Label>
              <Input
                id="reference"
                type="text"
                placeholder="BDH-2026-0042"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-cyan-500 focus:ring-cyan-500/20"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-slate-300 text-sm font-medium">
                Password
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-cyan-500 focus:ring-cyan-500/20"
                autoComplete="off"
              />
            </div>

            <ErrorDisplay
              error={error}
              errorDetail={errorDetail}
              onLockoutExpired={handleLockoutExpired}
            />

            <Button
              type="submit"
              disabled={loading || errorDetail?.type === "locked"}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-6 text-base shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Signing in..."
              ) : errorDetail?.type === "locked" ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Account Locked
                </>
              ) : (
                <>
                  Enter Blue Data Hub
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-2">
            <p className="text-slate-500 text-sm">
              Need help accessing your account?
            </p>
            <a
              href="/contact"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-block"
            >
              Contact BlueData Hub Support
            </a>
            <div className="pt-3 border-t border-slate-800/50">
              <a
                href="/portal/admin"
                className="text-slate-500 hover:text-slate-300 text-xs inline-flex items-center gap-1 transition-colors"
              >
                <Shield className="h-3 w-3" />
                Admin Command Centre
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-600 text-xs flex items-center justify-center gap-1.5">
            <Waves className="h-3 w-3" />
            Sea to Screen — Maritime Decisions Powered by Data
          </p>
        </div>
      </div>
    </div>
  );
}