import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Megaphone,
  Plus,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  ExternalLink,
  AlertCircle,
  Video,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { showToast } from "../components/Toast";
import {
  CampaignStatusBadge,
  QC2Badge,
  BufferStatusBadge,
} from "../components/StatusBadges";
import {
  fetchCampaigns,
  updateCampaign,
  deleteCampaign,
  fetchAssetsByType,
} from "../lib/api";
import type { MarketingCampaign, Asset, Product } from "../types";

type CampaignWithRelations = MarketingCampaign & {
  assets: Asset;
  products: Product;
};

export default function Console2Marketing() {
  const [campaigns, setCampaigns] = useState<CampaignWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPreview, setShowPreview] = useState<CampaignWithRelations | null>(
    null
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (err) {
      showToast("error", "Failed to load campaigns");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.products?.product_code?.toLowerCase().includes(search.toLowerCase()) ||
      c.assets?.asset_code?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || c.campaign_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdate = async (
    id: string,
    updates: Partial<MarketingCampaign>
  ) => {
    try {
      await updateCampaign(id, updates);
      showToast("success", "Campaign updated");
      load();
    } catch (err) {
      showToast("error", "Failed to update campaign");
      console.error(err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete campaign "${title}"?`)) return;
    try {
      await deleteCampaign(id);
      showToast("success", "Campaign deleted");
      load();
    } catch (err) {
      showToast("error", "Failed to delete campaign");
      console.error(err);
    }
  };

  const statusOptions = [
    "all",
    "draft",
    "preview",
    "qc2_pending",
    "approved",
    "scheduled",
    "distributing",
    "completed",
    "rejected",
  ];

  return (
    <div>
      <PageHeader
        title="Console 2 — Marketing Distribution"
        subtitle="B master reference → Preview → QC-2 → Approve → Schedule → Buffer → TikTok / Facebook / YouTube"
      />

      <div className="p-6 space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="input pl-9"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input max-w-[180px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Buffer warning */}
        <div className="flex items-start gap-2 rounded-lg bg-warning-50 border border-warning-200 p-3 text-sm text-warning-800">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>
            Buffer and platform distribution APIs are{" "}
            <strong>NOT VERIFIED</strong>. Scheduling and distribution states
            are recorded for tracking only — no posts are published
            automatically.
          </span>
        </div>

        {/* Campaign list */}
        {loading ? (
          <div className="card">
            <div className="p-8 text-center text-gray-400 text-sm">
              Loading campaigns...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Megaphone size={24} />}
              title="No marketing campaigns"
              description="Create campaigns from a product's B content. Open a product in Console 1 to get started."
              action={
                <Link to="/console1/products" className="btn-primary">
                  Go to Products →
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onPreview={() => setShowPreview(campaign)}
              />
            ))}
          </div>
        )}
      </div>

      {showPreview && (
        <PreviewModal
          campaign={showPreview}
          onClose={() => setShowPreview(null)}
          onUpdate={(updates) => {
            handleUpdate(showPreview.id, updates);
            setShowPreview(null);
          }}
        />
      )}
    </div>
  );
}

function CampaignCard({
  campaign,
  onUpdate,
  onDelete,
  onPreview,
}: {
  campaign: CampaignWithRelations;
  onUpdate: (id: string, updates: Partial<MarketingCampaign>) => void;
  onDelete: (id: string, title: string) => void;
  onPreview: () => void;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {campaign.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Link
              to={`/product/${campaign.product_id}`}
              className="font-mono text-xs text-primary-600 hover:underline"
            >
              {campaign.products?.product_code}
            </Link>
            <span className="text-xs text-gray-400">·</span>
            <span className="font-mono text-xs text-gray-500">
              {campaign.assets?.asset_code}
            </span>
          </div>
        </div>
        <button
          className="text-gray-400 hover:text-error-600 transition-colors"
          onClick={() => onDelete(campaign.id, campaign.title)}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <CampaignStatusBadge status={campaign.campaign_status} />
        <QC2Badge status={campaign.qc2_status} />
        <BufferStatusBadge status={campaign.buffer_status} />
        <span className="badge-neutral uppercase">
          {campaign.target_platform}
        </span>
      </div>

      {campaign.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {campaign.description}
        </p>
      )}

      {campaign.cta && (
        <p className="text-xs text-gray-500 mb-3">
          <span className="font-medium">CTA:</span> {campaign.cta}
        </p>
      )}

      {campaign.scheduled_at && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <Calendar size={12} />
          {new Date(campaign.scheduled_at).toLocaleString()}
        </div>
      )}

      {campaign.assets?.master_url && (
        <div className="flex items-center gap-1.5 mb-3 rounded-lg bg-gray-50 p-2">
          <Video size={12} className="text-gray-400" />
          <a
            href={campaign.assets.master_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-600 hover:underline truncate"
          >
            B Master URL
          </a>
          <ExternalLink size={10} className="text-gray-400 flex-shrink-0" />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
        <button
          className="btn-secondary py-1.5 text-xs"
          onClick={onPreview}
        >
          <Eye size={14} /> Preview
        </button>

        <select
          className="input max-w-[160px] py-1.5 text-xs"
          value={campaign.campaign_status}
          onChange={(e) =>
            onUpdate(campaign.id, {
              campaign_status: e.target.value as MarketingCampaign["campaign_status"],
            })
          }
        >
          <option value="draft">Draft</option>
          <option value="preview">Preview</option>
          <option value="qc2_pending">QC-2 Pending</option>
          <option value="approved">Approved</option>
          <option value="scheduled">Scheduled</option>
          <option value="distributing">Distributing</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          className="btn-success py-1.5 text-xs"
          onClick={() =>
            onUpdate(campaign.id, {
              qc2_status: "passed",
              campaign_status: "approved",
            })
          }
        >
          <CheckCircle size={14} /> QC-2 Pass
        </button>
        <button
          className="btn-danger py-1.5 text-xs"
          onClick={() =>
            onUpdate(campaign.id, {
              qc2_status: "failed",
              campaign_status: "rejected",
            })
          }
        >
          <XCircle size={14} /> QC-2 Fail
        </button>
      </div>
    </div>
  );
}

function PreviewModal({
  campaign,
  onClose,
  onUpdate,
}: {
  campaign: CampaignWithRelations;
  onClose: () => void;
  onUpdate: (updates: Partial<MarketingCampaign>) => void;
}) {
  return (
    <Modal open={true} onClose={onClose} title="Campaign Preview" size="lg">
      <div className="space-y-4">
        {/* B Master Reference */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Video size={16} className="text-accent-600" />
            <h4 className="text-xs font-semibold text-gray-700 uppercase">
              B Master Reference
            </h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Asset ID</span>
              <span className="font-mono text-xs font-medium">
                {campaign.assets?.asset_code}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Product ID</span>
              <span className="font-mono text-xs font-medium">
                {campaign.products?.product_code}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Content Type</span>
              <span className="text-xs uppercase">
                {campaign.assets?.content_type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Version</span>
              <span className="text-xs">{campaign.assets?.version}</span>
            </div>
            {campaign.assets?.master_url && (
              <div className="pt-2 border-t border-gray-100">
                <a
                  href={campaign.assets.master_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:underline break-all"
                >
                  {campaign.assets.master_url}
                </a>
              </div>
            )}
            {!campaign.assets?.master_url && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-warning-600">
                  No master URL registered yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Campaign Details */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">
            Campaign Package
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500 text-xs">Title</span>
              <p className="font-medium">{campaign.title}</p>
            </div>
            {campaign.description && (
              <div>
                <span className="text-gray-500 text-xs">Description</span>
                <p className="text-gray-700">{campaign.description}</p>
              </div>
            )}
            {campaign.cta && (
              <div>
                <span className="text-gray-500 text-xs">CTA</span>
                <p className="text-gray-700">{campaign.cta}</p>
              </div>
            )}
            {campaign.product_link && (
              <div>
                <span className="text-gray-500 text-xs">Product Link</span>
                <a
                  href={campaign.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:underline block"
                >
                  {campaign.product_link}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Distribution Info */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">
            Distribution
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Platform</span>
              <span className="font-medium uppercase">
                {campaign.target_platform}
              </span>
            </div>
            {campaign.channel_name && (
              <div className="flex justify-between">
                <span className="text-gray-500">Channel</span>
                <span className="font-medium">{campaign.channel_name}</span>
              </div>
            )}
            {campaign.channel_id && (
              <div className="flex justify-between">
                <span className="text-gray-500">Channel ID</span>
                <span className="font-mono text-xs">
                  {campaign.channel_id}
                </span>
              </div>
            )}
            {campaign.scheduled_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Scheduled</span>
                <span className="text-xs">
                  {new Date(campaign.scheduled_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* QC-2 Checklist */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">
            QC-2 Checklist
          </h4>
          <div className="space-y-1.5 text-xs text-gray-600">
            {[
              "Product ID verified",
              "Asset ID verified",
              "Title and description correct",
              "CTA present",
              "Product link valid",
              "Platform and channel correct",
              "Schedule confirmed",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-300" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            className="btn-success"
            onClick={() =>
              onUpdate({
                qc2_status: "passed",
                campaign_status: "approved",
              })
            }
          >
            <CheckCircle size={16} /> QC-2 Pass → Approve
          </button>
          <button
            className="btn-danger"
            onClick={() =>
              onUpdate({
                qc2_status: "failed",
                campaign_status: "rejected",
              })
            }
          >
            <XCircle size={16} /> QC-2 Fail → Reject
          </button>
          <button
            className="btn-secondary"
            onClick={() =>
              onUpdate({
                campaign_status: "scheduled",
                buffer_status: "scheduled",
              })
            }
          >
            <Calendar size={16} /> Mark Scheduled
          </button>
        </div>

        <div className="rounded-lg bg-warning-50 p-3 text-xs text-warning-800">
          Buffer integration is NOT VERIFIED. "Mark Scheduled" records the
          status only — it does not publish to any platform.
        </div>
      </div>
    </Modal>
  );
}
