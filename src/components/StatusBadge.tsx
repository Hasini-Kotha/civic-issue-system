import clsx from "clsx";

export function StatusBadge({ status }: { status: "UNDER_REVIEW" | "IN_PROGRESS" | "RESOLVED" }) {
  return (
    <span
      className={clsx("rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide", {
        "border-amber-200 bg-amber-50 text-amber-700": status === "UNDER_REVIEW",
        "border-blue-200 bg-blue-50 text-blue-700": status === "IN_PROGRESS",
        "border-green-200 bg-green-50 text-green-700": status === "RESOLVED",
      })}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
