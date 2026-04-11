"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Mail,
  MessageCircle,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { exportDashboardPDF } from "@/lib/exportUtils";

type Trend = "up" | "down" | "neutral";

interface KPIResult {
  value: number;
  change: number;
  trend: Trend;
}

interface FunnelItem {
  stage: string;
  count: number;
}

interface ChannelItem {
  canal: string;
  count: number;
}

interface WeeklyActivityItem {
  date: string;
  dayName: string;
  canal: string;
  count: number;
}

interface ConversionRateItem {
  month: string;
  total: number;
  won: number;
  rate: number;
}

interface DashboardData {
  kpis: {
    activeContacts: KPIResult;
    whatsappSent: KPIResult;
    emailsSent: KPIResult;
    responseRate: KPIResult;
  };
  charts: {
    funnel: FunnelItem[];
    channels: ChannelItem[];
    weeklyActivity: WeeklyActivityItem[];
    conversionRate: ConversionRateItem[];
  };
}

const defaultKPIs = {
  activeContacts: { value: 0, change: 0, trend: "neutral" as Trend },
  whatsappSent: { value: 0, change: 0, trend: "neutral" as Trend },
  emailsSent: { value: 0, change: 0, trend: "neutral" as Trend },
  responseRate: { value: 0, change: 0, trend: "neutral" as Trend },
};

const defaultCharts = {
  funnel: [
    { stage: "new", count: 0 },
    { stage: "contacted", count: 0 },
    { stage: "qualified", count: 0 },
    { stage: "proposal", count: 0 },
    { stage: "won", count: 0 },
    { stage: "lost", count: 0 },
  ],
  channels: [
    { canal: "whatsapp", count: 0 },
    { canal: "email", count: 0 },
    { canal: "sms", count: 0 },
  ],
  weeklyActivity: [],
  conversionRate: [],
};

const stageLabels: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  proposal: "Propuesta",
  won: "Ganado",
  lost: "Perdido",
};

const canalLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  sms: "SMS",
};

const pieColors = ["hsl(142,70%,45%)", "hsl(217,91%,60%)", "hsl(215,20%,75%)"];

function ChartFrame({
  height,
  children,
}: {
  height: number;
  children: (size: { width: number; height: number }) => ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      setWidth(Math.max(0, Math.floor(container.clientWidth)));
    };

    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full min-w-0" style={{ height }}>
      {width > 0 ? children({ width, height }) : null}
    </div>
  );
}

const KPI_ICONS = {
  activeContacts: Users,
  whatsappSent: MessageCircle,
  emailsSent: Mail,
  responseRate: TrendingUp,
};

const KPI_LABELS = {
  activeContacts: "Contactos activos",
  whatsappSent: "Mensajes enviados",
  emailsSent: "Emails enviados",
  responseRate: "Tasa de respuesta",
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(true);
        setData({
          kpis: defaultKPIs,
          charts: defaultCharts,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const kpis = data
    ? [
        { key: "activeContacts" as const, ...data.kpis.activeContacts },
        { key: "whatsappSent" as const, ...data.kpis.whatsappSent },
        { key: "emailsSent" as const, ...data.kpis.emailsSent },
        { key: "responseRate" as const, ...data.kpis.responseRate },
      ]
    : [];

  const funnelData = data?.charts.funnel.map((item) => ({
    name: stageLabels[item.stage] || item.stage,
    value: item.count,
  })) || [];

  const pieData = data?.charts.channels.map((item) => ({
    name: canalLabels[item.canal] || item.canal,
    value: item.count,
  })) || [];

  const weeklyData = (() => {
    if (!data?.charts.weeklyActivity.length) return [];
    const days = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    const result: Record<string, { day: string; mensajes: number; emails: number }> = {};
    for (const item of data.charts.weeklyActivity) {
      if (!result[item.dayName]) {
        result[item.dayName] = { day: item.dayName, mensajes: 0, emails: 0 };
      }
      if (item.canal === "whatsapp") result[item.dayName].mensajes = item.count;
      if (item.canal === "email") result[item.dayName].emails = item.count;
    }
    return Object.values(result);
  })();

  const conversionData = data?.charts.conversionRate.map((item) => ({
    month: item.month,
    rate: item.rate,
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Resumen de actividad y metricas clave</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportDashboardPDF}>
          <FileText className="mr-1.5 h-4 w-4" />
          Exportar reporte
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = KPI_ICONS[kpi.key];
          const label = KPI_LABELS[kpi.key];
          const changeStr = kpi.change >= 0 ? `+${kpi.change}%` : `${kpi.change}%`;
          const isUp = kpi.trend === "up";

          return (
            <div key={kpi.key} className="kpi-card">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{kpi.value}</span>
                <span className={`flex items-center text-xs font-medium ${isUp ? "text-primary" : kpi.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                  {kpi.trend !== "neutral" && (
                    isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />
                  )}
                  {changeStr}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="kpi-card min-h-[280px] overflow-hidden lg:col-span-2">
          <h3 className="mb-4 font-semibold">Embudo de ventas</h3>
          <ChartFrame height={240}>
            {({ width, height }) => (
              <BarChart width={width} height={height} data={funnelData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(160,84%,39%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ChartFrame>
        </div>

        <div className="kpi-card min-h-[280px] overflow-hidden">
          <h3 className="mb-4 font-semibold">Canales de comunicacion</h3>
          <ChartFrame height={200}>
            {({ width, height }) => (
              <PieChart width={width} height={height}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={4}
                  nameKey="name"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </ChartFrame>
          <div className="mt-2 flex justify-center gap-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[index] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="kpi-card min-h-[260px] overflow-hidden">
          <h3 className="mb-4 font-semibold">Actividad semanal</h3>
          <ChartFrame height={220}>
            {({ width, height }) => (
              <BarChart width={width} height={height} data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="mensajes" fill="hsl(142,70%,45%)" radius={[4, 4, 0, 0]} name="WhatsApp" />
                <Bar dataKey="emails" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} name="Email" />
              </BarChart>
            )}
          </ChartFrame>
        </div>

        <div className="kpi-card min-h-[260px] overflow-hidden">
          <h3 className="mb-4 font-semibold">Tasa de conversion</h3>
          <ChartFrame height={220}>
            {({ width, height }) => (
              <LineChart width={width} height={height} data={conversionData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(160,84%,39%)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "hsl(160,84%,39%)" }}
                  name="Tasa %"
                />
              </LineChart>
            )}
          </ChartFrame>
        </div>
      </div>
    </div>
  );
}
