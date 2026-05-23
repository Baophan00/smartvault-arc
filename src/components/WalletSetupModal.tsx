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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#111620] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#1e2640] max-h-[90vh] overflow-y-auto animate-slide-up arc-glow">
        {/* Progress bar */}
        <div className="flex gap-1 px-6 pt-5">
          {steps.map((s, i) => {
            const currentIdx = steps.indexOf(state.step);
            const isActive = i <= currentIdx && state.step !== "error";
            return (
              <div
                key={s}
                className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                  isActive ? "bg-[#2f578c]" : "bg-[#1e2640]"
                }`}
              />
            );
          })}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-[#141a24] flex items-center justify-center text-[#7a8599] hover:text-[#acc6e9] hover:bg-[#1e2640] transition-all border border-[#1e2640]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <div className="w-20 h-20 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto shadow-lg shadow-[#1b3158]/40 border border-[#2f578c]/30">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#acc6e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 1 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-light tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Welcome to SmartVault
        </h2>
        <p className="text-sm text-[#7a8599] max-w-xs mx-auto">
          Create a wallet secured by your <span className="text-[#acc6e9]">Face ID</span> or{" "}
          <span className="text-[#acc6e9]">fingerprint</span>. No seed phrases.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-2">
        {[
          { label: "BIOMETRIC SECURITY", desc: "Face ID / Touch ID" },
          { label: "GAS-FREE", desc: "Sponsored transactions on Arc" },
          { label: "CROSS-CHAIN", desc: "Unified USDC balance" },
          { label: "RECOVERABLE", desc: "Restore via phone + OTP" },
        ].map((f, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#141a24] border border-[#1e2640]">
            <span className="text-xs text-[#acc6e9] arc-label">{f.label}</span>
            <span className="text-xs text-[#7a8599]">{f.desc}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm transition-all shadow-lg shadow-[#1b3158]/30 border border-[#2f578c]/20"
      >
        Create Wallet
      </button>

      <p className="text-[10px] arc-label text-[#7a8599]">
        BY CONTINUING, YOU AGREE TO THE TERMS OF SERVICE
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
        <p className="arc-label text-[#7a8599] mb-2">STEP 1 OF 4</p>
        <h2 className="text-xl font-light tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Enter your phone number
        </h2>
        <p className="text-sm text-[#7a8599] mt-1">
          We'll send a verification code via SMS
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="arc-label text-[#7a8599]">PHONE NUMBER</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7a8599] font-mono">
            +84
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="123 456 789"
            maxLength={9}
            className="w-full pl-14 pr-4 py-3.5 rounded-xl bg-[#141a24] border border-[#1e2640] focus:outline-none focus:border-[#2f578c] text-lg font-light transition-all placeholder:text-[#7a8599]/40"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            autoFocus
          />
        </div>
        <p className="text-xs text-[#7a8599]">
          A 6-digit code will be sent to this number
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={phone.length < 9 || isLoading}
        className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1b3158]/20 border border-[#2f578c]/20"
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
        <p className="arc-label text-[#7a8599] mb-2">STEP 2 OF 4</p>
        <h2 className="text-xl font-light tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Verify your number
        </h2>
        <p className="text-sm text-[#7a8599] mt-1">
          Enter the code sent to <span className="text-[#acc6e9]">+84 {phone}</span>
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
            className="w-12 h-14 rounded-xl bg-[#141a24] border border-[#1e2640] text-center text-xl font-light focus:outline-none focus:border-[#2f578c] transition-all"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            maxLength={1}
            autoFocus={i === 0}
          />
        ))}
      </div>

      <button
        onClick={onVerify}
        disabled={otpCode.join("").length !== 6 || isLoading}
        className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1b3158]/20 border border-[#2f578c]/20"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>

      <p className="text-center text-sm text-[#7a8599]">
        {resendCooldown > 0 ? (
          <>Resend code in <span className="text-[#acc6e9] font-medium">{resendCooldown}s</span></>
        ) : (
          <button onClick={handleResend} className="text-[#9F72FF] hover:text-[#b899ff] font-medium transition-colors">
            Resend code
          </button>
        )}
      </p>

      <button
        onClick={() => document.getElementById("otp-0")?.focus()}
        className="text-xs text-[#7a8599] text-center w-full hover:text-[#acc6e9] transition-colors"
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
        <p className="arc-label text-[#7a8599] mb-2">STEP 3 OF 4</p>

        <div className="w-20 h-20 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#2f578c]/30">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#acc6e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="text-xl font-light tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Secure your wallet
        </h2>
        <p className="text-sm text-[#7a8599] max-w-xs mx-auto">
          Use your device&apos;s <span className="text-[#acc6e9]">Face ID</span>,{" "}
          <span className="text-[#acc6e9]">Touch ID</span>, or{" "}
          <span className="text-[#acc6e9]">PIN</span> to protect your wallet.
        </p>

        <div className="bg-[#141a24] rounded-xl border border-[#1e2640] divide-y divide-[#1e2640] text-left">
          <div className="flex items-center gap-3 px-4 py-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9F72FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-xs text-[#7a8599]">No seed phrase to write down</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9F72FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-xs text-[#7a8599]">Recover with phone + OTP</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9F72FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-xs text-[#7a8599]">Biometric confirmation per transaction</span>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1b3158]/20 border border-[#2f578c]/20 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-[#acc6e9]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating wallet...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <div className="w-20 h-20 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#2f578c]/30">
        <svg className="animate-spin h-8 w-8 text-[#acc6e9]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-light tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Creating your wallet
        </h2>
        <p className="text-sm text-[#7a8599]">
          Deploying smart contract on Arc Network...
        </p>
      </div>
      <div className="flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#2f578c] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-[10px] arc-label text-[#7a8599]">
        DO NOT CLOSE THIS WINDOW
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
      <div className="w-20 h-20 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#2f578c]/30">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#acc6e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div className="space-y-1">
        <p className="arc-label text-[#9F72FF]">STEP 4 OF 4</p>
        <h2 className="text-2xl font-light tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Wallet created
        </h2>
        <p className="text-sm text-[#7a8599]">
          Your SmartVault is ready. Secured by passkey.
        </p>
      </div>

      <div className="bg-[#141a24] rounded-xl border border-[#1e2640] p-4">
        <p className="arc-label text-[#7a8599] mb-2">YOUR ADDRESS</p>
        <p className="text-xs font-mono text-[#acc6e9] bg-[#0a0d14] border border-[#1e2640] rounded-lg p-3 break-all">
          {address}
        </p>
      </div>

      <div className="space-y-3">
        <p className="arc-label text-[#7a8599]">NEXT STEPS</p>
        <div className="divide-y divide-[#1e2640] bg-[#141a24] rounded-xl border border-[#1e2640]">
          {[
            { label: "GET TESTNET USDC", desc: "Free from faucet" },
            { label: "SEND TOKENS", desc: "Any wallet in seconds" },
            { label: "VIEW ACTIVITY", desc: "Transaction history" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <span className="text-xs arc-label text-[#acc6e9]">{item.label}</span>
              <span className="text-xs text-[#7a8599]">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm transition-all shadow-lg shadow-[#1b3158]/30 border border-[#2f578c]/20"
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
      <div className="w-20 h-20 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#702718]/50">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e9a13f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="arc-label text-[#e9a13f]">ERROR</p>
        <p className="text-sm text-[#7a8599]">{message || "Something went wrong. Please try again."}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 py-3 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm transition-all border border-[#2f578c]/20"
        >
          Retry
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl bg-[#141a24] hover:bg-[#1e2640] text-[#7a8599] font-medium text-sm transition-all border border-[#1e2640]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
