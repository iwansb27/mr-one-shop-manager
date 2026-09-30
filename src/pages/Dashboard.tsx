import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Video,
  Megaphone,
  Cloud,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Boxes,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { fetchDashboardStats } from "../lib/api";
import { showToast } from "../components/Toast";

interface Stats {
  totalProducts: number;
  totalAssetsA: number;
  totalAssetsB: number;
  totalCampaigns: number;
  storedMasters: number;
  pendingQC1: number;
  pendingQC2: number;
  console2Ready: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => {
        showToast("error", "Failed to load dashboard data");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Products",
      value: stats?.totalProducts ?? 0,
      icon: Boxes,
      link: "/console1/products",
      color: "primary",
    },
    {
      label: "Digital Products (A)",
      value: stats?.totalAssetsA ?? 0,
      icon: Package,
      link: "/console1/products",
      color: "primary",
    },
    {
      label: "Marketing Videos (B)",
      value: stats?.totalAssetsB ?? 0,
      icon: Video,
      link: "/console1/content",
      color: "accent",
    },
    {
      label: "Marketing Campaigns",
      value: stats?.totalCampaigns ?? 0,
      icon: Megaphone,
      link: "/console2/marketing",
      color: "success",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Control center overview — RETRIEVE → VALIDATE → PREVIEW → APPROVE → DISTRIBUTE"
      />

      <div className="p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.link}
                className="card p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {loading ? "—" : card.value}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${card.color}-50 text-${card.color}-600 group-hover:bg-${card.color}-100 transition-colors`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Status overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Cloud size={18} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">
                Cloudinary Masters
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : stats?.storedMasters ?? 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Masters stored</p>
              </div>
              <span className="badge-warning">BRIDGE NOT VERIFIED</span>
            </div>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Master URLs are registered manually. The Cloudinary upload API
              bridge is not yet connected to this app.
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">
                QC Queue
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">QC-1 Pending</span>
                <span className="text-lg font-bold text-warning-600">
                  {loading ? "—" : stats?.pendingQC1 ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">QC-2 Pending</span>
                <span className="text-lg font-bold text-warning-600">
                  {loading ? "—" : stats?.pendingQC2 ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">
                Console 2 Ready
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : stats?.console2Ready ?? 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  B assets available for distribution
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture flow */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Two-Lane Architecture
          </h3>
          <div className="flex flex-col lg:flex-row items-stretch gap-3">
            <div className="flex-1 rounded-lg border border-primary-200 bg-primary-50 p-4">
              <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-2">
                Console 1
              </p>
              <p className="text-sm font-medium text-primary-900">
                Master Asset Storage
              </p>
              <p className="text-xs text-primary-700 mt-1">
                A (Digital Product) + B (Digital Content) → QC-1 → Cloudinary
              </p>
              <Link
                to="/console1/products"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 mt-3 hover:underline"
              >
                Open Console 1 <ArrowRight size={12} />
              </Link>
            </div>

            <div className="flex items-center justify-center text-gray-300">
              <ArrowRight size={20} className="hidden lg:block" />
            </div>

            <div className="flex-1 rounded-lg border border-accent-200 bg-accent-50 p-4">
              <p className="text-xs font-semibold text-accent-700 uppercase tracking-wide mb-2">
                Console 2
              </p>
              <p className="text-sm font-medium text-accent-900">
                Marketing Distribution
              </p>
              <p className="text-xs text-accent-700 mt-1">
                B reference → Preview → QC-2 → Approve → Schedule → Buffer →
                TikTok / Facebook / YouTube
              </p>
              <Link
                to="/console2/marketing"
                className="inline-flex items-center gap-1 text-xs font-medium text-accent-700 mt-3 hover:underline"
              >
                Open Console 2 <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Integration status */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-warning-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              Integration Status — Honest State
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Tool
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Role
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-gray-900">
                    Cloudinary
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    A/B permanent master storage
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="badge-warning">NOT VERIFIED</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-gray-900">
                    Buffer
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    Console 2 distribution
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="badge-warning">NOT VERIFIED</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-gray-900">
                    Canva
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    A design/template production
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="badge-error">EXTERNAL-MANUAL</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-gray-900">
                    CapCut
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    A template / B video production
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="badge-error">EXTERNAL-MANUAL</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-gray-900">
                    TikTok / Facebook / YouTube
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    Distribution destinations
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="badge-warning">NOT VERIFIED</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            No fake API calls or unverified integrations are active. Production
            happens outside Console 1. The app registers finished results,
            performs QC, maintains A/B pairing, and records master references.
          </p>
        </div>
      </div>
    </div>
  );
}
