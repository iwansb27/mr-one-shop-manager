import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Video,
  Plus,
  Cloud,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Link2,
  AlertCircle,
  Megaphone,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { showToast } from "../components/Toast";
import {
  ProductionModeBadge,
  ProductionStatusBadge,
  CloudinaryStatusBadge,
  QC1Badge,
  OverallStatusBadge,
} from "../components/StatusBadges";
import {
  fetchProductWithAssets,
  updateAsset,
  updateProduct,
  deleteAsset,
  createAsset,
  createCampaign,
} from "../lib/api";
import type { ProductWithAssets, Asset, ProductionMode } from "../types";
import { PRODUCTION_MODES, CONTENT_TYPES_B, TARGET_PLATFORMS } from "../types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductWithAssets | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddB, setShowAddB] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await fetchProductWithAssets(id);
      setProduct(data);
    } catch (err) {
      showToast("error", "Failed to load product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const assetsA = product?.assets.filter((a) => a.asset_type === "A") || [];
  const assetsB = product?.assets.filter((a) => a.asset_type === "B") || [];

  const handleAssetUpdate = async (
    assetId: string,
    updates: Partial<Asset>
  ) => {
    try {
      await updateAsset(assetId, updates);
      showToast("success", "Asset updated");
      load();
    } catch (err) {
      showToast("error", "Failed to update asset");
      console.error(err);
    }
  };

  const handleProductUpdate = async (updates: Partial<typeof product>) => {
    if (!product) return;
    try {
      await updateProduct(product.id, updates as Partial<ProductWithAssets>);
      showToast("success", "Product updated");
      load();
    } catch (err) {
      showToast("error", "Failed to update product");
      console.error(err);
    }
  };

  const handleDeleteAsset = async (assetId: string, code: string) => {
    if (!confirm(`Delete asset ${code}? This cannot be undone.`)) return;
    try {
      await deleteAsset(assetId);
      showToast("success", `Asset ${code} deleted`);
      load();
    } catch (err) {
      showToast("error", "Failed to delete asset");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Product Detail" />
        <div className="p-8 text-center text-gray-400 text-sm">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <PageHeader title="Product Not Found" />
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4">This product does not exist.</p>
          <Link to="/console1/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={product.name}
        subtitle={`${product.product_code} — ${product.category || "No category"}`}
        actions={
          <Link to="/console1/products" className="btn-secondary">
            <ArrowLeft size={16} /> Back
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Product info */}
        <div className="card p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Product ID</p>
              <p className="font-mono text-sm font-medium text-gray-900">
                {product.product_code}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-sm font-medium text-gray-900 uppercase">
                {product.product_type}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Production Mode</p>
              <ProductionModeBadge mode={product.production_mode} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Overall Status</p>
              <OverallStatusBadge status={product.overall_status} />
            </div>
          </div>
          {product.description && (
            <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
              {product.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <select
              className="input max-w-[200px]"
              value={product.overall_status}
              onChange={(e) =>
                handleProductUpdate({ overall_status: e.target.value as ProductWithAssets["overall_status"] })
              }
            >
              <option value="draft">Draft</option>
              <option value="in_production">In Production</option>
              <option value="qc1_pending">QC-1 Pending</option>
              <option value="master_stored">Master Stored</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* A/B Pairing visualization */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            A ↔ B Pairing
          </h3>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {/* A Side */}
            <div className="flex-1 rounded-lg border border-primary-200 bg-primary-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package size={16} className="text-primary-600" />
                <span className="text-xs font-semibold text-primary-700 uppercase">
                  A — Digital Product
                </span>
              </div>
              {assetsA.length > 0 ? (
                <div className="space-y-2">
                  {assetsA.map((a) => (
                    <div key={a.id} className="text-sm">
                      <p className="font-mono text-xs font-medium text-gray-900">
                        {a.asset_code}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {a.content_type.toUpperCase()} · v{a.version}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No A asset</p>
              )}
            </div>

            {/* Pairing link */}
            <div className="flex items-center justify-center text-gray-300">
              <Link2 size={20} className="rotate-90 md:rotate-0" />
            </div>

            {/* B Side */}
            <div className="flex-1 rounded-lg border border-accent-200 bg-accent-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-accent-600" />
                  <span className="text-xs font-semibold text-accent-700 uppercase">
                    B — Digital Content
                  </span>
                </div>
                <button
                  className="text-xs font-medium text-accent-700 hover:underline"
                  onClick={() => setShowAddB(true)}
                >
                  + Add B
                </button>
              </div>
              {assetsB.length > 0 ? (
                <div className="space-y-2">
                  {assetsB.map((b) => (
                    <div key={b.id} className="text-sm">
                      <p className="font-mono text-xs font-medium text-gray-900">
                        {b.asset_code}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {b.content_type.toUpperCase()} · v{b.version}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No B content yet</p>
              )}
            </div>
          </div>
        </div>

        {/* A Assets detail */}
        <AssetSection
          title="A — Digital Product Master"
          icon={<Package size={16} />}
          assets={assetsA}
          onUpdate={handleAssetUpdate}
          onDelete={handleDeleteAsset}
          showCreateCampaign={false}
        />

        {/* B Assets detail */}
        <AssetSection
          title="B — Digital Content Master"
          icon={<Video size={16} />}
          assets={assetsB}
          onUpdate={handleAssetUpdate}
          onDelete={handleDeleteAsset}
          showCreateCampaign={true}
          onOpenCampaign={() => setShowCreateCampaign(true)}
        />
      </div>

      {showAddB && (
        <AddBContentModal
          open={showAddB}
          onClose={() => setShowAddB(false)}
          productId={product.id}
          productCode={product.product_code}
          existingCount={assetsB.length}
          onCreated={() => {
            setShowAddB(false);
            load();
          }}
        />
      )}

      {showCreateCampaign && (
        <CreateCampaignModal
          open={showCreateCampaign}
          onClose={() => setShowCreateCampaign(false)}
          product={product}
          bAssets={assetsB}
          onCreated={() => {
            setShowCreateCampaign(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function AssetSection({
  title,
  icon,
  assets,
  onUpdate,
  onDelete,
  showCreateCampaign,
  onOpenCampaign,
}: {
  title: string;
  icon: React.ReactNode;
  assets: Asset[];
  onUpdate: (id: string, updates: Partial<Asset>) => void;
  onDelete: (id: string, code: string) => void;
  showCreateCampaign?: boolean;
  onOpenCampaign?: () => void;
}) {
  if (assets.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200 bg-gray-50">
        {icon}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {assets.map((asset) => (
          <div key={asset.id} className="p-5">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono text-sm font-medium text-gray-900">
                {asset.asset_code}
              </span>
              <span className="text-xs text-gray-400">v{asset.version}</span>
              <ProductionStatusBadge status={asset.production_status} />
              <QC1Badge status={asset.qc1_status} />
              <CloudinaryStatusBadge status={asset.cloudinary_status} />
              {asset.asset_type === "B" && (
                <span
                  className={
                    asset.console2_available ? "badge-success" : "badge-neutral"
                  }
                >
                  Console 2: {asset.console2_available ? "Available" : "N/A"}
                </span>
              )}
              <button
                className="ml-auto text-gray-400 hover:text-error-600 transition-colors"
                onClick={() => onDelete(asset.id, asset.asset_code)}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {asset.file_name && (
              <p className="text-xs text-gray-500 mb-3 font-mono">
                File: {asset.file_name}
              </p>
            )}

            {asset.master_url && (
              <div className="mb-3 rounded-lg bg-gray-50 p-2 flex items-center gap-2">
                <Cloud size={14} className="text-gray-400 flex-shrink-0" />
                <a
                  href={asset.master_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:underline truncate"
                >
                  {asset.master_url}
                </a>
                <ExternalLink size={12} className="text-gray-400 flex-shrink-0" />
              </div>
            )}

            {asset.notes && (
              <p className="text-xs text-gray-500 mb-3">{asset.notes}</p>
            )}

            {/* Control actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Production status control */}
              <select
                className="input max-w-[180px] py-1.5 text-xs"
                value={asset.production_status}
                onChange={(e) =>
                  onUpdate(asset.id, {
                    production_status: e.target.value as Asset["production_status"],
                  })
                }
              >
                <option value="pending">Pending</option>
                <option value="in_production">In Production</option>
                <option value="result_ready">Result Ready</option>
                <option value="registered">Registered</option>
                <option value="qc1_pending">QC-1 Pending</option>
                <option value="qc1_passed">QC-1 Passed</option>
                <option value="qc1_failed">QC-1 Failed</option>
                <option value="master_stored">Master Stored</option>
              </select>

              {/* QC-1 actions */}
              <button
                className="btn-success py-1.5 text-xs"
                onClick={() =>
                  onUpdate(asset.id, {
                    qc1_status: "passed",
                    production_status: "qc1_passed",
                  })
                }
              >
                <CheckCircle size={14} /> QC-1 Pass
              </button>
              <button
                className="btn-danger py-1.5 text-xs"
                onClick={() =>
                  onUpdate(asset.id, {
                    qc1_status: "failed",
                    production_status: "qc1_failed",
                  })
                }
              >
                <XCircle size={14} /> QC-1 Fail
              </button>

              {/* Register master URL */}
              <button
                className="btn-secondary py-1.5 text-xs"
                onClick={() => {
                  const url = prompt("Enter the Cloudinary master URL:");
                  if (url) {
                    onUpdate(asset.id, {
                      master_url: url.trim(),
                      cloudinary_status: "stored",
                      production_status: "master_stored",
                    });
                  }
                }}
              >
                <Cloud size={14} /> Register Master URL
              </button>

              {/* Make B available for Console 2 */}
              {asset.asset_type === "B" && (
                <button
                  className={`py-1.5 text-xs ${
                    asset.console2_available
                      ? "btn-secondary"
                      : "btn-warning"
                  }`}
                  onClick={() =>
                    onUpdate(asset.id, {
                      console2_available: !asset.console2_available,
                    })
                  }
                >
                  <Megaphone size={14} />
                  {asset.console2_available
                    ? "Revoke Console 2"
                    : "Make Available for Console 2"}
                </button>
              )}
            </div>

            {/* Manual warning */}
            {asset.production_mode === "MANUAL" && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-500">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>
                  MANUAL mode: production happens outside the app. Register
                  the finished result here, then run QC-1.
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddBContentModal({
  open,
  onClose,
  productId,
  productCode,
  existingCount,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  productId: string;
  productCode: string;
  existingCount: number;
  onCreated: () => void;
}) {
  const [contentType, setContentType] = useState("video/mp4");
  const [productionMode, setProductionMode] = useState<ProductionMode>("MANUAL");
  const [fileName, setFileName] = useState("");
  const [creating, setCreating] = useState(false);

  const assetCode =
    existingCount === 0
      ? `${productCode}-B`
      : `${productCode}-B-VID-${String(existingCount + 1).padStart(2, "0")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createAsset({
        product_id: productId,
        asset_type: "B",
        asset_code: assetCode,
        content_type: contentType,
        production_mode: productionMode,
        file_name: fileName.trim() || undefined,
      });
      showToast("success", `B content ${assetCode} created`);
      setContentType("video/mp4");
      setProductionMode("MANUAL");
      setFileName("");
      onCreated();
    } catch (err) {
      showToast("error", "Failed to create B content");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Add B Content to ${productCode}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-accent-50 p-3 text-sm">
          <p className="font-mono text-xs text-accent-700">
            Asset ID: {assetCode}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Content Type</label>
            <select
              className="input"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              {CONTENT_TYPES_B.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Production Mode</label>
            <select
              className="input"
              value={productionMode}
              onChange={(e) =>
                setProductionMode(e.target.value as ProductionMode)
              }
            >
              {PRODUCTION_MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">File Name</label>
          <input
            className="input font-mono text-xs"
            placeholder={`${assetCode}-V1.mp4`}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={creating}>
            {creating ? "Creating..." : "Create B Content"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CreateCampaignModal({
  open,
  onClose,
  product,
  bAssets,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  product: ProductWithAssets;
  bAssets: Asset[];
  onCreated: () => void;
}) {
  const availableB = bAssets.filter((b) => b.console2_available);
  const [assetId, setAssetId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cta, setCta] = useState("");
  const [productLink, setProductLink] = useState("");
  const [platform, setPlatform] = useState<"tiktok" | "facebook" | "youtube">("tiktok");
  const [channelName, setChannelName] = useState("");
  const [channelId, setChannelId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId) {
      showToast("warning", "Select a B content asset");
      return;
    }
    if (!title.trim()) {
      showToast("warning", "Campaign title is required");
      return;
    }
    setCreating(true);
    try {
      await createCampaign({
        asset_id: assetId,
        product_id: product.id,
        title: title.trim(),
        description: description.trim() || undefined,
        cta: cta.trim() || undefined,
        product_link: productLink.trim() || undefined,
        target_platform: platform,
        channel_name: channelName.trim() || undefined,
        channel_id: channelId.trim() || undefined,
        scheduled_at: scheduledAt || undefined,
      });
      showToast("success", "Marketing campaign created");
      setTitle("");
      setDescription("");
      setCta("");
      setProductLink("");
      setChannelName("");
      setChannelId("");
      setScheduledAt("");
      onCreated();
    } catch (err) {
      showToast("error", "Failed to create campaign");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Marketing Campaign" size="lg">
      {availableB.length === 0 ? (
        <div className="rounded-lg bg-warning-50 border border-warning-200 p-4 text-sm text-warning-800">
          No B content is available for Console 2 yet. Mark a B asset as
          "Available for Console 2" first.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">B Content (Source) *</label>
            <select
              className="input"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
            >
              <option value="">Select B content...</option>
              {availableB.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.asset_code} (v{b.version})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Campaign Title *</label>
            <input
              className="input"
              placeholder="e.g. Budget Planner — TikTok Promo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Description / Caption</label>
            <textarea
              className="input min-h-[70px]"
              placeholder="Campaign caption / description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">CTA</label>
              <input
                className="input"
                placeholder="e.g. Get yours now!"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Product Link</label>
              <input
                className="input"
                placeholder="https://..."
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Target Platform</label>
              <select
                className="input"
                value={platform}
                onChange={(e) =>
                  setPlatform(
                    e.target.value as "tiktok" | "facebook" | "youtube"
                  )
                }
              >
                {TARGET_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Schedule (optional)</label>
              <input
                type="datetime-local"
                className="input"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Channel Name</label>
              <input
                className="input"
                placeholder="e.g. MR.ONE Official"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Channel ID</label>
              <input
                className="input"
                placeholder="Platform channel ID"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={creating}>
              {creating ? "Creating..." : "Create Campaign"}
            </button>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            Campaign starts as Draft. Use Console 2 to move it through
            Preview → QC-2 → Approve → Schedule. Buffer integration is NOT
            VERIFIED — scheduling is recorded only.
          </div>
        </form>
      )}
    </Modal>
  );
}
