import { contacts, stageLabels, type Contact } from "@/data/mockData";

export function exportContactsCSV(filteredContacts: Contact[]) {
  const headers = ["Nombre", "Email", "Teléfono", "Empresa", "Estado", "Tags", "Último contacto"];
  const rows = filteredContacts.map((c) => [
    c.name,
    c.email,
    c.phone,
    c.company,
    stageLabels[c.stage],
    c.tags.join("; "),
    c.lastContact,
  ]);

  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `contactos_${formatDateFile()}.csv`);
}

export function exportDashboardPDF() {
  // Generate a simple HTML report and print as PDF
  const win = window.open("", "_blank");
  if (!win) return;

  const totalContacts = contacts.length;
  const byStage = (["new", "contacted", "qualified", "proposal", "won", "lost"] as const).map((s) => ({
    label: stageLabels[s],
    count: contacts.filter((c) => c.stage === s).length,
  }));

  win.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Reporte CRM - ${formatDateFile()}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #1a1a2e; }
  h1 { color: #0d9668; border-bottom: 2px solid #0d9668; padding-bottom: 8px; }
  h2 { color: #334155; margin-top: 32px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
  th { background: #f1f5f9; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
  .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
  .kpi-value { font-size: 28px; font-weight: 700; color: #0d9668; }
  .kpi-label { font-size: 13px; color: #64748b; margin-top: 4px; }
  .print-btn { background: #0d9668; color: white; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; }
  @media print { .no-print { display: none; } }
</style></head><body>
  <div class="no-print" style="margin-bottom:20px">
    <button class="print-btn" onclick="window.print()">📄 Descargar PDF / Imprimir</button>
  </div>
  <h1>📊 Reporte StartupCRM</h1>
  <p style="color:#64748b">Generado el ${new Date().toLocaleDateString("es-MX", { dateStyle: "long" })}</p>
  
  <h2>Resumen</h2>
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-value">${totalContacts}</div><div class="kpi-label">Contactos totales</div></div>
    <div class="kpi"><div class="kpi-value">${contacts.filter((c) => c.stage === "won").length}</div><div class="kpi-label">Ganados</div></div>
    <div class="kpi"><div class="kpi-value">${contacts.filter((c) => c.stage === "qualified" || c.stage === "proposal").length}</div><div class="kpi-label">En pipeline activo</div></div>
  </div>

  <h2>Embudo de Ventas</h2>
  <table>
    <thead><tr><th>Etapa</th><th>Cantidad</th><th>%</th></tr></thead>
    <tbody>
      ${byStage.map((s) => `<tr><td>${s.label}</td><td>${s.count}</td><td>${((s.count / totalContacts) * 100).toFixed(0)}%</td></tr>`).join("")}
    </tbody>
  </table>

  <h2>Directorio de Contactos</h2>
  <table>
    <thead><tr><th>Nombre</th><th>Empresa</th><th>Email</th><th>Estado</th></tr></thead>
    <tbody>
      ${contacts.map((c) => `<tr><td>${c.name}</td><td>${c.company}</td><td>${c.email}</td><td>${stageLabels[c.stage]}</td></tr>`).join("")}
    </tbody>
  </table>
</body></html>`);
  win.document.close();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDateFile() {
  return new Date().toISOString().slice(0, 10);
}
