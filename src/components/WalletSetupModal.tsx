"use client";

import { useState, useCallback } from "react";
import { useWalletCreation, type WalletCreationStep } from "@/hooks/useWalletCreation";

interface WalletSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletCreated: (address: string) => void;
}

export default function WalletSetupModal({ isOpen, onClose, onWalletCreated }: WalletSetupModalProps) {
  const { state, goTo, setPhone, sendOtp, verifyOtp, createWallet, reset } =
    useWalletCreation();
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = useCallback(async () => {
    if (state.phone.length < 10) return;
    setIsLoading(true);
    await sendOtp();
    setIsLoading(false);
    goTo("otp");
  }, [state.phone, sendOtp, goTo]);

  const handleVerifyOtp = useCallback(async () => {
    const code = otpCode.join("");
    if (code.length !== 6) return;
    setIsLoading(true);
    await verifyOtp(code);
    setIsLoading(false);
    goTo("passkey");
  }, [otpCode, verifyOtp, goTo]);

  const handleCreateWallet = useCallback(async () => {
    setIsLoading(true);
    await createWallet();
    setIsLoading(false);
    if (state.step === "success" && state.walletAddress) {
      onWalletCreated(state.walletAddress);
    }
  }, [createWallet, state.step, state.walletAddress, onWalletCreated]);

  const handleOtpInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    // Auto-advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleClose = useCallback(() => {
    reset();
    setOtpCode(["", "", "", "", "", ""]);
    onClose();
  }, [reset, onClose]);

  if (!isOpen) return null;

  const steps: WalletCreationStep[] = ["welcome", "phone", "otp", "passkey", "creating", "success"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Progress bar */}
        <div className="flex gap-1 px-6 pt-5">
          {steps.map((s, i) => {
            const currentIdx = steps.indexOf(state.step);
            const isActive = i <= currentIdx && state.step !== "error";
            return (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  isActive ? "bg-primary" : "bg-border"
                }`}
              />
            );
          })}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-6 py-8">
          {state.step === "welcome" && <WelcomeStep onStart={() => goTo("phone")} />}
          {state.step === "phone" && (
            <PhoneStep
              phone={state.phone}
              setPhone={setPhone}
              onNext={handleSendOtp}
              isLoading={isLoading}
            />
          )}
          {state.step === "otp" && (
            <OtpStep
              otpCode={otpCode}
              onOtpInput={handleOtpInput}
              onVerify={handleVerifyOtp}
              isLoading={isLoading}
              phone={state.phone}
              onResend={handleSendOtp}
            />
          )}
          {state.step === "passkey" && <PasskeyStep onNext={handleCreateWallet} isLoading={isLoading} />}
          {state.step === "creating" && <CreatingStep />}
          {state.step === "success" && (
            <SuccessStep
              address={state.walletAddress}
              onDone={handleClose}
            />
          )}
          {state.step === "error" && (
            <ErrorStep
              message={state.errorMessage}
              onRetry={() => goTo("passkey")}
              onCancel={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ Sub-steps ============ */

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-8 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-3xl wallet-gradient flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 animate-bounce-subtle">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 1 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome to SmartVault
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Create a wallet secured by your <strong>Face ID</strong> or{" "}
          <strong>fingerprint</strong>. No seed phrases, no private keys to lose.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-3 text-left">
        {[
          { icon: "🔐", text: "Secure with biometrics (Face ID / Touch ID)" },
          { icon: "⛽", text: "Gas-free transactions on Arc Network" },
          { icon: "🌉", text: "Cross-chain USDC in one balance" },
          { icon: "🔄", text: "Recover wallet if you lose your phone" },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50">
            <span className="text-lg">{f.icon}</span>
            <span className="text-sm">{f.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-2xl wallet-gradient text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-500/25"
      >
        Create Wallet
      </button>

      <p className="text-xs text-muted-foreground">
        By continuing, you agree to the Terms of Service
      </p>
    </div>
  );
}

function PhoneStep({
  phone, setPhone, onNext, isLoading,
}: {
  phone: string;
  setPhone: (v: string) => void;
  onNext: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Enter your phone number</h2>
        <p className="text-sm text-muted-foreground mt-1">
          We'll send a verification code via SMS
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Phone Number</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
            +84
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="123 456 789"
            maxLength={9}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-lg font-semibold transition-all"
            autoFocus
          />
        </div>
        <p className="text-xs text-muted-foreground">
          We'll send a 6-digit code to this number
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={phone.length < 9 || isLoading}
        className="w-full py-3.5 rounded-2xl wallet-gradient text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
      >
        {isLoading ? "Sending code..." : "Send Code"}
      </button>
    </div>
  );
}

function OtpStep({
  otpCode, onOtpInput, onVerify, isLoading, phone, onResend,
}: {
  otpCode: string[];
  onOtpInput: (i: number, v: string) => void;
  onVerify: () => void;
  isLoading: boolean;
  phone: string;
  onResend: () => void;
}) {
  const [resendCooldown, setResendCooldown] = useState(30);

  const handleResend = useCallback(() => {
    onResend();
    setResendCooldown(30);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onResend]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Verify your number</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">+84 {phone}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-2">
        {otpCode.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => onOtpInput(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digit && i > 0) {
                const prev = document.getElementById(`otp-${i - 1}`);
                prev?.focus();
              }
              if (e.key === "Enter") onVerify();
            }}
            className="w-12 h-14 rounded-xl bg-muted border border-border text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            maxLength={1}
            autoFocus={i === 0}
          />
        ))}
      </div>

      <button
        onClick={onVerify}
        disabled={otpCode.join("").length !== 6 || isLoading}
        className="w-full py-3.5 rounded-2xl wallet-gradient text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>

      <p className="text-center text-sm">
        {resendCooldown > 0 ? (
          <span className="text-muted-foreground">
            Resend code in <span className="font-medium">{resendCooldown}s</span>
          </span>
        ) : (
          <button onClick={handleResend} className="text-primary hover:underline font-medium">
            Resend code
          </button>
        )}
      </p>

      <button
        onClick={() => document.getElementById("otp-0")?.focus()}
        className="text-xs text-muted-foreground text-center w-full hover:text-foreground transition-colors"
      >
        Wrong number? Go back
      </button>
    </div>
  );
}

function PasskeyStep({
  onNext, isLoading,
}: {
  onNext: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse-slow">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3E74BB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Secure your wallet</h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Use your device's <strong>Face ID</strong>, <strong>Touch ID</strong>, or{" "}
          <strong>PIN</strong> to protect your wallet. This replaces a seed phrase.
        </p>
        <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-green-500 mt-0.5">✓</span>
            <span className="text-muted-foreground">No seed phrase to write down</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-green-500 mt-0.5">✓</span>
            <span className="text-muted-foreground">Recover with phone + OTP if you lose device</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-green-500 mt-0.5">✓</span>
            <span className="text-muted-foreground">Every transaction requires biometric confirmation</span>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl wallet-gradient text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating wallet...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Create with Passkey
          </>
        )}
      </button>
    </div>
  );
}

function CreatingStep() {
  return (
    <div className="space-y-8 text-center py-8">
      <div className="w-20 h-20 rounded-3xl wallet-gradient flex items-center justify-center mx-auto animate-pulse">
        <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Creating your wallet</h2>
        <p className="text-sm text-muted-foreground">
          Deploying smart contract on Arc Network...
        </p>
      </div>
      <div className="flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        This should take a few seconds. Do not close this window.
      </p>
    </div>
  );
}

function SuccessStep({
  address,
  onDone,
}: {
  address: string;
  onDone: () => void;
}) {
  return (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto animate-scale-in">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold">Wallet created! 🎉</h2>
        <p className="text-sm text-muted-foreground">
          Your SmartVault is ready. Secured by passkey.
        </p>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Your address</p>
        <p className="text-sm font-mono bg-card border border-border rounded-lg p-3 break-all">
          {address}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">What's next?</p>
        <div className="space-y-2">
          {[
            { icon: "💧", text: "Get free testnet USDC from faucet" },
            { icon: "📤", text: "Send USDC to any wallet in seconds" },
            { icon: "📊", text: "View balance and transaction history" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 text-sm text-left">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full py-3.5 rounded-2xl wallet-gradient text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-500/25"
      >
        Enter SmartVault
      </button>
    </div>
  );
}

function ErrorStep({
  message,
  onRetry,
  onCancel,
}: {
  message: string;
  onRetry: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-sm text-red-500/80">{message}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 rounded-2xl wallet-gradient text-white font-semibold text-sm hover:opacity-90 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
