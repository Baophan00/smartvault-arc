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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      ),
      onClick: onSend,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Receive",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      ),
      onClick: () => {},
      color: "bg-green-500/10 text-green-500",
    },
    {
      label: "Bridge",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
      onClick: () => {},
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      label: "Swap",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      ),
      onClick: () => {},
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex justify-around">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            disabled={!isConnected}
            className="flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${action.color}`}>
              {action.icon}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
