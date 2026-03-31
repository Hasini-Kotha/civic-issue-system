import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { AdminIssueTable } from "@/components/AdminIssueTable";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { getIssueStats } from "@/lib/db";
import { LogoutButton } from "@/components/LogoutButton"; // ✅ added

export default async function AdminPage() {
  const session = (await getServerSession(authOptions as never)) as { user?: { role?: string } } | null;

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [issues, stats, resolved, locationClusters] = await Promise.all([
    prisma.issue.findMany({
      orderBy: { createdAt: "desc" },
      include: { feedbacks: true },
    }),
    getIssueStats(),
    prisma.issue.findMany({
      where: { status: "RESOLVED", resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    }),
    prisma.issue.findMany({
      select: { latitude: true, longitude: true },
    }),
  ]);

  const avgResolutionHours =
    resolved.length === 0
      ? 0
      : resolved.reduce((sum, item) => {
          const end = item.resolvedAt?.getTime() ?? item.createdAt.getTime();
          return sum + (end - item.createdAt.getTime());
        }, 0) /
        resolved.length /
        (1000 * 60 * 60);

  const topLocations = Object.entries(
    locationClusters.reduce<Record<string, number>>((acc, issue) => {
      const key = `${issue.latitude.toFixed(3)},${issue.longitude.toFixed(3)}`;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const analyticsRes = {
    totalIssues: stats.totalIssues,
    issuesPerCategory: stats.issuesPerCategory,
    avgResolutionHours,
    topLocations,
  };

  return (
    <main className="space-y-6">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Welcome, Admin</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
          </div>
          <LogoutButton />
        </div>

        <AnalyticsCharts analytics={analyticsRes} />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Issue Management</h2>
          <AdminIssueTable initialIssues={issues} />
        </section>
      </div>
    </main>
  );
}