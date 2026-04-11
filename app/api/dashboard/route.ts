import { NextResponse } from "next/server";
import { client } from "@/lib/db";

export const dynamic = "force-dynamic";

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

const funnelStages = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
const canales = ["whatsapp", "email", "sms"] as const;

function toNumber(value: unknown): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function toTrend(change: number): Trend {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "neutral";
}

async function executeRows(statement: string): Promise<Array<Record<string, unknown>>> {
  const result = await client.execute(statement);
  return (result.rows ?? []) as Array<Record<string, unknown>>;
}

async function getActiveContacts(): Promise<KPIResult> {
  try {
    const rows = await executeRows(`
      WITH hoy AS (
        SELECT COUNT(*) AS total
        FROM contacts
        WHERE DATE(created_at) = DATE('now')
      ),
      ayer AS (
        SELECT COUNT(*) AS total
        FROM contacts
        WHERE DATE(created_at) = DATE('now', '-1 day')
      ),
      totales AS (
        SELECT
          (SELECT COUNT(*) FROM contacts) AS contactos_activos,
          COALESCE((SELECT total FROM hoy), 0) AS actuales,
          COALESCE((SELECT total FROM ayer), 0) AS anteriores
      )
      SELECT
        contactos_activos,
        ROUND(
          CASE
            WHEN anteriores = 0 AND actuales > 0 THEN 100.0
            WHEN anteriores = 0 AND actuales = 0 THEN 0
            ELSE ((actuales - anteriores) * 100.0) / anteriores
          END,
          2
        ) AS delta_porcentual
      FROM totales
    `);

    const row = rows[0];
    const change = toNumber(row?.delta_porcentual);

    return {
      value: toNumber(row?.contactos_activos),
      change,
      trend: toTrend(change),
    };
  } catch (error) {
    console.error("Error getting active contacts:", error);
    return { value: 0, change: 0, trend: "neutral" };
  }
}

async function getWhatsAppSent(): Promise<KPIResult> {
  try {
    const rows = await executeRows(`
      WITH hoy AS (
        SELECT COUNT(*) AS total
        FROM messages
        WHERE canal = 'whatsapp'
          AND direccion = 'saliente'
          AND DATE(fecha) = DATE('now')
      ),
      ayer AS (
        SELECT COUNT(*) AS total
        FROM messages
        WHERE canal = 'whatsapp'
          AND direccion = 'saliente'
          AND DATE(fecha) = DATE('now', '-1 day')
      ),
      totales AS (
        SELECT
          (SELECT COUNT(*)
           FROM messages
           WHERE canal = 'whatsapp'
             AND direccion = 'saliente') AS mensajes_enviados,
          COALESCE((SELECT total FROM hoy), 0) AS actuales,
          COALESCE((SELECT total FROM ayer), 0) AS anteriores
      )
      SELECT
        mensajes_enviados,
        ROUND(
          CASE
            WHEN anteriores = 0 AND actuales > 0 THEN 100.0
            WHEN anteriores = 0 AND actuales = 0 THEN 0
            ELSE ((actuales - anteriores) * 100.0) / anteriores
          END,
          2
        ) AS delta_porcentual
      FROM totales
    `);

    const row = rows[0];
    const change = toNumber(row?.delta_porcentual);

    return {
      value: toNumber(row?.mensajes_enviados),
      change,
      trend: toTrend(change),
    };
  } catch (error) {
    console.error("Error getting WhatsApp sent:", error);
    return { value: 0, change: 0, trend: "neutral" };
  }
}

