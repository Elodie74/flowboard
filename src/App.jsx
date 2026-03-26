import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ─── DEMO DATA ───────────────────────────────────────────────────────────────

const WEEKS = ["S1 Jan", "S2 Jan", "S3 Jan", "S4 Jan", "S1 Fév", "S2 Fév"];
const MONTHS = ["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"];

const demoData = {
  week: {
    sales: [
      { values: [12400, 11800, 13200, 14500, 13800, 15200], label: "Chiffre d'affaires", unit: "€", icon: "💶" },
      { values: [186, 174, 198, 218, 207, 228], label: "Commandes", unit: "", icon: "📦" },
      { values: [66.7, 67.8, 66.7, 66.5, 66.7, 66.7], label: "Panier moyen", unit: "€", icon: "🛒" },
      { values: [2.8, 3.1, 2.6, 2.4, 2.7, 2.3], label: "Taux d'abandon", unit: "%", icon: "🚪", invert: true },
      { values: [34, 28, 41, 38, 45, 52], label: "Nouveaux clients", unit: "", icon: "👤" },
      { values: [4.2, 4.1, 4.3, 4.5, 4.4, 4.6], label: "Note moyenne", unit: "/5", icon: "⭐" },
    ],
    pub: [
      { values: [1200, 1350, 1100, 1450, 1380, 1520], label: "Dépenses pub", unit: "€", icon: "💸", invert: true },
      { values: [10.3, 8.7, 12.0, 10.0, 10.0, 10.0], label: "ROAS", unit: "x", icon: "📈" },
      { values: [0.82, 0.95, 0.74, 0.68, 0.71, 0.63], label: "CPA", unit: "€", icon: "🎯" },
      { values: [48200, 52100, 45800, 56300, 53200, 58900], label: "Impressions", unit: "", icon: "👁️" },
      { values: [3.2, 2.9, 3.5, 3.8, 3.4, 4.1], label: "CTR", unit: "%", icon: "🖱️" },
      { values: [1542, 1511, 1603, 2139, 1809, 2415], label: "Clics", unit: "", icon: "👆" },
    ],
    social: [
      { values: [12400, 12650, 12890, 13200, 13580, 14020], label: "Abonnés", unit: "", icon: "👥" },
      { values: [4.2, 3.8, 4.5, 5.1, 4.8, 5.4], label: "Taux engagement", unit: "%", icon: "💬" },
      { values: [8, 7, 9, 10, 8, 11], label: "Posts publiés", unit: "", icon: "📝" },
      { values: [3200, 2800, 3600, 4100, 3800, 4500], label: "Portée organique", unit: "", icon: "📡" },
      { values: [145, 132, 168, 189, 174, 210], label: "Partages", unit: "", icon: "🔄" },
      { values: [89, 76, 94, 112, 98, 125], label: "Messages reçus", unit: "", icon: "💌" },
    ],
    email: [
      { values: [2, 3, 2, 3, 2, 4], label: "Campagnes envoyées", unit: "", icon: "📨" },
      { values: [42.1, 38.5, 44.2, 41.8, 45.6, 43.2], label: "Taux ouverture", unit: "%", icon: "📬" },
      { values: [3.8, 3.2, 4.1, 3.9, 4.5, 4.2], label: "Taux de clic", unit: "%", icon: "🖱️" },
      { values: [8450, 8620, 8780, 8950, 9120, 9340], label: "Liste abonnés", unit: "", icon: "📋" },
      { values: [0.3, 0.4, 0.2, 0.3, 0.2, 0.1], label: "Désabonnements", unit: "%", icon: "📉", invert: true },
      { values: [1840, 2100, 1950, 2350, 2180, 2680], label: "Revenus email", unit: "€", icon: "💰" },
    ],
    launch: [
      { values: [0, 0, 1, 0, 0, 1], label: "Lancements", unit: "", icon: "🎉" },
      { values: [0, 0, 245, 0, 0, 312], label: "Pré-inscriptions", unit: "", icon: "✍️" },
      { values: [0, 0, 3200, 0, 0, 4800], label: "Revenu lancement", unit: "€", icon: "💎" },
      { values: [0, 0, 68, 0, 0, 74], label: "Taux conversion", unit: "%", icon: "🏆" },
      { values: [0, 0, 4.8, 0, 0, 4.9], label: "Score satisfaction", unit: "/5", icon: "😊" },
      { values: [0, 0, 12, 0, 0, 8], label: "Remboursements", unit: "", icon: "↩️", invert: true },
    ],
  },
  month: {
    sales: [
      { values: [48200, 51400, 54800, 52100, 56400, 61200], label: "Chiffre d'affaires", unit: "€", icon: "💶" },
      { values: [724, 772, 822, 782, 846, 918], label: "Commandes", unit: "", icon: "📦" },
      { values: [66.6, 66.6, 66.7, 66.6, 66.7, 66.7], label: "Panier moyen", unit: "€", icon: "🛒" },
      { values: [3.1, 2.9, 2.7, 2.8, 2.5, 2.3], label: "Taux d'abandon", unit: "%", icon: "🚪", invert: true },
      { values: [124, 138, 156, 142, 168, 185], label: "Nouveaux clients", unit: "", icon: "👤" },
      { values: [4.1, 4.2, 4.3, 4.2, 4.4, 4.5], label: "Note moyenne", unit: "/5", icon: "⭐" },
    ],
    pub: [
      { values: [4800, 5200, 5600, 5100, 5500, 6100], label: "Dépenses pub", unit: "€", icon: "💸", invert: true },
      { values: [10.0, 9.9, 9.8, 10.2, 10.3, 10.0], label: "ROAS", unit: "x", icon: "📈" },
      { values: [0.88, 0.82, 0.78, 0.84, 0.76, 0.72], label: "CPA", unit: "€", icon: "🎯" },
      { values: [192000, 208000, 224000, 204000, 220000, 245000], label: "Impressions", unit: "", icon: "👁️" },
      { values: [3.1, 3.3, 3.4, 3.2, 3.5, 3.8], label: "CTR", unit: "%", icon: "🖱️" },
      { values: [5952, 6864, 7616, 6528, 7700, 9310], label: "Clics", unit: "", icon: "👆" },
    ],
    social: [
      { values: [10200, 10800, 11400, 12100, 12900, 14020], label: "Abonnés", unit: "", icon: "👥" },
      { values: [3.8, 4.0, 4.2, 4.5, 4.7, 5.1], label: "Taux engagement", unit: "%", icon: "💬" },
      { values: [30, 28, 34, 36, 32, 38], label: "Posts publiés", unit: "", icon: "📝" },
      { values: [11200, 12400, 13800, 14600, 15200, 17400], label: "Portée organique", unit: "", icon: "📡" },
      { values: [520, 580, 640, 710, 760, 850], label: "Partages", unit: "", icon: "🔄" },
      { values: [320, 350, 380, 420, 440, 490], label: "Messages reçus", unit: "", icon: "💌" },
    ],
    email: [
      { values: [8, 10, 9, 12, 10, 14], label: "Campagnes envoyées", unit: "", icon: "📨" },
      { values: [40.2, 41.5, 42.8, 40.9, 43.6, 44.1], label: "Taux ouverture", unit: "%", icon: "📬" },
      { values: [3.5, 3.7, 3.9, 3.6, 4.2, 4.4], label: "Taux de clic", unit: "%", icon: "🖱️" },
      { values: [7800, 8100, 8400, 8700, 9000, 9340], label: "Liste abonnés", unit: "", icon: "📋" },
      { values: [0.4, 0.3, 0.3, 0.3, 0.2, 0.2], label: "Désabonnements", unit: "%", icon: "📉", invert: true },
      { values: [6800, 7400, 8100, 7600, 8800, 9600], label: "Revenus email", unit: "€", icon: "💰" },
    ],
    launch: [
      { values: [1, 0, 1, 0, 2, 1], label: "Lancements", unit: "", icon: "🎉" },
      { values: [180, 0, 245, 0, 520, 312], label: "Pré-inscriptions", unit: "", icon: "✍️" },
      { values: [8400, 0, 12600, 0, 24800, 18200], label: "Revenu lancement", unit: "€", icon: "💎" },
      { values: [62, 0, 68, 0, 72, 74], label: "Taux conversion", unit: "%", icon: "🏆" },
      { values: [4.6, 0, 4.8, 0, 4.7, 4.9], label: "Score satisfaction", unit: "/5", icon: "😊" },
      { values: [14, 0, 12, 0, 18, 8], label: "Remboursements", unit: "", icon: "↩️", invert: true },
    ],
  },
};

