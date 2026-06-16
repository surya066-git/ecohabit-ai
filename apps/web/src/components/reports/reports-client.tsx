"use client";

import { BarChart3, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { apiFetch } from "@/lib/api-client";
import { demoDashboard } from "@/lib/demo-data";
import { formatDate, formatKg } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

type Report = {
  _id?: string;
  period: "weekly" | "monthly";
  periodStart: string;
  periodEnd: string;
  totalKgCo2e: number;
  avoidedKgCo2e: number;
  insight: string;
  ecoScore: number;
};

const demoReports: Report[] = demoDashboard.footprints.map((entry, index) => ({
  _id: `report-${index}`,
  period: "weekly",
  periodStart: entry.periodStart,
  periodEnd: entry.periodStart,
  totalKgCo2e: entry.breakdown.totalKgCo2e,
  avoidedKgCo2e: Math.max(8, 16 + index * 3),
  insight: demoDashboard.latestReport.insight,
  ecoScore: Math.min(88, 68 + index * 3)
}));

export function ReportsClient() {
  const { getIdToken } = useAuth();
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [reports, setReports] = useState<Report[]>(demoReports);
  const [loading, setLoading] = useState(false);

  const loadReports = useCallback(
    async (nextPeriod = period) => {
      try {
        const token = await getIdToken();
        const response = await apiFetch<{ reports: Report[] }>(`/reports?period=${nextPeriod}`, token);
        setReports(response.reports.length ? response.reports : demoReports);
      } catch {
        setReports(demoReports);
      }
    },
    [getIdToken, period]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadReports(period);
  }, [period, loadReports]);

  async function handleGenerate() {
    setLoading(true);
    try {
      const token = await getIdToken();
      await apiFetch<{ report: Report }>(`/reports/generate?period=${period}`, token, {
        method: "POST"
      });
      await loadReports(period);
    } catch {
      setReports(demoReports);
    } finally {
      setLoading(false);
    }
  }

  const chartData = reports
    .slice()
    .reverse()
    .map((report) => ({
      date: formatDate(report.periodStart),
      footprint: report.totalKgCo2e,
      avoided: report.avoidedKgCo2e,
      score: report.ecoScore
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Weekly and Monthly Reports</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Progress Review</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Compare footprint, avoided emissions, and Eco Score over time.
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            aria-label="Report period"
            onChange={(event) => setPeriod(event.target.value as "weekly" | "monthly")}
            value={period}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
          <Button disabled={loading} onClick={() => void handleGenerate()} type="button">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />}
            Generate
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Trend</CardTitle>
          <CardDescription>Footprint and avoided emissions by period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={chartData} margin={{ left: -20, right: 12, top: 8 }}>
                <CartesianGrid stroke="#d7decf" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="footprint" fill="#1f7a4d" name="Footprint kg CO2e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="avoided" fill="#8fb35f" name="Avoided kg CO2e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3">
        {reports.map((report) => (
          <Card key={report._id ?? report.periodStart}>
            <CardContent className="grid gap-4 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-accent text-primary">
                <BarChart3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold">
                  {formatDate(report.periodStart)} to {formatDate(report.periodEnd)}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{report.insight}</p>
              </div>
              <div className="grid gap-1 text-sm md:text-right">
                <span>{formatKg(report.totalKgCo2e)}</span>
                <span className="text-muted-foreground">Eco Score {report.ecoScore}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