async function getEmailsSent(): Promise<KPIResult> {
  try {
    const rows = await executeRows(`
      WITH hoy AS (
        SELECT COUNT(*) AS total
        FROM messages
        WHERE canal = 'email'
          AND direccion = 'saliente'
          AND DATE(fecha) = DATE('now')
      ),
      ayer AS (
        SELECT COUNT(*) AS total
        FROM messages
        WHERE canal = 'email'
          AND direccion = 'saliente'
          AND DATE(fecha) = DATE('now', '-1 day')
      ),
      totales AS (
        SELECT
          (SELECT COUNT(*)
           FROM messages
           WHERE canal = 'email'
             AND direccion = 'saliente') AS emails_enviados,
          COALESCE((SELECT total FROM hoy), 0) AS actuales,
          COALESCE((SELECT total FROM ayer), 0) AS anteriores
      )
      SELECT
        emails_enviados,
        ROUND(
          CASE
            WHEN anteriores = 0 AND actuales > 0 THEN 100.0
            WHEN anteriores = 0 AND actuales = 0 THEN 0
            ELSE ((actuales - anteriores) * 100.0) / anteriores
          END,
          2
        ) AS delta_porcentual
      FROM totales
    `);

    const row = rows[0];
    const change = toNumber(row?.delta_porcentual);

    return {
      value: toNumber(row?.emails_enviados),
      change,
      trend: toTrend(change),
    };
  } catch (error) {
    console.error("Error getting emails sent:", error);
    return { value: 0, change: 0, trend: "neutral" };
  }
}

async function getResponseRate(): Promise<KPIResult> {
  try {
    const rows = await executeRows(`
      WITH hoy AS (
        SELECT
          COUNT(*) AS total_entrantes,
          SUM(
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM messages m2
                WHERE m2.contact_id = m1.contact_id
                  AND m2.direccion = 'saliente'
                  AND datetime(m2.fecha) > datetime(m1.fecha)
              ) THEN 1
              ELSE 0
            END
          ) AS entrantes_con_respuesta
        FROM messages m1
        WHERE m1.direccion = 'entrante'
          AND DATE(m1.fecha) = DATE('now')
      ),
      ayer AS (
        SELECT
          COUNT(*) AS total_entrantes,
          SUM(
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM messages m2
                WHERE m2.contact_id = m1.contact_id
                  AND m2.direccion = 'saliente'
                  AND datetime(m2.fecha) > datetime(m1.fecha)
              ) THEN 1
              ELSE 0
            END
          ) AS entrantes_con_respuesta
        FROM messages m1
        WHERE m1.direccion = 'entrante'
          AND DATE(m1.fecha) = DATE('now', '-1 day')
      ),
      metricas AS (
        SELECT
          ROUND(
            COALESCE(
              100.0 * COALESCE(hoy.entrantes_con_respuesta, 0) / NULLIF(hoy.total_entrantes, 0),
              0
            ),
            2
          ) AS tasa_actual,
          ROUND(
            COALESCE(
              100.0 * COALESCE(ayer.entrantes_con_respuesta, 0) / NULLIF(ayer.total_entrantes, 0),
              0
            ),
            2
          ) AS tasa_anterior
        FROM hoy, ayer
      )
      SELECT
        tasa_actual,
        ROUND(tasa_actual - tasa_anterior, 2) AS delta
      FROM metricas
    `);

    const row = rows[0];
    const value = toNumber(row?.tasa_actual);
    const change = toNumber(row?.delta);

    return {
      value,
      change,
      trend: toTrend(change),
    };
  } catch (error) {
    console.error("Error getting response rate:", error);
    return { value: 0, change: 0, trend: "neutral" };
  }
}

async function getFunnel(): Promise<FunnelItem[]> {
  try {
    const rows = await executeRows(`
      SELECT stage, COUNT(*) AS count
      FROM contacts
      GROUP BY stage
    `);

    const countsByStage = new Map(
      rows.map((row) => [String(row.stage), toNumber(row.count)])
    );

    return funnelStages.map((stage) => ({
      stage,
      count: countsByStage.get(stage) ?? 0,
    }));
  } catch (error) {
    console.error("Error getting funnel:", error);
    return funnelStages.map((stage) => ({ stage, count: 0 }));
  }
}

async function getChannels(): Promise<ChannelItem[]> {
  try {
    const rows = await executeRows(`
      SELECT canal, COUNT(*) AS count
      FROM messages
      GROUP BY canal
    `);

    const countsByCanal = new Map(
      rows.map((row) => [String(row.canal), toNumber(row.count)])
    );

    return canales.map((canal) => ({
      canal,
      count: countsByCanal.get(canal) ?? 0,
    }));
  } catch (error) {
    console.error("Error getting channels:", error);
    return canales.map((canal) => ({ canal, count: 0 }));
  }
}