// ─── TABS ────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "sales", emoji: "💰", label: "Ventes" },
  { key: "pub", emoji: "📣", label: "Pub" },
  { key: "social", emoji: "📱", label: "Réseaux" },
  { key: "email", emoji: "📧", label: "Emails" },
  { key: "launch", emoji: "🚀", label: "Lancements" },
  { key: "ai", emoji: "🤖", label: "IA" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function fmt(v, unit) {
  if (v >= 100000) return (v / 1000).toFixed(0) + "k";
  if (v >= 10000) return (v / 1000).toFixed(1) + "k";
  if (unit === "€" && v >= 1000) return (v / 1000).toFixed(1) + "k€";
  if (Number.isInteger(v)) return v.toLocaleString("fr-FR");
  return v.toFixed(1);
}

function trendPct(curr, prev) {
  if (!prev || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev)) * 100;
}

function computeHealthScore(data, period) {
  const tabKeys = ["sales", "pub", "social", "email"];
  let totalScore = 0;
  let count = 0;
  tabKeys.forEach((tabKey) => {
    const kpis = data[period][tabKey];
    kpis.forEach((kpi) => {
      const last = kpi.values[kpi.values.length - 1];
      const prev = kpi.values[kpi.values.length - 2];
      if (prev && prev !== 0) {
        let change = ((last - prev) / Math.abs(prev)) * 100;
        if (kpi.invert) change = -change;
        totalScore += Math.min(Math.max(change * 5 + 50, 0), 100);
        count++;
      }
    });
  });
  return count > 0 ? Math.round(totalScore / count) : 50;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #07090F;
  --card: #0D1120;
  --card-border: #161D30;
  --accent: #C8F464;
  --accent-dim: #C8F46430;
  --text: #E8ECF4;
  --text-dim: #6B7A99;
  --red: #FF6B6B;
  --red-dim: #FF6B6B25;
  --green: #4ADE80;
  --green-dim: #4ADE8025;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.app {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background: var(--bg);
}

