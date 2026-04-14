import { useState } from "react";
import SellGasCalc from "@/components/SellGasCalc";
import OilEarningsCalc from "@/components/OilEarningsCalc";
import TimeToOilCalc from "@/components/TimeToOilCalc";
import BuyTimeCalc from "@/components/BuyTimeCalc";
import LayoutDesigner from "@/components/LayoutDesigner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { parseAmount, formatNumber } from "@/lib/parsers";

type Tab = "sellgas" | "oilearnings" | "timetooil" | "buytime" | "layout";

const tabs: { id: Tab; label: string; icon: string; description: string }[] = [
  { id: "sellgas", label: "Sell Gas", icon: "⛽", description: "Gas Earnings" },
  { id: "oilearnings", label: "Oil Earnings", icon: "🛢", description: "Oil Generation" },
  { id: "timetooil", label: "Time to Oil", icon: "⏱", description: "Time to oil" },
  { id: "buytime", label: "Buy Time", icon: "⚙", description: "Buy to time" },
  { id: "layout", label: "Layout", icon: "🔲", description: "Layout Designer" },
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
        filter: "blur(1px)",
      }}
    />
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
        <span className="text-white font-bold text-xs font-mono">DW</span>
      </div>

      <h1 className="text-lg font-bold tracking-tight">
        <span className="text-red-500">DRILL</span>
        <span className="text-white">X</span>
      </h1>
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

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      <ParticleOrb x={10} y={15} size={200} delay={0} />
      <ParticleOrb x={85} y={70} size={160} delay={1.2} />
      <ParticleOrb x={50} y={5} size={120} delay={0.7} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">

        {/* 🔥 MINIMAL HEADER */}
        <header className="flex items-center justify-between mb-6">
          <Logo />

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>LIVE</span>
          </div>
        </header>

        {/* Tabs */}
        <nav className="card-glass rounded-xl p-1.5 mb-5">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`px-2 py-2.5 rounded-lg transition-all text-left ${
                  activeTab === tab.id
                    ? "bg-red-950/50 border border-red-800/60"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-red-400 truncate">
                    {tab.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {tab.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Main panel */}
        <main
          className={`card-glass rounded-xl p-6 transition-opacity duration-150 ${
            transitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-red-900/30">
            <div className="text-lg">{activeTabData.icon}</div>
            <div>
              <h2 className="text-sm font-bold text-red-400">
                {activeTabData.label}
              </h2>
              <p className="text-xs text-muted-foreground">
                {activeTabData.description}
              </p>
            </div>
          </div>

          {activeTab === "sellgas" && <SellGasCalc />}
          {activeTab === "oilearnings" && <OilEarningsCalc />}
          {activeTab === "timetooil" && <TimeToOilCalc />}
          {activeTab === "buytime" && <BuyTimeCalc />}
          {activeTab === "layout" && <LayoutDesigner />}
        </main>

        {/* Input reference */}
        {activeTab !== "layout" && (
          <div className="mt-5 card-glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase mb-3">
              Input Reference
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Amounts", examples: "1k · 1m · 1b · 2.5b" },
                { label: "Percent", examples: "20% · 0.20 · 150%" },
                { label: "Time", examples: "1h · 30m · 1h 30m" },
                { label: "Mixed", examples: "1.5m · 500k · 10b" },
              ].map((item) => (
                <div key={item.label} className="bg-black/20 rounded-lg p-3">
                  <p className="text-xs text-red-300/70 mb-1">
                    {item.label}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {item.examples}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-5 text-center">
          <p className="text-xs text-muted-foreground/30 font-mono">
            DRILLX · v1.1
          </p>
        </footer>
      </div>
    </div>
  );
}
