"use client";

interface QuickActionsProps {
  isConnected: boolean;
  onSend: () => void;
}

export default function QuickActions({ isConnected, onSend }: QuickActionsProps) {
  const actions = [
    {
      label: "Send",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      ),
      onClick: onSend,
      color: "bg-[#1b3158] text-[#acc6e9] group-hover:bg-[#2f578c]",
    },
    {
      label: "Receive",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      ),
      onClick: () => {},
      color: "bg-[#1b3158] text-[#acc6e9] group-hover:bg-[#2f578c]",
    },
    {
      label: "Bridge",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
      onClick: () => {},
      color: "bg-[#1b3158] text-[#acc6e9] group-hover:bg-[#2f578c]",
    },
    {
      label: "Swap",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      ),
      onClick: () => {},
      color: "bg-[#1b3158] text-[#acc6e9] group-hover:bg-[#2f578c]",
    },
  ];

  return (
    <div className="bg-[#111620] border border-[#1e2640] rounded-2xl p-4">
      <div className="flex justify-around">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            disabled={!isConnected}
            className="flex flex-col items-center gap-2 disabled:opacity-25 disabled:cursor-not-allowed group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${action.color}`}>
              {action.icon}
            </div>
            <span className="text-[11px] arc-label text-[#7a8599]">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