/* ── Header ── */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg) 85%, transparent 100%);
  padding: 16px 16px 20px;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.health-ring {
  position: relative;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.health-ring svg {
  width: 52px;
  height: 52px;
  transform: rotate(-90deg);
}

.health-ring .track {
  fill: none;
  stroke: var(--card-border);
  stroke-width: 4;
}

.health-ring .progress {
  fill: none;
  stroke: var(--accent);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 6px var(--accent-dim));
}

.health-score {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 500;
  color: var(--accent);
}

.header-info {
  flex: 1;
  min-width: 0;
}

.client-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.3px;
}

.client-sub {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 2px;
  font-weight: 400;
}

.period-toggle {
  display: flex;
  background: var(--card);
  border-radius: 10px;
  padding: 3px;
  border: 1px solid var(--card-border);
}

.period-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-dim);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}

.period-btn.active {
  background: var(--accent);
  color: #07090F;
  font-weight: 600;
}

/* ── Period Nav ── */
.period-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 12px;
}

.nav-arrow {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--card-border);
  background: var(--card);
  color: var(--text-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.nav-arrow:hover { border-color: var(--accent); color: var(--accent); }
.nav-arrow:disabled { opacity: 0.3; cursor: default; }
.nav-arrow:disabled:hover { border-color: var(--card-border); color: var(--text-dim); }

.period-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.5px;
}

/* ── Tabs ── */
.tabs {
  display: flex;
  gap: 2px;
  padding: 0 16px;
  margin-bottom: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tabs::-webkit-scrollbar { display: none; }

.tab {
  flex: 1;
  min-width: 56px;
  padding: 10px 4px 8px;
  border: none;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.25s;
  position: relative;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2.5px;
  border-radius: 2px;
  background: var(--accent);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab.active::after { transform: translateX(-50%) scaleX(1); }

.tab-emoji {
  font-size: 18px;
  line-height: 1;
  transition: transform 0.2s;
}

.tab.active .tab-emoji { transform: scale(1.15); }

.tab-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-dim);
  font-family: 'DM Sans', sans-serif;
  transition: color 0.25s;
}

.tab.active .tab-label { color: var(--accent); }

/* ── KPI Cards ── */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.kpi-card {
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 14px;
  padding: 14px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.2s;
  animation: cardIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.kpi-card:hover { border-color: var(--accent-dim); }

.kpi-card .card-icon {
  font-size: 20px;
  margin-bottom: 8px;
  display: block;
}

.kpi-card .card-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.kpi-card .card-unit {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-dim);
  margin-left: 2px;
}

.kpi-card .card-label {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 6px;
  font-weight: 400;
  line-height: 1.3;
}

