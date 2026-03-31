"use client";

import { useEffect, useMemo, useState } from "react";
import { IssueCard } from "@/components/IssueCard";

type Issue = {
  id: string;
  category: string;
  description: string;
  severity: string;
  status: "UNDER_REVIEW" | "IN_PROGRESS" | "RESOLVED";
  images: string[];
  duplicateOfId?: string | null;
  createdAt: string;
};

export function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filters, setFilters] = useState({ category: "", severity: "", status: "" });

  useEffect(() => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => !!value) as [string, string][]
    ).toString();
    fetch(`/api/issues${query ? `?${query}` : ""}`)
      .then((res) => res.json())
      .then((data) => setIssues(data.issues ?? []));
  }, [filters]);

  const hasIssues = useMemo(() => issues.length > 0, [issues.length]);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Track Reported Issues</h2>
          <button
            onClick={() => setFilters({ category: "", severity: "", status: "" })}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:bg-slate-100"
          >
            Clear filters
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          >
            <option value="">All categories</option>
            <option value="ROAD">Road</option>
            <option value="WASTE">Waste</option>
            <option value="WATER">Water</option>
            <option value="TRAFFIC">Traffic</option>
            <option value="STREETLIGHT">Streetlight</option>
          </select>
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            value={filters.severity}
            onChange={(e) => setFilters((prev) => ({ ...prev, severity: e.target.value }))}
          >
            <option value="">All severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All statuses</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {!hasIssues && <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">No issues found.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </section>
  );
}
