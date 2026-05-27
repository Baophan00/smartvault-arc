"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  fromNetwork: string;
  fromAddress: string;
  toLabel: string;
  toValue: string;
  amount: string;
  token: string;
  fee: string;
  extraInfo?: { label: string; value: string }[];
  isLoading: boolean;
  loadingLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function truncateAddr(addr: string, chars = 6) {
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}

export default function ConfirmModal({
  isOpen,
  title,
  fromNetwork,
  fromAddress,
  toLabel,
  toValue,
  amount,
  token,
  fee,
  extraInfo,
  isLoading,
  loadingLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-sm bg-[#111620] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#1e2640] max-h-[90vh] overflow-y-auto animate-slide-up arc-glow p-6 space-y-6">
        {/* Close */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-[#141a24] flex items-center justify-center text-[#7a8599] hover:text-[#acc6e9] disabled:opacity-30 transition-all border border-[#1e2640]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="text-center pt-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#2f578c]/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#acc6e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mt-3" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            {title}
          </h2>
          <p className="text-sm text-[#7a8599] mt-1">
            Please review before confirming
          </p>
        </div>

        {/* Transaction details */}
        <div className="bg-[#0a0d14] rounded-xl border border-[#1e2640] divide-y divide-[#1e2640]">
          {/* Amount */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-xs text-[#7a8599]">Amount</span>
            <span className="text-sm font-medium" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {amount} <span className="text-[#acc6e9]">{token}</span>
            </span>
          </div>

          {/* From */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-[#7a8599]">From</span>
            <span className="text-xs text-right">
              <span className="text-[#acc6e9]">{fromNetwork}</span>
              <br />
              <span className="font-mono text-[10px] text-[#7a8599]">{truncateAddr(fromAddress)}</span>
            </span>
          </div>

          {/* To */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-[#7a8599]">{toLabel}</span>
            {toValue.startsWith("0x") ? (
              <span className="text-xs font-mono text-[#acc6e9] text-right">{truncateAddr(toValue)}</span>
            ) : (
              <span className="text-xs text-[#acc6e9] text-right">{toValue}</span>
            )}
          </div>

          {/* Fee */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-[#7a8599]">Network fee</span>
            <span className="text-xs font-medium text-[#9F72FF]">{fee}</span>
          </div>

          {/* Extra info */}
          {extraInfo?.map((info, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-[#7a8599]">{info.label}</span>
              <span className="text-xs text-[#acc6e9] text-right">{info.value}</span>
            </div>
          ))}
        </div>

        {/* Security note */}
        <div className="bg-[#141a24] rounded-xl border border-[#702718]/30 p-3">
          <p className="text-[10px] text-[#e9a13f] flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            This transaction is signed by your private key in-browser. It never leaves your device.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-2xl bg-[#141a24] hover:bg-[#1e2640] text-[#7a8599] font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-[#1e2640]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-[#2f578c]/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#acc6e9]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {loadingLabel || "Confirming..."}
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