.kpi-card .card-trend {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 7px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.trend-up { color: var(--green); background: var(--green-dim); }
.trend-down { color: var(--red); background: var(--red-dim); }

/* ── Chart Section ── */
.chart-section {
  padding: 0 16px 24px;
  animation: cardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.chart-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-dim);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.chart-title::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-dim);
}

.chart-wrap {
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 16px 8px 8px 0;
}

.custom-tooltip {
  background: #151B2E;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 10px 14px;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.custom-tooltip .tt-label {
  font-size: 11px;
  color: var(--text-dim);
  margin-bottom: 4px;
}

.custom-tooltip .tt-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  color: var(--accent);
}

/* ── AI Tab ── */
.ai-section {
  padding: 0 16px 40px;
  animation: cardIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.ai-card {
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 18px;
  padding: 24px 20px;
  text-align: center;
}

.ai-card .ai-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.ai-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.ai-card p {
  font-size: 13px;
  color: var(--text-dim);
  line-height: 1.5;
  margin-bottom: 20px;
}

.ai-btn {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  background: var(--accent);
  color: #07090F;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: -0.2px;
}

.ai-btn:hover { filter: brightness(1.1); transform: scale(1.02); }
.ai-btn:active { transform: scale(0.98); }

.ai-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.ai-btn.loading {
  background: var(--card-border);
  color: var(--text-dim);
}

.ai-result {
  margin-top: 20px;
  text-align: left;
  background: #0A0E1A;
  border: 1px solid var(--card-border);
  border-radius: 14px;
  padding: 18px;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text);
  white-space: pre-wrap;
  max-height: 420px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--card-border) transparent;
}

.ai-result::-webkit-scrollbar { width: 4px; }
.ai-result::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 4px; }

.ai-result strong { color: var(--accent); font-weight: 600; }

.ai-error {
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--red-dim);
  border: 1px solid #FF6B6B40;
  border-radius: 10px;
  color: var(--red);
  font-size: 13px;
  text-align: left;
}

.loading-dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
}

/* ── Bottom Spacer ── */
.spacer { height: 24px; }

