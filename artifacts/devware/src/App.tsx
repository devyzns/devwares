import { useState } from "react";
import SellGasCalc from "@/components/SellGasCalc";
import OilEarningsCalc from "@/components/OilEarningsCalc";
import TimeToOilCalc from "@/components/TimeToOilCalc";
import BuyTimeCalc from "@/components/BuyTimeCalc";
import LayoutDesigner from "@/components/LayoutDesigner";
import GasPriceWidget from "@/components/GasPriceWidget";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { parseAmount, formatNumber } from "@/lib/parsers";

type Tab = "sell gas" | "oil earnings" | "time to oil" | "buy time" | "layout";

const tabs: { id: Tab; label: string; icon: string; description: string }[] = [
  { id: "sellgas",     label: "Sell Gas",     icon: "⛽", description: "Gas Earnings" },
  { id: "oilearnings", label: "oil earnings", icon: "🛢", description: "Oil Generation" },
  { id: "timetooil",  label: "time to oil",   icon: "⏱", description: "How Long it Takes To Reach X oil" },
  { id: "buytime",    label: "buy time",     icon: "⚙", description: "How Long it Takes to Buy Something" },
  { id: "layout",     label: "/layout",      icon: "🔲", description: "Layout Designer" },
];

function ParticleOrb({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, hsla(0, 85%, 55%, 0.15), transparent)`,
        animation: `pulse-glow ${2 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: 'blur(1px)',
      }}
    />
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center glow-red-sm">
          <span className="text-white font-bold text-sm font-mono">DW</span>
        </div>
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-red-500 to-red-800 opacity-30 blur-sm -z-10" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-red-500 text-glow-red">DRILL</span>
          <span className="text-white"> X</span>
        </h1>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">For Oil Empire on roblox.</p>
      </div>
    </div>
  );
}

function TypewriterDone({ text }: { text: string }) {
  return <span className="font-mono">{text}</span>;
}

function SavedConfig() {
  const [rate, setRate] = useLocalStorage("devware_saved_rate", "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const parsed = parseAmount(rate);

  const save = () => {
    if (draft.trim()) setRate(draft.trim());
    setEditing(false);
  };

  return (
    <div className="card-glass rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-base shrink-0">
          💾
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Saved Rate (oil/s)</p>
          {editing ? (
            <input
              autoFocus
              className="input-dark px-2 py-1 rounded text-sm font-mono w-36 mt-0.5"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") setEditing(false);
              }}
              onBlur={save}
              placeholder="e.g. 500, 2.5k"
            />
          ) : (
            <button onClick={() => { setDraft(rate); setEditing(true); }} className="text-left group">
              {parsed !== null ? (
                <span className="text-lg font-bold font-mono text-red-400 group-hover:text-red-300 transition-colors">
                  {formatNumber(parsed)}<span className="text-sm text-muted-foreground">/s</span>
                </span>
              ) : (
                <span className="text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors font-mono">
                  Click to set rate...
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      {parsed !== null && !editing && (
        <div className="text-right">
          <p className="text-xs text-muted-foreground/40 font-mono">persists on reload</p>
          <button onClick={() => { setDraft(rate); setEditing(true); }} className="text-xs text-red-500/60 hover:text-red-400 transition-colors font-mono mt-0.5">
            edit
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("sellgas");
  const [transitioning, setTransitioning] = useState(false);

  const switchTab = (tab: Tab) => {
    if (tab === activeTab) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setTransitioning(false);
    }, 120);
  };

  const activeTabData = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      <ParticleOrb x={10} y={15} size={200} delay={0} />
      <ParticleOrb x={85} y={70} size={160} delay={1.2} />
      <ParticleOrb x={50} y={5} size={120} delay={0.7} />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>ONLINE</span>
            </div>
          </div>

          <div className="card-glass rounded-xl p-4 scanline mb-3">
            <p className="text-sm text-muted-foreground">
              <TypewriterDone text="Made With Love - devyzn" />
            </p>
          </div>

          {/* Gas price + saved rate row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GasPriceWidget />
            <SavedConfig />
          </div>
        </header>

        {/* Tabs */}
        <nav className="card-glass rounded-xl p-1.5 mb-5 animate-slide-up">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`
                  relative px-2 py-2.5 rounded-lg text-left transition-all duration-200 group
                  ${activeTab === tab.id
                    ? 'bg-red-950/50 border border-red-800/60 glow-red-sm'
                    : 'hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <div className="flex flex-col gap-0.5">
                  <span className={`text-xs font-mono font-bold truncate ${activeTab === tab.id ? 'text-red-400' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {tab.label}
                  </span>
                  <span className={`text-xs truncate ${activeTab === tab.id ? 'text-red-300/70' : 'text-muted-foreground/50'}`}>
                    {tab.description}
                  </span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Calculator panel */}
        <main className={`card-glass rounded-xl p-6 transition-opacity duration-120 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-900/30">
            <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-base">
              {activeTabData.icon}
            </div>
            <div>
              <h2 className="font-mono font-bold text-red-400 text-sm">{activeTabData.label}</h2>
              <p className="text-xs text-muted-foreground">{activeTabData.description}</p>
            </div>
          </div>

          {activeTab === "sellgas"     && <SellGasCalc />}
          {activeTab === "oilearnings" && <OilEarningsCalc />}
          {activeTab === "timetooil"   && <TimeToOilCalc />}
          {activeTab === "buytime"     && <BuyTimeCalc />}
          {activeTab === "layout"      && <LayoutDesigner />}
        </main>

        {/* Input reference */}
        {activeTab !== "layout" && (
          <div className="mt-5 card-glass rounded-xl p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Input Reference</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Amounts", examples: "1k · 1m · 1b · 2.5b" },
                { label: "Percent", examples: "20% · 0.20 · 150%" },
                { label: "Time",    examples: "1h · 30m · 1h 30m" },
                { label: "Mixed",   examples: "1.5m · 500k · 10b" },
              ].map(item => (
                <div key={item.label} className="bg-black/20 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-300/70 mb-1">{item.label}</p>
                  <p className="text-xs font-mono text-muted-foreground">{item.examples}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-5 text-center">
          <p className="text-xs text-muted-foreground/30 font-mono">DRILLX · Personal Tools · v1.1</p>
        </footer>
      </div>
    </div>
  );
}
