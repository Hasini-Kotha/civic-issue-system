"use client";

import Image from "next/image";
import { FeedbackForm } from "@/components/FeedbackForm";
import { StatusBadge } from "@/components/StatusBadge";

type IssueCardProps = {
  issue: {
    id: string;
    category: string;
    description: string;
    severity: string;
    status: "UNDER_REVIEW" | "IN_PROGRESS" | "RESOLVED";
    images: string[];
    duplicateOfId?: string | null;
  };
};

const categoryIcon: Record<string, string> = {
  ROAD: "🛣️",
  WASTE: "🗑️",
  WATER: "💧",
  TRAFFIC: "🚦",
  STREETLIGHT: "💡",
};

const severityStyle: Record<string, string> = {
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-rose-50 text-rose-700 border-rose-200",
};

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryIcon[issue.category] ?? "📍"}</span>
          <h3 className="text-base font-semibold text-slate-900">{issue.category}</h3>
        </div>
        <StatusBadge status={issue.status} />
      </div>

      <p className="text-sm leading-6 text-slate-600">{issue.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${severityStyle[issue.severity] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
          Severity: {issue.severity}
        </span>
        {issue.duplicateOfId && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            Potential duplicate
          </span>
        )}
      </div>

      {issue.images?.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {issue.images.map((image) => (
            <Image key={image} src={image} alt="Issue" width={110} height={90} className="h-20 w-full rounded-lg object-cover" />
          ))}
        </div>
      )}

      {issue.status === "RESOLVED" && <FeedbackForm issueId={issue.id} />}
    </article>
  );
}