/* ── Glow accents ── */
.glow-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-dim), transparent);
  margin: 0 0 12px;
}
`;

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tt-label">{label}</div>
      <div className="tt-value">{payload[0].value?.toLocaleString("fr-FR")}</div>
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function FlowBoard() {
  const [period, setPeriod] = useState("week");
  const [periodIndex, setPeriodIndex] = useState(5);
  const [activeTab, setActiveTab] = useState("sales");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const styleRef = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const s = document.createElement("style");
      s.textContent = CSS;
      document.head.appendChild(s);
      styleRef.current = s;
    }
  }, []);

  // Reset period index when switching period type
  useEffect(() => {
    setPeriodIndex(5);
  }, [period]);

  const labels = period === "week" ? WEEKS : MONTHS;
  const healthScore = computeHealthScore(demoData, period);
  const circ = 2 * Math.PI * 22;
  const healthOffset = circ - (circ * healthScore) / 100;

  // ── KPI Tab rendering
  const renderKPITab = () => {
    const kpis = demoData[period][activeTab];
    if (!kpis) return null;

    const chartData = labels.map((l, i) => ({ name: l, value: kpis[0].values[i] }));

    return (
      <>
        <div className="cards-grid">
          {kpis.map((kpi, idx) => {
            const curr = kpi.values[periodIndex];
            const prev = periodIndex > 0 ? kpi.values[periodIndex - 1] : null;
            let trend = trendPct(curr, prev);
            const isGood = kpi.invert ? (trend !== null && trend <= 0) : (trend !== null && trend >= 0);

            return (
              <div
                className="kpi-card"
                key={idx}
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <span className="card-icon">{kpi.icon}</span>
                <span className="card-value">
                  {fmt(curr, kpi.unit)}
                  {kpi.unit && <span className="card-unit">{kpi.unit === "€" ? "" : kpi.unit}</span>}
                </span>
                <div className="card-label">{kpi.label}</div>
                {trend !== null && (
                  <span className={`card-trend ${isGood ? "trend-up" : "trend-down"}`}>
                    {isGood ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="chart-section">
          <div className="chart-title">{kpis[0].label} — Évolution</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8F464" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C8F464" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7A99", fontSize: 11, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6B7A99", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  tickFormatter={(v) => (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#C8F464"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#C8F464", stroke: "#07090F", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    );
  };

  // ── AI Tab
  const handleAnalyze = async () => {
    setAiLoading(true);
    setAiError("");
    setAiResult("");

    // Build a summary of all current data for the prompt
    const summaryParts = [];
    ["sales", "pub", "social", "email", "launch"].forEach((tabKey) => {
      const kpis = demoData[period][tabKey];
      const tabLabel = TABS.find((t) => t.key === tabKey)?.label || tabKey;
      summaryParts.push(`\n## ${tabLabel}`);
      kpis.forEach((kpi) => {
        const curr = kpi.values[kpi.values.length - 1];
        const prev = kpi.values[kpi.values.length - 2];
        const trend = prev ? (((curr - prev) / Math.abs(prev)) * 100).toFixed(1) : "N/A";
        summaryParts.push(`- ${kpi.label}: ${curr}${kpi.unit} (tendance: ${trend}%)`);
      });
    });

    const prompt = `Tu es un expert en e-commerce et marketing digital. Analyse ces KPI d'une boutique e-commerce (vue ${period === "week" ? "hebdomadaire" : "mensuelle"}, période la plus récente).

Données:
${summaryParts.join("\n")}

Donne une analyse structurée avec:
1. **Santé globale** (1-2 phrases)
2. **Points forts** (2-3 métriques qui performent bien)
3. **Points d'attention** (2-3 métriques à surveiller)
4. **Recommandations** (3 actions concrètes à prendre)

Sois concis, direct et actionnable. Utilise des emojis pour structurer. Réponds en français.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content
        ?.map((block) => (block.type === "text" ? block.text : ""))
        .filter(Boolean)
        .join("\n");

      setAiResult(text || "Aucune réponse reçue.");
    } catch (err) {
      setAiError(err.message || "Erreur de connexion à l'API Claude.");
    } finally {
      setAiLoading(false);
    }
  };

  const renderAITab = () => (
    <div className="ai-section">
      <div className="ai-card">
        <span className="ai-icon">🤖</span>
        <h3>Analyse IA</h3>
        <p>
          Claude va analyser vos KPI {period === "week" ? "hebdomadaires" : "mensuels"} et
          vous fournir des insights personnalisés avec des recommandations
          actionnables.
        </p>
        <button
          className={`ai-btn ${aiLoading ? "loading" : ""}`}
          onClick={handleAnalyze}
          disabled={aiLoading}
        >
          {aiLoading ? (
            <span>
              Analyse en cours<span className="loading-dots"></span>
            </span>
          ) : (
            "⚡ Analyser mes KPI"
          )}
        </button>
        {aiError && <div className="ai-error">⚠️ {aiError}</div>}
        {aiResult && (
          <div
            className="ai-result"
            dangerouslySetInnerHTML={{
              __html: aiResult
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n/g, "<br/>"),
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* ── Header ── */}
      <div className="header">
        <div className="header-top">
          <div className="health-ring">
            <svg viewBox="0 0 48 48">
              <circle className="track" cx="24" cy="24" r="22" />
              <circle
                className="progress"
                cx="24"
                cy="24"
                r="22"
                strokeDasharray={circ}
                strokeDashoffset={healthOffset}
              />
            </svg>
            <span className="health-score">{healthScore}</span>
          </div>
          <div className="header-info">
            <div className="client-name">Maison Soleil</div>
            <div className="client-sub">Boutique e-commerce · FlowBoard</div>
          </div>
          <div className="period-toggle">
            <button
              className={`period-btn ${period === "week" ? "active" : ""}`}
              onClick={() => setPeriod("week")}
            >
              Sem.
            </button>
            <button
              className={`period-btn ${period === "month" ? "active" : ""}`}
              onClick={() => setPeriod("month")}
            >
              Mois
            </button>
          </div>
        </div>
      </div>

      {/* ── Period Navigation ── */}
      <div className="period-nav">
        <button
          className="nav-arrow"
          disabled={periodIndex <= 0}
          onClick={() => setPeriodIndex((p) => Math.max(0, p - 1))}
        >
          ‹
        </button>
        <span className="period-label">
          {labels[periodIndex]}
          {periodIndex === labels.length - 1 && " · actuel"}
        </span>
        <button
          className="nav-arrow"
          disabled={periodIndex >= labels.length - 1}
          onClick={() => setPeriodIndex((p) => Math.min(labels.length - 1, p + 1))}
        >
          ›
        </button>
      </div>

      <div className="glow-line" />

      {/* ── Tabs ── */}
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="tab-emoji">{tab.emoji}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {activeTab === "ai" ? renderAITab() : renderKPITab()}

      <div className="spacer" />
    </div>
  );
}
