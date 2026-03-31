"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type AnalyticsResponse = {
  totalIssues: number;
  issuesPerCategory: Array<{ category: string; _count: { category: number } }>;
  topLocations: Array<[string, number]>;
  avgResolutionHours: number;
};

export function AnalyticsCharts({ analytics }: { analytics: AnalyticsResponse }) {
  const topLocation = analytics.topLocations[0];

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Issues</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{analytics.totalIssues}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Avg Resolution</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{analytics.avgResolutionHours.toFixed(1)}h</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top Location</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{topLocation ? topLocation[0] : "N/A"}</p>
          <p className="text-xs text-slate-500">{topLocation ? `${topLocation[1]} issue(s)` : "No data yet"}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Issues by Category</h3>
        <Bar
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { ticks: { precision: 0 } },
            },
          }}
          data={{
            labels: analytics.issuesPerCategory.map((item) => item.category),
            datasets: [
              {
                label: "Issues",
                data: analytics.issuesPerCategory.map((item) => item._count.category),
                backgroundColor: "#0f172a",
                borderRadius: 8,
              },
            ],
          }}
        />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Most Affected Locations</h3>
          <ul className="space-y-2 text-sm">
            {analytics.topLocations.length === 0 && <li className="text-slate-500">No location data available.</li>}
            {analytics.topLocations.map(([loc, count]) => (
              <li key={loc} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-700">{loc}</span>
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs text-white">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
