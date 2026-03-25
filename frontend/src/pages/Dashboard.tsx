import { Users, MessageCircle, Mail, TrendingUp, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { contacts, stageLabels, type FunnelStage } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { exportDashboardPDF } from "@/lib/exportUtils";

const kpis = [
  { label: "Contactos activos", value: "124", change: "+12%", up: true, icon: Users },
  { label: "Mensajes enviados", value: "847", change: "+23%", up: true, icon: MessageCircle },
  { label: "Emails enviados", value: "356", change: "+8%", up: true, icon: Mail },
  { label: "Tasa de respuesta", value: "68%", change: "-2%", up: false, icon: TrendingUp },
];

const funnelData = (["new", "contacted", "qualified", "proposal", "won", "lost"] as FunnelStage[]).map((stage) => ({
  name: stageLabels[stage],
  value: contacts.filter((c) => c.stage === stage).length * 15 + Math.floor(Math.random() * 20),
}));

const weeklyData = [
  { day: "Lun", mensajes: 42, emails: 18 },
  { day: "Mar", mensajes: 55, emails: 24 },
  { day: "Mié", mensajes: 38, emails: 15 },
  { day: "Jue", mensajes: 67, emails: 32 },
  { day: "Vie", mensajes: 51, emails: 28 },
  { day: "Sáb", mensajes: 23, emails: 8 },
  { day: "Dom", mensajes: 12, emails: 5 },
];

const pieData = [
  { name: "WhatsApp", value: 60 },
  { name: "Email", value: 30 },
  { name: "Otro", value: 10 },
];

const PIE_COLORS = ["hsl(142,70%,45%)", "hsl(217,91%,60%)", "hsl(215,20%,75%)"];

const conversionData = [
  { month: "Oct", rate: 52 },
  { month: "Nov", rate: 58 },
  { month: "Dic", rate: 55 },
  { month: "Ene", rate: 63 },
  { month: "Feb", rate: 61 },
  { month: "Mar", rate: 68 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Resumen de actividad y métricas clave</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportDashboardPDF}>
          <FileText className="w-4 h-4 mr-1.5" />
          Exportar reporte
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground text-sm">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">{kpi.value}</span>
              <span className={`flex items-center text-xs font-medium ${kpi.up ? "text-primary" : "text-destructive"}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funnel */}
        <div className="kpi-card lg:col-span-2">
          <h3 className="font-semibold mb-4">Embudo de ventas</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={funnelData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(160,84%,39%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Channels pie */}
        <div className="kpi-card">
          <h3 className="font-semibold mb-4">Canales de comunicación</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={4}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly activity */}
        <div className="kpi-card">
          <h3 className="font-semibold mb-4">Actividad semanal</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="mensajes" fill="hsl(142,70%,45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emails" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion rate */}
        <div className="kpi-card">
          <h3 className="font-semibold mb-4">Tasa de conversión</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={conversionData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[40, 80]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="hsl(160,84%,39%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(160,84%,39%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
