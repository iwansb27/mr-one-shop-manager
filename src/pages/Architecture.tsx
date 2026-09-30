import { Link } from "react-router-dom";
import {
  Package,
  Video,
  Megaphone,
  Cloud,
  ArrowRight,
  Shield,
  AlertCircle,
  CheckCircle,
  Wrench,
} from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function Architecture() {
  return (
    <div>
      <PageHeader
        title="Architecture — Locked Blueprint"
        subtitle="MASTER HANDOFF BLUEPRINT — the two-lane architecture that governs this app"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Core operation */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Core Control Operation
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
            {["RETRIEVE", "VALIDATE", "PREVIEW", "APPROVE", "DISTRIBUTE"].map(
              (step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg bg-primary-50 text-primary-700 px-3 py-1.5">
                    {step}
                  </span>
                  {i < arr.length - 1 && (
                    <ArrowRight size={14} className="text-gray-300" />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Two-lane architecture */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Locked Two-Lane Architecture
          </h3>

          <div className="space-y-4">
            {/* Console 1 */}
            <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Package size={18} className="text-primary-600" />
                <h4 className="text-sm font-bold text-primary-900">
                  Console 1 — Master Asset Storage
                </h4>
              </div>
              <p className="text-sm text-primary-700 mb-4">
                Console 1 is a master-asset storage and registration layer, not
                a production engine. Production happens outside the app.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-lg bg-white p-3 border border-primary-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={14} className="text-primary-600" />
                    <span className="text-xs font-bold text-primary-700">
                      A — Digital Product Master
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    PDF, XLSX, ZIP, planner, journal, template, ebook. The
                    permanent master product for sale or delivery.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 border border-accent-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Video size={14} className="text-accent-600" />
                    <span className="text-xs font-bold text-accent-700">
                      B — Digital Content Master
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Short-form marketing video (15–25s MP4). The permanent
                    marketing asset paired to A by Product ID.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-medium text-primary-700">
                  Control flow:
                </span>
                <span className="rounded bg-white px-2 py-0.5 text-gray-700">
                  MANUAL → REGISTER → QC-1 → SAVE MASTER
                </span>
              </div>
            </div>

            {/* Connection */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ArrowRight size={16} className="rotate-90" />
                <span>B master reference (live Cloudinary URL)</span>
                <ArrowRight size={16} className="rotate-90" />
              </div>
            </div>

            {/* Console 2 */}
            <div className="rounded-xl border border-accent-200 bg-accent-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Megaphone size={18} className="text-accent-600" />
                <h4 className="text-sm font-bold text-accent-900">
                  Console 2 — Marketing Distribution
                </h4>
              </div>
              <p className="text-sm text-accent-700 mb-3">
                Console 2 references the B master via its live Cloudinary URL.
                It does not create, move, duplicate, or delete the master.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {[
                  "B reference",
                  "Preview",
                  "QC-2",
                  "Approve",
                  "Schedule",
                  "Buffer",
                  "TikTok / Facebook / YouTube",
                ].map((step, i, arr) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="rounded bg-white px-2 py-1 text-accent-700 font-medium">
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <ArrowRight size={10} className="text-accent-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cloudinary */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Cloud size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Cloudinary — Permanent Master Repository
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-700 mb-1">
                A Master
              </p>
              <p className="text-sm text-success-600 font-medium">
                NEVER AUTO-DELETE
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-700 mb-1">
                B Master
              </p>
              <p className="text-sm text-success-600 font-medium">
                NEVER AUTO-DELETE
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Console 2 uses the live Cloudinary URL/reference for B. The master
            file stays in Cloudinary.
          </p>
        </div>

        {/* Production modes */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Production Modes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Mode
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Meaning
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2.5 px-3">
                    <span className="badge-success">AUTO</span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    Verified automated generation is available
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">
                    <span className="badge-info">SEMI-AUTO</span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    Automation prepares part; external/manual step completes it
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">
                    <span className="badge-warning">MANUAL</span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    Production happens outside the app; result is registered
                    here
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">
                    <span className="badge-error">NOT AVAILABLE</span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    No reliable route exists; do not force an integration
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tool capability map */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wrench size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Tool Capability Map — Honest State
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
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Autonomous
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["Cloudinary", "A/B master storage", "NOT VERIFIED", "No"],
                  ["Canva", "A design/template", "NOT VERIFIED", "No"],
                  ["Descript", "B video editing", "NOT VERIFIED", "No"],
                  ["HeyGen", "B video generation", "NOT VERIFIED", "No"],
                  ["ElevenLabs", "B media generation", "Pro+ required", "No"],
                  ["Magnific", "A/B visual editing", "NOT VERIFIED", "No"],
                  ["Adobe Express", "A design production", "NOT VERIFIED", "No"],
                  ["CapCut", "A/B template/video", "EXTERNAL-MANUAL", "No"],
                  ["Buffer", "Console 2 distribution", "NOT VERIFIED", "No"],
                ].map(([tool, role, status, auto]) => (
                  <tr key={tool}>
                    <td className="py-2.5 px-3 font-medium text-gray-900">
                      {tool}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">{role}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={
                          status === "EXTERNAL-MANUAL"
                            ? "badge-error"
                            : status === "Pro+ required"
                            ? "badge-warning"
                            : "badge-warning"
                        }
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500">{auto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>
              A tool being available to ChatGPT does not automatically make it
              callable by this app. The repository agent needs its own verified
              API/bridge. If no verified path exists, the status is
              EXTERNAL-MANUAL, never fake AUTO.
            </span>
          </div>
        </div>

        {/* Safety rules */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Safety Rules
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Missing Product ID → STOP",
              "Missing asset → STOP",
              "A/B mismatch → STOP",
              "Unsupported integration → MANUAL or NOT AVAILABLE",
              "API failure → never claim success",
              "Cloudinary master → never auto-delete",
              "Console 2 must not delete the master",
              "Free / zero-rupiah first",
            ].map((rule) => (
              <div
                key={rule}
                className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700"
              >
                <CheckCircle size={14} className="text-success-500 flex-shrink-0 mt-0.5" />
                {rule}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3">
          <Link to="/console1/products" className="btn-primary">
            <Package size={16} /> Open Console 1
          </Link>
          <Link to="/console2/marketing" className="btn-secondary">
            <Megaphone size={16} /> Open Console 2
          </Link>
        </div>
      </div>
    </div>
  );
}
