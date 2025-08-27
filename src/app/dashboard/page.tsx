"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Types matching your Product model/route
type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating?: { rate?: number; count?: number };
  createdAt?: string;
};

// Colors for charts
const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#22C55E",
];

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        if (mounted) setProducts(data);
      } catch (error: unknown) {
        if (mounted) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load';
          setError(errorMessage);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // KPIs
  const totalProducts = products.length;
  const avgPrice = useMemo(() => {
    if (!products.length) return 0;
    const sum = products.reduce((s, p) => s + (p.price || 0), 0);
    return +(sum / products.length).toFixed(2);
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products)
      counts[p.category] = (counts[p.category] || 0) + 1;
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Line: items created per month (last 6 months)
  const monthlyData = useMemo(() => {
    // Create 6 buckets: current month going back 5
    const now = new Date();
    const key = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const labels: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push({
        key: key(d),
        label: d.toLocaleString(undefined, { month: "short" }),
      });
    }
    const map: Record<string, number> = {};
    for (const { key } of labels) map[key] = 0;

    for (const p of products) {
      const c = p.createdAt ? new Date(p.createdAt) : null;
      if (!c || Number.isNaN(+c)) continue;
      const k = key(new Date(c.getFullYear(), c.getMonth(), 1));
      if (k in map) map[k] += 1;
    }
    return labels.map(({ key, label }) => ({
      month: label,
      count: map[key] ?? 0,
    }));
  }, [products]);

  // Bar: by category
  const categoryData = useMemo(
    () => categoryCounts.map((c) => ({ category: c.category, count: c.count })),
    [categoryCounts]
  );

  // Pie: rating distribution (round rate to nearest integer 0..5)
  const ratingData = useMemo(() => {
    const dist = Array.from({ length: 6 }).map((_, i) => ({
      name: `${i}★`,
      value: 0,
    }));
    for (const p of products) {
      const r = Math.round(p.rating?.rate ?? 0);
      if (r >= 0 && r <= 5) dist[r].value += 1;
    }
    // Remove 0 buckets if all zero to avoid empty pie
    const any = dist.some((d) => d.value > 0);
    return any ? dist : [];
  }, [products]);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Key metrics and recent activity
          </p>
        </div>
        <Link
          href="/dashboard/add-product"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Add Product
        </Link>
      </header>

      {/* KPI cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Total Products"
          value={loading ? "…" : totalProducts.toString()}
        />
        <KpiCard title="Average Price" value={loading ? "…" : `$${avgPrice}`} />
        <KpiCard
          title="Categories"
          value={loading ? "…" : categoryCounts.length.toString()}
        />
      </section>

      {/* Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="h-[340px]">
          <CardContent className="h-full p-4">
            <div className="mb-2 text-sm font-medium">
              Products Added (Last 6 Months)
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[340px]">
          <CardContent className="h-full p-4">
            <div className="mb-2 text-sm font-medium">Products by Category</div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[340px] lg:col-span-2">
          <CardContent className="h-full p-4">
            <div className="mb-2 text-sm font-medium">Rating Distribution</div>
            {ratingData.length ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={ratingData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {ratingData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No rating data yet
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Recent products */}
      <section className="space-y-3">
        <div className="text-sm font-medium">Recent Products</div>
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Title</th>
                <th className="px-3 py-2 text-left font-medium">Category</th>
                <th className="px-3 py-2 text-left font-medium">Price</th>
                <th className="px-3 py-2 text-left font-medium">Created</th>
                <th className="px-3 py-2 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-muted-foreground"
                    colSpan={5}
                  >
                    Loading…
                  </td>
                </tr>
              ) : products.length ? (
                [...products]
                  .sort(
                    (a, b) =>
                      +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0)
                  )
                  .slice(0, 8)
                  .map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="px-3 py-2">{p.title}</td>
                      <td className="px-3 py-2">{p.category}</td>
                      <td className="px-3 py-2">${p.price}</td>
                      <td className="px-3 py-2">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/products/${p._id}`}
                          className="rounded border px-2 py-1 hover:bg-muted"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-muted-foreground"
                    colSpan={5}
                  >
                    No products yet.{" "}
                    <Link className="underline" href="/dashboard/add-product">
                      Add one
                    </Link>
                    .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
