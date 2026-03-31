"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const categories = ["ROAD", "WASTE", "WATER", "TRAFFIC", "STREETLIGHT"] as const;
const severities = ["LOW", "MEDIUM", "HIGH"] as const;

export function IssueForm() {
  const [category, setCategory] = useState<(typeof categories)[number]>("ROAD");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<(typeof severities)[number]>("LOW");

  const [lat, setLat] = useState<number | "">("");
  const [lng, setLng] = useState<number | "">("");

  const [images, setImages] = useState<FileList | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fromStorage = localStorage.getItem("civic_session_id");
    if (!fromStorage) {
      localStorage.setItem("civic_session_id", crypto.randomUUID());
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => {
        setLat("");
        setLng("");
      }
    );
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (lat === "" || lng === "") return;

    setLoading(true);
    setMessage(null);

    const form = new FormData();
    form.append("category", category);
    form.append("description", description);
    form.append("severity", severity);
    form.append("latitude", String(lat));
    form.append("longitude", String(lng));
    form.append("sessionId", localStorage.getItem("civic_session_id") ?? "");

    if (images) {
      Array.from(images).forEach((file) => form.append("images", file));
    }

    const res = await fetch("/api/issues", { method: "POST", body: form });
    const data = await res.json();

    setLoading(false);
    setMessage(
      res.ok
        ? data.duplicateDetected
          ? "Issue submitted and flagged as potential duplicate."
          : "Issue submitted successfully."
        : data.error ?? "Submission failed"
    );

    if (res.ok) {
      setDescription("");
      setImages(null);
    }
  };

  const previews = images ? Array.from(images).map((file) => URL.createObjectURL(file)) : [];

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Report Civic Issue</h2>
        <p className="mt-1 text-sm text-slate-500">Share details, location, and images so the admin team can respond quickly.</p>
      </div>

      <label className="space-y-1.5 text-sm font-medium text-slate-700">
        <span>Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as never)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
        {categories.map((item) => (
          <option key={item}>{item}</option>
        ))}
        </select>
      </label>

      <label className="space-y-1.5 text-sm font-medium text-slate-700">
        <span>Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          rows={5}
          placeholder="Describe the issue in detail"
          required
        />
      </label>

      <label className="space-y-1.5 text-sm font-medium text-slate-700">
        <span>Severity</span>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as never)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
        {severities.map((item) => (
          <option key={item}>{item}</option>
        ))}
        </select>
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.length) setImages(e.dataTransfer.files);
        }}
        className={`rounded-2xl border border-dashed p-5 text-center transition-all duration-200 ${dragActive ? "border-slate-500 bg-slate-50" : "border-slate-300 bg-white"}`}
      >
        <p className="text-sm font-medium text-slate-700">Drag and drop images here</p>
        <p className="text-xs text-slate-500">or browse files from your device</p>
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="mt-3 w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white" />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {previews.map((url) => (
            <Image key={url} src={url} alt="Preview" width={120} height={80} unoptimized className="h-20 w-full rounded-lg border border-slate-200 object-cover" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={lat === "" ? "" : lat}
          onChange={(e) => {
            const val = e.target.value;
            setLat(val === "" ? "" : Number(val));
          }}
          className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          placeholder="Latitude"
        />
        <input
          value={lng === "" ? "" : lng}
          onChange={(e) => {
            const val = e.target.value;
            setLng(val === "" ? "" : Number(val));
          }}
          className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          placeholder="Longitude"
        />
      </div>

      <button
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            Submitting...
          </span>
        ) : (
          "Submit issue"
        )}
      </button>

      {message && <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</p>}
    </form>
  );
}