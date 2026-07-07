import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Target, Award, ArrowUpRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { formatRWF } from "../../lib/admin-data";
import { getReportData } from "../../lib/admin-data.server";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reports")({
  loader: () => getReportData(),
  component: ReportsPage,
});

function ReportsPage() {
  const { revenueData, impactMetrics } = Route.useLoaderData();
  const [dateRange, setDateRange] = useState("Last 12 Months");

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);

  const handleExport = (format: "csv" | "pdf") => {
    toast.success(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">View agribusiness sales reports, cooperative growth statistics, and SDG social impacts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")} className="gap-2 text-xs">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("pdf")} className="gap-2 text-xs">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Gross Platform Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-950 font-display">{formatRWF(totalRevenue)}</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">+18.4%</span> since Jan 2026
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Total Orders Dispatched</CardTitle>
            <Target className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-950 font-display">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">Average order value {formatRWF(Math.round(totalRevenue / totalOrders))}</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Farmers Reached & Active</CardTitle>
            <Award className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-950 font-display">4,872</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">+52%</span> trained or active on site
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth chart */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-gray-900">Gross Volume Development (RWF)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip formatter={(value: any) => [formatRWF(value), "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SDG Social Impact Charts */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-gray-900">Post-Harvest Waste Reduction (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} unit="%" />
                <Tooltip formatter={(value: any) => [`${value}%`, "Loss Reduction"]} />
                <Bar dataKey="loss_reduction" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