async function getWeeklyActivity(): Promise<WeeklyActivityItem[]> {
  try {
    const rows = await executeRows(`
      SELECT
        DATE(fecha) AS date,
        CASE strftime('%w', fecha)
          WHEN '0' THEN 'Domingo'
          WHEN '1' THEN 'Lunes'
          WHEN '2' THEN 'Martes'
          WHEN '3' THEN 'Miercoles'
          WHEN '4' THEN 'Jueves'
          WHEN '5' THEN 'Viernes'
          WHEN '6' THEN 'Sabado'
        END AS day_name,
        canal,
        COUNT(*) AS count
      FROM messages
      WHERE datetime(fecha) >= datetime('now', '-7 days')
      GROUP BY DATE(fecha), canal
      ORDER BY DATE(fecha), canal
    `);

    return rows.map((row) => ({
      date: String(row.date),
      dayName: String(row.day_name),
      canal: String(row.canal),
      count: toNumber(row.count),
    }));
  } catch (error) {
    console.error("Error getting weekly activity:", error);
    return [];
  }
}

async function getConversionRate(): Promise<ConversionRateItem[]> {
  try {
    const rows = await executeRows(`
      SELECT
        strftime('%Y-%m', created_at) AS month_key,
        CASE strftime('%m', created_at)
          WHEN '01' THEN 'Enero'
          WHEN '02' THEN 'Febrero'
          WHEN '03' THEN 'Marzo'
          WHEN '04' THEN 'Abril'
          WHEN '05' THEN 'Mayo'
          WHEN '06' THEN 'Junio'
          WHEN '07' THEN 'Julio'
          WHEN '08' THEN 'Agosto'
          WHEN '09' THEN 'Septiembre'
          WHEN '10' THEN 'Octubre'
          WHEN '11' THEN 'Noviembre'
          WHEN '12' THEN 'Diciembre'
        END AS month,
        COUNT(*) AS total_contactos,
        SUM(CASE WHEN stage = 'won' THEN 1 ELSE 0 END) AS ganados,
        ROUND(
          100.0 * SUM(CASE WHEN stage = 'won' THEN 1 ELSE 0 END) / COUNT(*),
          2
        ) AS rate
      FROM contacts
      WHERE datetime(created_at) >= datetime('now', 'start of month', '-11 months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month_key
    `);

    return rows.map((row) => ({
      month: String(row.month),
      total: toNumber(row.total_contactos),
      won: toNumber(row.ganados),
      rate: toNumber(row.rate),
    }));
  } catch (error) {
    console.error("Error getting conversion rate:", error);
    return [];
  }
}

function emptyResponse() {
  return {
    kpis: {
      activeContacts: { value: 0, change: 0, trend: "neutral" as const },
      whatsappSent: { value: 0, change: 0, trend: "neutral" as const },
      emailsSent: { value: 0, change: 0, trend: "neutral" as const },
      responseRate: { value: 0, change: 0, trend: "neutral" as const },
    },
    charts: {
      funnel: funnelStages.map((stage) => ({ stage, count: 0 })),
      channels: canales.map((canal) => ({ canal, count: 0 })),
      weeklyActivity: [] as WeeklyActivityItem[],
      conversionRate: [] as ConversionRateItem[],
    },
  };
}

export async function GET() {
  try {
    const [
      activeContacts,
      whatsappSent,
      emailsSent,
      responseRate,
      funnel,
      channels,
      weeklyActivity,
      conversionRate,
    ] = await Promise.all([
      getActiveContacts(),
      getWhatsAppSent(),
      getEmailsSent(),
      getResponseRate(),
      getFunnel(),
      getChannels(),
      getWeeklyActivity(),
      getConversionRate(),
    ]);

    return NextResponse.json({
      kpis: {
        activeContacts,
        whatsappSent,
        emailsSent,
        responseRate,
      },
      charts: {
        funnel,
        channels,
        weeklyActivity,
        conversionRate,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(emptyResponse(), { status: 200 });
  }
}
