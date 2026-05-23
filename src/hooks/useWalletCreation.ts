"use client";

import { useState, useCallback } from "react";

export type WalletCreationStep =
  | "welcome"       // Giới thiệu — "Tạo ví mới với Passkey"
  | "phone"         // Nhập số điện thoại
  | "otp"           // Xác thực OTP
  | "passkey"       // Tạo passkey (Face ID / vân tay)
  | "creating"      // Đang tạo ví (Circle API)
  | "success"       // Tạo thành công
  | "error";        // Lỗi

export interface WalletCreationState {
  step: WalletCreationStep;
  phone: string;
  errorMessage: string;
  walletAddress: string;
}

export function useWalletCreation() {
  const [state, setState] = useState<WalletCreationState>({
    step: "welcome",
    phone: "",
    errorMessage: "",
    walletAddress: "",
  });

  const goTo = useCallback((step: WalletCreationStep) => {
    setState((prev) => ({ ...prev, step, errorMessage: "" }));
  }, []);

  const setPhone = useCallback((phone: string) => {
    setState((prev) => ({ ...prev, phone }));
  }, []);

  const setError = useCallback((errorMessage: string) => {
    setState((prev) => ({ ...prev, step: "error", errorMessage }));
  }, []);

  // Gửi OTP đến số điện thoại
  const sendOtp = useCallback(async () => {
    // TODO: Replace with real Supabase Auth OTP
    await new Promise((r) => setTimeout(r, 1000));
    return true;
  }, []);

  // Xác thực OTP
  const verifyOtp = useCallback(async (_code: string) => {
    // TODO: Replace with real Supabase Auth verify
    await new Promise((r) => setTimeout(r, 1500));
    return true;
  }, []);

  // Tạo passkey (WebAuthn) + gọi Circle API để tạo ví
  const createWallet = useCallback(async () => {
    setState((prev) => ({ ...prev, step: "creating" }));

    try {
      // Bước 1: Tạo passkey trên thiết bị (WebAuthn)
      // TODO: Replace with real WebAuthn + Circle Modular Wallets API
      const credential = await simulatePasskeyCreation();
      if (!credential) {
        throw new Error("Passkey creation cancelled or failed");
      }

      // Bước 2: Gọi Circle API để tạo Modular Wallet
      // TODO: Replace with real Circle API call
      // POST https://api.circle.com/v1/w3s/wallets
      // Headers: { Authorization: "Bearer <API_KEY>" }
      // Body: { 
      //   blockchains: ["ARC-TESTNET"],
      //   count: 1,
      //   userId: <user_id>,
      //   passkeyCredentialId: credential.id
      // }
      await new Promise((r) => setTimeout(r, 2000));

      const mockAddress = "0x" + Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");

      setState((prev) => ({
        ...prev,
        step: "success",
        walletAddress: mockAddress,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create wallet";
      setError(message);
    }
  }, [setError]);

  const reset = useCallback(() => {
    setState({
      step: "welcome",
      phone: "",
      errorMessage: "",
      walletAddress: "",
    });
  }, []);

  return { state, goTo, setPhone, sendOtp, verifyOtp, createWallet, setError, reset };
}

// Mock WebAuthn passkey creation (for Phase 1 demo)
async function simulatePasskeyCreation(): Promise<{ id: string } | null> {
  // Check if WebAuthn is available
  if (!window.PublicKeyCredential) {
    // Fallback for browsers that don't support WebAuthn
    return { id: "mock-passkey-id-" + Date.now() };
  }

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "SmartVault" },
        user: {
          id: new Uint8Array(16),
          name: "user@smartvault.app",
          displayName: "SmartVault User",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
      },
    });

    if (!credential) return null;
    return { id: credential.id };
  } catch (err) {
    // User cancelled or WebAuthn failed
    console.warn("Passkey creation cancelled or failed:", err);
    return null;
  }
}
